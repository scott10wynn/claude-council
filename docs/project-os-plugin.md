# Claude Project OS — Plugin Design

A long-term project operating system built as an MCP server that gives Claude
persistent memory, a knowledge graph, external tool integrations, and proactive
intelligence across every conversation.

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER / CLAUDE UI                          │
│              (claude.ai, Claude Code, API clients)               │
└────────────────────────────┬────────────────────────────────────┘
                             │  MCP protocol (JSON-RPC over stdio/SSE)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PROJECT-OS MCP SERVER                         │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐    │
│  │  Tool Layer │  │ Memory Layer │  │  Integration Layer  │    │
│  │  (30+ tools)│  │  (retrieval) │  │  (Notion/GH/Drive)  │    │
│  └──────┬──────┘  └──────┬───────┘  └──────────┬──────────┘    │
│         └────────────────┼─────────────────────┘               │
│                          ▼                                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Core Engine                             │  │
│  │  Graph Manager │ Memory Retriever │ Contradiction Detector │  │
│  │  Summarizer    │ Reminder Engine  │ Context Builder        │  │
│  └────────────────────────┬──────────────────────────────────┘  │
└───────────────────────────┼─────────────────────────────────────┘
                            │
          ┌─────────────────┼──────────────────┐
          ▼                 ▼                  ▼
┌──────────────┐  ┌──────────────────┐  ┌────────────────┐
│  PostgreSQL  │  │  Qdrant (vector) │  │  Redis (cache) │
│  (graph +    │  │  (embeddings +   │  │  (sessions +   │
│   metadata)  │  │   semantic mem)  │  │   rate limits) │
└──────────────┘  └──────────────────┘  └────────────────┘
```

### MCP Tool Categories

| Category       | Tools                                                        |
|----------------|--------------------------------------------------------------|
| Memory         | `remember`, `recall`, `forget`, `list_memories`              |
| Graph          | `add_node`, `add_edge`, `query_graph`, `find_contradictions` |
| Projects       | `create_project`, `update_project`, `get_project_context`    |
| People         | `add_person`, `get_person`, `link_person_to_project`         |
| Decisions      | `log_decision`, `get_decisions`, `flag_assumption`           |
| Tasks          | `add_task`, `complete_task`, `get_next_steps`                |
| Integrations   | `sync_notion`, `sync_github`, `sync_drive`, `send_email`     |
| Intelligence   | `summarize_project`, `detect_drift`, `suggest_next_steps`    |

---

## 2. Database Schema

### PostgreSQL — Relational + Graph

```sql
-- Core entity table (all node types share this)
CREATE TABLE nodes (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type        TEXT NOT NULL,  -- project|goal|task|person|decision|assumption|file|note
    title       TEXT NOT NULL,
    body        TEXT,
    status      TEXT DEFAULT 'active',  -- active|archived|completed|contradicted
    owner_id    UUID,                   -- user who created it
    metadata    JSONB DEFAULT '{}',
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_nodes_type   ON nodes(type);
CREATE INDEX idx_nodes_status ON nodes(status);
CREATE INDEX idx_nodes_meta   ON nodes USING gin(metadata);

-- Directed edges between nodes
CREATE TABLE edges (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_id     UUID NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
    to_id       UUID NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
    rel_type    TEXT NOT NULL,  -- depends_on|assigned_to|part_of|blocks|informs|contradicts
    weight      FLOAT DEFAULT 1.0,
    metadata    JSONB DEFAULT '{}',
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_edges_from ON edges(from_id);
CREATE INDEX idx_edges_to   ON edges(to_id);
CREATE INDEX idx_edges_rel  ON edges(rel_type);

-- Immutable conversation log
CREATE TABLE memories (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id      TEXT NOT NULL,
    node_id         UUID REFERENCES nodes(id),  -- optional link to a node
    content         TEXT NOT NULL,
    content_type    TEXT DEFAULT 'observation',  -- observation|decision|assumption|question|answer
    importance      FLOAT DEFAULT 0.5,           -- 0-1, bumped by contradiction/reference
    embedding_id    TEXT,                        -- ID in Qdrant
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_memories_session  ON memories(session_id);
CREATE INDEX idx_memories_node     ON memories(node_id);
CREATE INDEX idx_memories_type     ON memories(content_type);

-- Tracked assumptions with contradiction history
CREATE TABLE assumptions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_id         UUID REFERENCES nodes(id),
    statement       TEXT NOT NULL,
    confidence      FLOAT DEFAULT 0.8,
    status          TEXT DEFAULT 'active',  -- active|confirmed|contradicted|superseded
    evidence_for    TEXT[],
    evidence_against TEXT[],
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    resolved_at     TIMESTAMPTZ
);

-- Scheduled reminders
CREATE TABLE reminders (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_id     UUID REFERENCES nodes(id),
    message     TEXT NOT NULL,
    due_at      TIMESTAMPTZ NOT NULL,
    recurrence  TEXT,        -- cron expression or null
    delivered   BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Integration sync state
CREATE TABLE integrations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider        TEXT NOT NULL,  -- notion|github|gdrive|gmail|excel
    resource_id     TEXT NOT NULL,  -- external ID (page ID, repo, file ID)
    node_id         UUID REFERENCES nodes(id),
    last_synced_at  TIMESTAMPTZ,
    sync_cursor     TEXT,           -- pagination token / last-modified etag
    credentials     TEXT,           -- encrypted OAuth token reference
    UNIQUE(provider, resource_id)
);

-- Per-user config + encrypted credential refs
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           TEXT UNIQUE NOT NULL,
    settings        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### Qdrant — Vector Collections

```python
# Collection: "memories"
{
    "vectors": {"size": 1536, "distance": "Cosine"},
    "payload_schema": {
        "memory_id":   "keyword",
        "node_id":     "keyword",
        "content_type":"keyword",
        "importance":  "float",
        "created_at":  "datetime",
        "project_ids": "keyword[]"  # multi-project tagging
    }
}

# Collection: "nodes"  (for semantic node search)
{
    "vectors": {"size": 1536, "distance": "Cosine"},
    "payload_schema": {
        "node_id":  "keyword",
        "type":     "keyword",
        "title":    "keyword",
        "status":   "keyword"
    }
}
```

---

## 3. Memory Retrieval System

The retrieval pipeline runs before every Claude response to inject relevant
context without exceeding the context window.

### Retrieval Pipeline

```
incoming message
      │
      ▼
┌─────────────────┐     ┌──────────────────────┐
│ 1. Embed query  │────▶│ Qdrant hybrid search  │
│    (OpenAI ada  │     │ (semantic + BM25)     │
│     or Cohere)  │     └──────────┬───────────┘
└─────────────────┘                │ top-K candidates
                                   ▼
                     ┌─────────────────────────┐
                     │ 2. Re-rank              │
                     │  - recency decay        │
                     │  - importance score     │
                     │  - graph distance       │
                     │    to active project    │
                     └──────────┬──────────────┘
                                │
                                ▼
                     ┌─────────────────────────┐
                     │ 3. Graph expansion      │
                     │  pull 1-hop neighbors   │
                     │  of top results         │
                     └──────────┬──────────────┘
                                │
                                ▼
                     ┌─────────────────────────┐
                     │ 4. Budget packing       │
                     │  fit into token budget  │
                     │  (default 8k tokens)    │
                     └──────────┬──────────────┘
                                │
                                ▼
                        context_block string
                        injected into system prompt
```

### Retrieval Scoring Formula

```python
def score(candidate, query_embedding, now):
    semantic  = cosine_sim(candidate.embedding, query_embedding)
    recency   = math.exp(-0.1 * days_ago(candidate.created_at, now))
    importance = candidate.importance          # 0–1 stored on record
    graph_dist = 1 / (1 + hops_to_active_project(candidate.node_id))

    return (
        0.45 * semantic +
        0.25 * recency  +
        0.20 * importance +
        0.10 * graph_dist
    )
```

### Contradiction Detection

Every new `assumption` is embedded and compared against existing active
assumptions. A contradiction is flagged when:

- Semantic similarity > 0.82 **and** the polarity classifier returns opposing
  sentiment (e.g. "we will use Postgres" vs "we decided against Postgres").
- A simple negation heuristic catches ~70% of cases cheaply before the
  classifier runs.

```python
async def detect_contradictions(new_statement: str, project_id: str):
    embedding = await embed(new_statement)
    candidates = await qdrant.search(
        collection="assumptions",
        vector=embedding,
        filter={"project_id": project_id, "status": "active"},
        limit=10
    )
    contradictions = []
    for c in candidates:
        if c.score > 0.82:
            polarity = classifier.predict([new_statement, c.payload["statement"]])
            if polarity == "contradiction":
                contradictions.append(c)
    return contradictions
```

---

## 4. MCP Server Implementation

### Server Setup (Python + FastMCP)

```python
# server.py
from mcp.server.fastmcp import FastMCP
from app.db import db
from app.memory import MemoryEngine
from app.graph import GraphEngine
from app.integrations import IntegrationRouter

mcp = FastMCP("project-os")
memory = MemoryEngine()
graph  = GraphEngine()
integrations = IntegrationRouter()

@mcp.tool()
async def remember(content: str, content_type: str = "observation",
                   project_id: str | None = None, importance: float = 0.5) -> dict:
    """Store a piece of information in long-term memory."""
    memory_id = await memory.store(
        content=content,
        content_type=content_type,
        project_id=project_id,
        importance=importance
    )
    return {"memory_id": memory_id, "status": "stored"}

@mcp.tool()
async def recall(query: str, project_id: str | None = None,
                 limit: int = 10) -> list[dict]:
    """Retrieve relevant memories using semantic + graph search."""
    return await memory.retrieve(query=query, project_id=project_id, limit=limit)

@mcp.tool()
async def add_node(type: str, title: str, body: str = "",
                   metadata: dict = {}) -> dict:
    """Add a node (project, goal, task, person, decision) to the knowledge graph."""
    node = await graph.create_node(type=type, title=title,
                                   body=body, metadata=metadata)
    await memory.store(f"Created {type}: {title}", content_type="observation",
                       importance=0.7)
    return node

@mcp.tool()
async def add_edge(from_id: str, to_id: str, rel_type: str,
                   metadata: dict = {}) -> dict:
    """Connect two nodes with a typed relationship."""
    return await graph.create_edge(from_id, to_id, rel_type, metadata)

@mcp.tool()
async def flag_assumption(statement: str, project_id: str,
                           confidence: float = 0.8) -> dict:
    """Log an assumption and check it against existing ones for contradictions."""
    contradictions = await memory.detect_contradictions(statement, project_id)
    assumption_id = await db.create_assumption(
        statement=statement, project_id=project_id, confidence=confidence
    )
    return {
        "assumption_id": assumption_id,
        "contradictions_found": len(contradictions),
        "contradictions": [c.payload for c in contradictions]
    }

@mcp.tool()
async def get_project_context(project_id: str) -> dict:
    """Return a full context snapshot: goals, open tasks, recent decisions, assumptions."""
    return await graph.build_project_context(project_id)

@mcp.tool()
async def suggest_next_steps(project_id: str) -> list[str]:
    """Analyze project state and return prioritized suggested next steps."""
    context = await graph.build_project_context(project_id)
    # Pass to a sub-Claude call with structured output
    return await intelligence.suggest_next_steps(context)

@mcp.tool()
async def sync_github(repo: str, project_id: str) -> dict:
    """Pull issues, PRs, and commits from a GitHub repo into the project graph."""
    return await integrations.github.sync(repo=repo, project_id=project_id)

@mcp.tool()
async def sync_notion(page_id: str, project_id: str) -> dict:
    """Sync a Notion page/database into the project graph."""
    return await integrations.notion.sync(page_id=page_id, project_id=project_id)
```

### Memory Engine Core

```python
# app/memory.py
import anthropic
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, Filter, FieldCondition, MatchValue
import uuid, math
from datetime import datetime, timezone

client = anthropic.Anthropic()
qdrant = QdrantClient(host="localhost", port=6333)

class MemoryEngine:
    async def store(self, content: str, content_type: str,
                    project_id: str | None, importance: float) -> str:
        embedding = await self._embed(content)
        memory_id = str(uuid.uuid4())

        # Store vector
        qdrant.upsert("memories", points=[
            PointStruct(
                id=memory_id,
                vector=embedding,
                payload={
                    "content": content,
                    "content_type": content_type,
                    "project_id": project_id,
                    "importance": importance,
                    "created_at": datetime.now(timezone.utc).isoformat()
                }
            )
        ])

        # Store in Postgres for relational queries
        await db.memories.insert(id=memory_id, content=content,
                                  content_type=content_type,
                                  embedding_id=memory_id,
                                  importance=importance)
        return memory_id

    async def retrieve(self, query: str, project_id: str | None,
                       limit: int = 10) -> list[dict]:
        embedding = await self._embed(query)
        filters = []
        if project_id:
            filters.append(FieldCondition(
                key="project_id", match=MatchValue(value=project_id)
            ))

        results = qdrant.search(
            collection_name="memories",
            query_vector=embedding,
            query_filter=Filter(must=filters) if filters else None,
            limit=limit * 2  # oversample before re-ranking
        )

        now = datetime.now(timezone.utc)
        scored = []
        for r in results:
            created = datetime.fromisoformat(r.payload["created_at"])
            days_ago = (now - created).days
            recency = math.exp(-0.1 * days_ago)
            score = (0.45 * r.score +
                     0.25 * recency +
                     0.30 * r.payload["importance"])
            scored.append({**r.payload, "_score": score, "id": r.id})

        scored.sort(key=lambda x: x["_score"], reverse=True)
        return scored[:limit]

    async def _embed(self, text: str) -> list[float]:
        # Use Claude's recommended embedding provider
        # (swap for openai, cohere, or voyage as preferred)
        import openai
        resp = openai.embeddings.create(model="text-embedding-3-small", input=text)
        return resp.data[0].embedding
```

### Proactive Intelligence (Sub-Agent Pattern)

```python
# app/intelligence.py
import anthropic, json

client = anthropic.Anthropic()

async def suggest_next_steps(context: dict) -> list[str]:
    prompt = f"""You are a project intelligence engine. Given the following
project context, suggest the 3-5 most important next steps. Be specific and
actionable. Return JSON array of strings.

Context:
{json.dumps(context, indent=2)}"""

    response = client.messages.create(
        model="claude-opus-4-7",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}]
    )
    return json.loads(response.content[0].text)

async def summarize_project(context: dict) -> str:
    """Generate an executive summary of project state."""
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=512,
        system="You are a crisp executive summarizer. 3-4 sentences max.",
        messages=[{"role": "user", "content": json.dumps(context)}]
    )
    return response.content[0].text

async def detect_project_drift(context: dict, original_goals: list[str]) -> dict:
    """Compare current work against original goals to detect scope/direction drift."""
    prompt = f"""Compare these original goals against the current project state.
Identify any drift, scope creep, or forgotten objectives.
Return JSON: {{"drift_detected": bool, "issues": [str], "severity": "low|medium|high"}}

Original goals: {original_goals}
Current state: {json.dumps(context)}"""

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=512,
        messages=[{"role": "user", "content": prompt}]
    )
    return json.loads(response.content[0].text)
```

---

## 5. Integration Layer

### Integration Router

```python
# app/integrations/__init__.py
from .github   import GitHubIntegration
from .notion   import NotionIntegration
from .gdrive   import GoogleDriveIntegration
from .gmail    import GmailIntegration
from .excel    import ExcelIntegration

class IntegrationRouter:
    def __init__(self):
        self.github = GitHubIntegration()
        self.notion = NotionIntegration()
        self.gdrive = GoogleDriveIntegration()
        self.gmail  = GmailIntegration()
        self.excel  = ExcelIntegration()
```

### GitHub Integration

```python
# app/integrations/github.py
from github import Github  # PyGithub
from app.graph import GraphEngine

class GitHubIntegration:
    async def sync(self, repo: str, project_id: str) -> dict:
        g = Github(self._get_token())
        r = g.get_repo(repo)
        graph = GraphEngine()

        synced = {"issues": 0, "prs": 0, "commits": 0}

        # Sync open issues as tasks
        for issue in r.get_issues(state="open"):
            await graph.create_node(
                type="task",
                title=issue.title,
                body=issue.body or "",
                metadata={
                    "source": "github",
                    "github_number": issue.number,
                    "url": issue.html_url,
                    "labels": [l.name for l in issue.labels],
                    "assignees": [a.login for a in issue.assignees]
                }
            )
            synced["issues"] += 1

        # Sync recent commits as decisions/observations
        for commit in r.get_commits()[:20]:
            await memory.store(
                content=f"Commit: {commit.commit.message}",
                content_type="observation",
                project_id=project_id,
                importance=0.4
            )
            synced["commits"] += 1

        return synced
```

### Notion Integration

```python
# app/integrations/notion.py
from notion_client import Client as NotionClient

class NotionIntegration:
    async def sync(self, page_id: str, project_id: str) -> dict:
        notion = NotionClient(auth=self._get_token())
        page = notion.pages.retrieve(page_id=page_id)
        blocks = notion.blocks.children.list(block_id=page_id)

        # Convert blocks to text
        content = self._blocks_to_text(blocks["results"])

        # Store as memory with high importance
        await memory.store(
            content=f"Notion page '{page['properties']['title']}': {content}",
            content_type="observation",
            project_id=project_id,
            importance=0.8
        )

        # Extract any action items (lines starting with [ ] or TODO)
        tasks = self._extract_tasks(content)
        for task_text in tasks:
            await graph.create_node(type="task", title=task_text,
                                     metadata={"source": "notion",
                                               "notion_page_id": page_id})

        return {"page_synced": True, "tasks_found": len(tasks)}
```

---

## 6. System Prompt Injection

At conversation start, the MCP server injects a context block into the
Claude system prompt via a `resources` endpoint:

```python
@mcp.resource("project-os://context/{project_id}")
async def get_context_resource(project_id: str) -> str:
    ctx = await graph.build_project_context(project_id)
    memories = await memory.retrieve(
        query="recent important updates",
        project_id=project_id,
        limit=15
    )
    reminders = await db.get_due_reminders(project_id=project_id)

    return f"""## Project OS Context

**Active Project:** {ctx['title']}
**Status:** {ctx['status']}
**Open Tasks:** {len(ctx['open_tasks'])}

**Recent Decisions:**
{chr(10).join(f"- {d['title']}" for d in ctx['recent_decisions'][:5])}

**Active Assumptions:**
{chr(10).join(f"- [{a['confidence']:.0%}] {a['statement']}" for a in ctx['assumptions'][:5])}

**Relevant Memories:**
{chr(10).join(f"- {m['content']}" for m in memories[:10])}

**Due Reminders:**
{chr(10).join(f"- {r['message']} (due {r['due_at']})" for r in reminders)}
"""
```

---

## 7. UI/UX Design

### Web Dashboard

```
┌────────────────────────────────────────────────────────┐
│  PROJECT OS                              [+ New Project]│
├──────────────┬─────────────────────────────────────────┤
│              │  ● Project Alpha          [Chat] [Graph] │
│  PROJECTS    │  ─────────────────────────────────────  │
│  ─────────   │  Goals (3)  Tasks (12/20)  Decisions(8) │
│  ● Alpha  ←  │                                         │
│  ○ Beta      │  KNOWLEDGE GRAPH              [Expand]  │
│  ○ Finance   │  ┌────────────────────────────────────┐ │
│              │  │  [Goal]──[Task]──[Person]           │ │
│  PEOPLE      │  │     └──[Decision]──[Assumption]     │ │
│  ─────────   │  └────────────────────────────────────┘ │
│  Alice       │                                         │
│  Bob         │  ASSUMPTIONS                 [+Add]     │
│              │  ⚠ [85%] "Backend will use Postgres"    │
│  REMINDERS   │  ✓ [95%] "Launch date is Q3"            │
│  ─────────   │  ✗ CONTRADICTION DETECTED               │
│  2 due today │    "We'll use MySQL" conflicts with ↑   │
└──────────────┴─────────────────────────────────────────┘
```

### Claude Chat Sidebar Overlay

When using the plugin inside Claude.ai, a collapsible sidebar shows:
- Active project badge
- 3 suggested next actions (refreshed each session)
- Due reminders with snooze
- Quick memory search (`/recall <query>`)
- Integration sync status dots (green/yellow/red)

### CLI Interface

```bash
# Quick memory recall
project-os recall "what did we decide about the API design"

# Add a decision
project-os decide "We will use event sourcing for the audit log" --project alpha

# Get today's briefing
project-os briefing

# Sync all connected sources
project-os sync --all

# Show the graph for a project
project-os graph alpha --depth 2
```

---

## 8. Security & Privacy

### Threat Model

| Threat                    | Mitigation                                               |
|---------------------------|----------------------------------------------------------|
| Credential leakage        | All OAuth tokens stored encrypted (AES-256-GCM) in Postgres; keys in KMS (AWS/GCP). Never stored in memory or logs. |
| Prompt injection via synced content | All external content (Notion, email bodies, GitHub issues) is wrapped in XML tags and treated as data, never as instructions. Claude is instructed to ignore commands in `<external_content>` tags. |
| Memory poisoning          | Memories from external sources have `source_trust: external` flag; lower weight in retrieval scoring. |
| Cross-user data bleed     | Every DB query enforces `WHERE owner_id = $user_id` via middleware; no global queries possible. |
| LLM sees credentials      | Integration tokens never appear in prompts; only resolved server-side. |
| Data retention            | Per-user configurable retention policies; hard delete on request with vector tombstoning. |

### Credential Storage

```python
# app/security/credentials.py
from cryptography.fernet import Fernet
import boto3

class CredentialStore:
    def __init__(self):
        # Key lives in AWS KMS, never in app memory at rest
        self.kms = boto3.client("kms")
        self._key_id = os.environ["KMS_KEY_ID"]

    def store(self, user_id: str, provider: str, token: str) -> str:
        """Encrypt and store; return opaque reference ID."""
        encrypted = self.kms.encrypt(
            KeyId=self._key_id,
            Plaintext=token.encode()
        )["CiphertextBlob"]
        ref_id = str(uuid.uuid4())
        db.credentials.insert(id=ref_id, user_id=user_id,
                               provider=provider, encrypted_token=encrypted)
        return ref_id

    def resolve(self, ref_id: str, user_id: str) -> str:
        """Decrypt only at point of use; result never persisted."""
        row = db.credentials.get(id=ref_id, user_id=user_id)  # enforces ownership
        return self.kms.decrypt(
            CiphertextBlob=row.encrypted_token
        )["Plaintext"].decode()
```

---

## 9. Example Workflows

### Workflow A — Software Project Standup

> **User:** "What's the status of Project Alpha? What should I work on today?"

1. MCP server loads project context (graph + 15 recent memories).
2. Retrieval pipeline scores and injects into Claude's system prompt.
3. Claude responds with a structured standup: done, in-progress, blocked, suggested.
4. User says "We decided to drop the mobile app scope."
5. `flag_assumption("No mobile app in v1", project_id="alpha")` is called.
6. Contradiction detected: earlier assumption "Mobile app ships in Q3" is flagged.
7. Claude surfaces the contradiction and asks for confirmation before archiving.

### Workflow B — Financial Research

> **User:** "I'm building a DCF model for CompanyX. Sync the last earnings call notes from Drive."

1. `sync_gdrive(file_id="...", project_id="companyX-dcf")` pulls the doc.
2. Key assumptions extracted: revenue growth 12%, WACC 9%, terminal multiple 18x.
3. Each assumption is stored with `content_type="assumption"` and linked to the DCF node.
4. Next session: "The WACC should be 11% based on current rates."
5. Contradiction with stored "WACC 9%" is caught automatically.
6. Claude says: "I see a conflict with your earlier WACC assumption. Should I update it and flag the impact on your model?"

### Workflow C — Cross-Project Person Tracking

> **User:** "Add a meeting note: Alice reviewed the contract and wants changes to Section 4."

1. `remember(content="Alice wants changes to contract Section 4", content_type="decision", project_id="legal-2026")` called.
2. Person node "Alice" looked up; if none exists, created.
3. Edge added: Alice → contract-review decision.
4. Later: "Who's been involved in the contract work?"
5. `query_graph(start_node="contract-review", rel_types=["assigned_to","reviewed_by"])` traverses and returns Alice + her linked decisions.

### Workflow D — Weekly Briefing (Proactive)

Cron job fires every Monday 08:00:

1. For each active project, `summarize_project()` runs.
2. `detect_project_drift()` compares current state vs. original goals.
3. Due reminders are collected.
4. A digest email is sent (or pushed as a Claude conversation opener):
   - "Alpha: 3 tasks overdue. Original goal was to ship by June — you're 2 sprints behind."
   - "Finance model: WACC assumption is 6 weeks old. Consider refreshing."

---

## 10. Tech Stack

### Core
| Layer         | Technology                              | Why                                      |
|---------------|-----------------------------------------|------------------------------------------|
| MCP Server    | Python 3.12 + `mcp` SDK (FastMCP)      | Official SDK, async-native               |
| API Framework | FastAPI                                 | Used for webhook receivers + admin API   |
| Relational DB | PostgreSQL 16 + pgvector (fallback)    | JSONB for flexible metadata, ACID        |
| Vector DB     | Qdrant                                  | Self-hostable, fast, rich filtering      |
| Cache/Queue   | Redis 7                                 | Session cache, job queue via RQ          |
| Embeddings    | OpenAI `text-embedding-3-small`         | 1536-dim, cheap, fast                    |
| LLM (sub)     | `claude-opus-4-7` / `claude-sonnet-4-6` | Intelligence tasks via Anthropic SDK     |

### Infrastructure
| Component     | Technology            |
|---------------|-----------------------|
| Container     | Docker + Compose      |
| Secrets       | AWS KMS or HashiCorp Vault |
| Auth          | OAuth 2.0 per provider; JWT for internal API |
| Scheduling    | APScheduler (embedded) or Celery Beat |
| Monitoring    | OpenTelemetry → Grafana |

### Integrations
| Service       | Library / API                   |
|---------------|---------------------------------|
| Notion        | `notion-client` (Python)        |
| GitHub        | `PyGithub` or REST API          |
| Google Drive  | `google-api-python-client`      |
| Gmail         | Gmail API (same OAuth scope)    |
| Excel/Sheets  | `openpyxl` + Google Sheets API  |

---

## 11. MVP vs. Advanced Features

### MVP (4–6 weeks, solo developer)

- [ ] MCP server with `remember`, `recall`, `add_node`, `add_edge`, `flag_assumption`
- [ ] PostgreSQL + Qdrant setup with Docker Compose
- [ ] Basic retrieval pipeline (semantic search + recency decay)
- [ ] GitHub sync (issues + recent commits)
- [ ] Simple contradiction detection (embedding similarity only)
- [ ] Context injection into Claude system prompt
- [ ] CLI tool for `recall`, `briefing`, `decide`
- [ ] Single-user, local deployment

### V1 (2–3 months)

- [ ] All integrations: Notion, Google Drive, Gmail, Excel
- [ ] Full contradiction detection with polarity classifier
- [ ] Project drift detection
- [ ] Proactive suggestions (`suggest_next_steps`)
- [ ] Reminder engine with cron support
- [ ] Web dashboard (React, read-only graph view)
- [ ] Multi-project support with context switching
- [ ] Encrypted credential storage

### Advanced (6+ months)

- [ ] Multi-user with role-based graph access
- [ ] Real-time sync via webhooks (GitHub, Notion)
- [ ] Graph visualization with force-directed layout (D3 or Cytoscape)
- [ ] Custom assumption confidence models (fine-tuned on user history)
- [ ] Cross-project insight ("You made a similar decision in Project Beta — want to compare?")
- [ ] Automatic meeting note parsing (Zoom transcript → nodes)
- [ ] Finance-specific templates (DCF assumptions graph, deal tracking)
- [ ] Mobile push notifications for reminders
- [ ] Export to Notion/Confluence/PDF

---

## 12. Project Structure

```
project-os/
├── server.py                 # MCP server entry point
├── docker-compose.yml        # Postgres + Qdrant + Redis
├── app/
│   ├── db.py                 # Postgres connection pool
│   ├── memory.py             # MemoryEngine
│   ├── graph.py              # GraphEngine
│   ├── intelligence.py       # Claude sub-agent calls
│   ├── security/
│   │   └── credentials.py    # KMS-backed credential store
│   ├── integrations/
│   │   ├── github.py
│   │   ├── notion.py
│   │   ├── gdrive.py
│   │   ├── gmail.py
│   │   └── excel.py
│   └── scheduler.py          # Reminder + briefing cron
├── cli/
│   └── project_os.py         # Click CLI tool
├── migrations/
│   └── 001_initial_schema.sql
└── tests/
    ├── test_memory.py
    ├── test_graph.py
    └── test_contradictions.py
```

---

## 13. Getting Started (Developer Quickstart)

```bash
# 1. Clone and install
git clone <repo>
pip install -e ".[dev]"

# 2. Start infrastructure
docker compose up -d  # postgres, qdrant, redis

# 3. Run migrations
psql $DATABASE_URL < migrations/001_initial_schema.sql

# 4. Configure MCP server in Claude Code
# Add to .claude/settings.json:
# {
#   "mcpServers": {
#     "project-os": {
#       "command": "python",
#       "args": ["server.py"],
#       "env": { "DATABASE_URL": "...", "QDRANT_URL": "..." }
#     }
#   }
# }

# 5. Start the server
python server.py

# 6. Test in Claude Code
# /mcp  → should show project-os tools listed
```

---

*This document is a living design spec. As implementation progresses, update
the schema versions in `migrations/` and keep the tool signatures in sync with
`server.py`.*
