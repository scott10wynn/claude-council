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
-- Users must be created first; nodes and integrations FK reference it
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           TEXT UNIQUE NOT NULL,
    settings        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Core entity table (all node types share this)
CREATE TABLE nodes (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type        TEXT NOT NULL,  -- project|goal|task|person|decision|assumption|file|note
    title       TEXT NOT NULL,
    body        TEXT,
    status      TEXT DEFAULT 'active',  -- active|archived|completed|contradicted
    owner_id    UUID NOT NULL REFERENCES users(id),  -- user who created it
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
    project_id      UUID NOT NULL REFERENCES nodes(id),  -- scopes assumption to a project
    statement       TEXT NOT NULL,
    confidence      FLOAT DEFAULT 0.8,
    status          TEXT DEFAULT 'active',  -- active|confirmed|contradicted|superseded
    evidence_for    TEXT[],
    evidence_against TEXT[],
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    resolved_at     TIMESTAMPTZ
);

CREATE INDEX idx_assumptions_project ON assumptions(project_id);
CREATE INDEX idx_assumptions_status  ON assumptions(status);

-- Scheduled reminders
CREATE TABLE reminders (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id),
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
    user_id         UUID NOT NULL REFERENCES users(id),
    provider        TEXT NOT NULL,  -- notion|github|gdrive|gmail|excel
    resource_id     TEXT NOT NULL,  -- external ID (page ID, repo, file ID)
    node_id         UUID REFERENCES nodes(id),
    last_synced_at  TIMESTAMPTZ,
    sync_cursor     TEXT,           -- pagination token / last-modified etag
    credentials     TEXT,           -- encrypted OAuth token reference
    UNIQUE(user_id, provider, resource_id)  -- per-user; multiple users can sync the same resource
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

# Collection: "assumptions"  (for contradiction detection)
{
    "vectors": {"size": 1536, "distance": "Cosine"},
    "payload_schema": {
        "assumption_id": "keyword",
        "project_id":    "keyword",
        "statement":     "keyword",
        "status":        "keyword",   # active|confirmed|contradicted|superseded
        "confidence":    "float",
        "created_at":    "datetime"
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
# This is a method on MemoryEngine (see Section 4) — shown here for reference.
# NLI is handled by _is_contradiction(), which calls Claude Haiku for binary classification.
# The "assumptions" Qdrant collection is defined above and populated by flag_assumption().
async def detect_contradictions(self, new_statement: str, project_id: str) -> list:
    embedding  = await self._embed(new_statement)
    candidates = await self._qdrant.search(
        collection_name="assumptions",
        query_vector=embedding,
        query_filter=Filter(must=[
            FieldCondition(key="project_id", match=MatchValue(value=project_id)),
            FieldCondition(key="status",     match=MatchValue(value="active")),
        ]),
        limit=10
    )
    return [c for c in candidates
            if c.score > 0.82 and await self._is_contradiction(
                new_statement, c.payload["statement"])]
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
from app.security.credentials import CredentialStore
from app import intelligence

mcp              = FastMCP("project-os")
memory           = MemoryEngine()
graph            = GraphEngine()
integrations     = IntegrationRouter(graph=graph, memory=memory)  # shared instances
credential_store = CredentialStore()

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
async def add_node(type: str, title: str, owner_id: str, body: str = "",
                   metadata: dict | None = None) -> dict:
    """Add a node (project, goal, task, person, decision) to the knowledge graph."""
    node = await graph.create_node(type=type, title=title, owner_id=owner_id,
                                   body=body, metadata=metadata or {})
    await memory.store(f"Created {type}: {title}", content_type="observation",
                       importance=0.7)
    return node

@mcp.tool()
async def add_edge(from_id: str, to_id: str, rel_type: str,
                   metadata: dict | None = None) -> dict:
    """Connect two nodes with a typed relationship."""
    return await graph.create_edge(from_id, to_id, rel_type, metadata or {})

@mcp.tool()
async def flag_assumption(statement: str, project_id: str,
                           confidence: float = 0.8) -> dict:
    """Log an assumption and check it against existing ones for contradictions."""
    contradictions  = await memory.detect_contradictions(statement, project_id)
    assumption_id   = await db.create_assumption(
        statement=statement, project_id=project_id, confidence=confidence
    )
    embedding = await memory._embed(statement)
    await db.upsert_assumption_in_qdrant(
        assumption_id=assumption_id, project_id=project_id,
        statement=statement, confidence=confidence, embedding=embedding
    )
    return {
        "assumption_id":       assumption_id,
        "contradictions_found": len(contradictions),
        "contradictions":      [c.payload for c in contradictions]
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
async def sync_github(repo: str, project_id: str, user_id: str) -> dict:
    """Pull issues, PRs, and commits from a GitHub repo into the project graph."""
    cred_ref = await db.get_integration_credential(user_id=user_id, provider="github")
    token    = await credential_store.resolve(cred_ref, user_id)
    return await integrations.github.sync(repo=repo, project_id=project_id,
                                          token=token, user_id=user_id)

@mcp.tool()
async def sync_notion(page_id: str, project_id: str, user_id: str) -> dict:
    """Sync a Notion page/database into the project graph."""
    cred_ref = await db.get_integration_credential(user_id=user_id, provider="notion")
    token    = await credential_store.resolve(cred_ref, user_id)
    return await integrations.notion.sync(page_id=page_id, project_id=project_id,
                                          token=token, user_id=user_id)
```

### Memory Engine Core

```python
# app/memory.py
import os
import openai
import uuid, math
from datetime import datetime, timezone
from anthropic import AsyncAnthropic
from qdrant_client import AsyncQdrantClient  # async client — no event-loop blocking
from qdrant_client.models import PointStruct, Filter, FieldCondition, MatchValue
from app.db import db

_openai = openai.AsyncOpenAI()  # module-level; import once, not per call

class MemoryEngine:
    def __init__(self):
        self._qdrant = AsyncQdrantClient(
            host=os.environ.get("QDRANT_HOST", "localhost"),
            port=int(os.environ.get("QDRANT_PORT", "6333"))
        )
        self._anthropic = AsyncAnthropic()  # class-level; one client for all contradiction checks

    async def store(self, content: str, content_type: str,
                    project_id: str | None, importance: float) -> str:
        embedding = await self._embed(content)
        memory_id = str(uuid.uuid4())

        await self._qdrant.upsert("memories", points=[
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

        results = await self._qdrant.search(
            collection_name="memories",
            query_vector=embedding,
            query_filter=Filter(must=filters),  # empty must == no filter
            limit=limit * 2  # oversample before re-ranking
        )

        now = datetime.now(timezone.utc)
        scored = []
        for r in results:
            created = datetime.fromisoformat(r.payload["created_at"])
            days_ago = (now - created).days
            recency   = math.exp(-0.1 * days_ago)
            # graph_dist: 0 if memory belongs to the queried project, 1 if a different
            # project, 99 if no project — avoids a graph traversal on every recall
            mem_project = r.payload.get("project_id")
            hops = 0 if mem_project == project_id else (1 if mem_project else 99)
            score = (0.45 * r.score +
                     0.25 * recency +
                     0.20 * r.payload["importance"] +
                     0.10 * (1 / (1 + hops)))
            scored.append({**r.payload, "_score": score, "id": r.id})

        scored.sort(key=lambda x: x["_score"], reverse=True)
        return scored[:limit]

    async def detect_contradictions(self, new_statement: str, project_id: str) -> list:
        embedding = await self._embed(new_statement)
        candidates = await self._qdrant.search(
            collection_name="assumptions",
            query_vector=embedding,
            query_filter=Filter(must=[
                FieldCondition(key="project_id", match=MatchValue(value=project_id)),
                FieldCondition(key="status",     match=MatchValue(value="active")),
            ]),
            limit=10
        )
        contradictions = []
        for c in candidates:
            if c.score > 0.82 and await self._is_contradiction(
                new_statement, c.payload["statement"]
            ):
                contradictions.append(c)
        return contradictions

    async def _is_contradiction(self, stmt_a: str, stmt_b: str) -> bool:
        """NLI via Claude Haiku — cheap and fast for binary classification."""
        response = await self._anthropic.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=5,
            system="Reply YES or NO only. No punctuation.",
            messages=[{"role": "user", "content":
                f"Do these two statements contradict each other?\nA: {stmt_a}\nB: {stmt_b}"}]
        )
        return response.content[0].text.strip().upper().startswith("YES")

    async def _embed(self, text: str) -> list[float]:
        resp = await _openai.embeddings.create(model="text-embedding-3-small", input=text)
        return resp.data[0].embedding
```

### Proactive Intelligence (Sub-Agent Pattern)

```python
# app/intelligence.py
import anthropic, json

client = anthropic.AsyncAnthropic()  # async client — non-blocking in async context

async def suggest_next_steps(context: dict) -> list[str]:
    prompt = f"""You are a project intelligence engine. Given the following
project context, suggest the 3-5 most important next steps. Be specific and
actionable. Return a JSON array of strings with no additional text.

Context:
{json.dumps(context, indent=2)}"""

    response = await client.messages.create(
        model="claude-opus-4-7",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}]
    )
    try:
        return json.loads(response.content[0].text)
    except json.JSONDecodeError:
        # Claude occasionally wraps JSON in prose; extract the array
        text = response.content[0].text
        start, end = text.index("["), text.rindex("]") + 1
        return json.loads(text[start:end])

async def summarize_project(context: dict) -> str:
    """Generate an executive summary of project state."""
    response = await client.messages.create(
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
Return JSON only: {{"drift_detected": bool, "issues": [str], "severity": "low|medium|high"}}

Original goals: {original_goals}
Current state: {json.dumps(context)}"""

    response = await client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=512,
        messages=[{"role": "user", "content": prompt}]
    )
    try:
        return json.loads(response.content[0].text)
    except json.JSONDecodeError:
        text = response.content[0].text
        start, end = text.index("{"), text.rindex("}") + 1
        return json.loads(text[start:end])
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
from app.graph  import GraphEngine
from app.memory import MemoryEngine

class IntegrationRouter:
    def __init__(self, graph: GraphEngine, memory: MemoryEngine):
        # shared instances — avoid creating a new DB pool per sync call
        self.github = GitHubIntegration(graph, memory)
        self.notion = NotionIntegration(graph, memory)
        self.gdrive = GoogleDriveIntegration(graph, memory)
        self.gmail  = GmailIntegration(graph, memory)
        self.excel  = ExcelIntegration(graph, memory)
```

### GitHub Integration

```python
# app/integrations/github.py
import itertools
from github import Github  # PyGithub
from app.graph import GraphEngine
from app.memory import MemoryEngine

MAX_ISSUES  = 200  # cap to avoid fetching unbounded backlogs
MAX_COMMITS = 20

class GitHubIntegration:
    def __init__(self, graph: GraphEngine, memory: MemoryEngine):
        self._graph  = graph   # injected — no fresh pool per call
        self._memory = memory

    async def sync(self, repo: str, project_id: str, token: str, user_id: str) -> dict:
        g = Github(token)  # token resolved by the MCP tool layer, not here
        r = g.get_repo(repo)

        synced = {"issues": 0, "prs": 0, "commits": 0}

        # Sync open issues as tasks (capped; skip issues already synced)
        existing_numbers = await self._graph.get_synced_github_numbers(project_id)

        for issue in itertools.islice(r.get_issues(state="open"), MAX_ISSUES):
            if issue.number in existing_numbers:
                continue  # already synced; avoid duplicates
            await self._graph.create_node(
                type="task",
                title=issue.title,
                body=issue.body or "",
                owner_id=user_id,
                metadata={
                    "source": "github",
                    "github_number": issue.number,
                    "url": issue.html_url,
                    "labels": [l.name for l in issue.labels],
                    "assignees": [a.login for a in issue.assignees]
                }
            )
            synced["issues"] += 1

        # Sync recent commits — islice avoids PaginatedList slice TypeError
        for commit in itertools.islice(r.get_commits(), MAX_COMMITS):
            await self._memory.store(
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
from app.graph import GraphEngine
from app.memory import MemoryEngine

class NotionIntegration:
    def __init__(self, graph: GraphEngine, memory: MemoryEngine):
        self._graph  = graph   # injected — consistent with IntegrationRouter
        self._memory = memory

    async def sync(self, page_id: str, project_id: str, token: str, user_id: str) -> dict:
        notion = NotionClient(auth=token)  # token resolved by the MCP tool layer
        page = notion.pages.retrieve(page_id=page_id)
        blocks = notion.blocks.children.list(block_id=page_id)

        content = self._blocks_to_text(blocks["results"])

        await self._memory.store(
            content=f"Notion page '{page['properties']['title']}': {content}",
            content_type="observation",
            project_id=project_id,
            importance=0.8
        )

        # Extract action items (lines starting with [ ] or TODO)
        tasks = self._extract_tasks(content)
        for task_text in tasks:
            await self._graph.create_node(type="task", title=task_text,
                                          owner_id=user_id,
                                          metadata={"source": "notion",
                                                    "notion_page_id": page_id})

        return {"page_synced": True, "tasks_found": len(tasks)}

    def _blocks_to_text(self, blocks: list) -> str:

        """Flatten Notion block list to plain text."""
        lines = []
        for block in blocks:
            btype = block.get("type", "")
            rich  = block.get(btype, {}).get("rich_text", [])
            text  = "".join(r.get("plain_text", "") for r in rich)
            if text:
                lines.append(text)
        return "\n".join(lines)

    def _extract_tasks(self, text: str) -> list[str]:
        """Return TODO/checkbox lines as plain task strings."""
        tasks = []
        for line in text.splitlines():
            s = line.strip()
            if s.startswith(("[ ]", "- [ ]", "TODO:", "todo:")):
                task = (s.lstrip("- ").lstrip("[ ]")
                         .lstrip("TODO:").lstrip("todo:").strip())
                if task:
                    tasks.append(task)
        return tasks
```

### Google Drive Integration (stub)

```python
# app/integrations/gdrive.py
from app.graph import GraphEngine
from app.memory import MemoryEngine

class GoogleDriveIntegration:
    def __init__(self, graph: GraphEngine, memory: MemoryEngine):
        self._graph  = graph
        self._memory = memory

    async def sync(self, file_id: str, project_id: str,
                   token: str, user_id: str) -> dict:
        """Pull a Drive doc/sheet into memory. Full implementation requires
        google-api-python-client + google-auth-oauthlib OAuth flow."""
        raise NotImplementedError("Google Drive sync not yet implemented")
```

### Gmail Integration (stub)

```python
# app/integrations/gmail.py
from app.graph import GraphEngine
from app.memory import MemoryEngine

class GmailIntegration:
    def __init__(self, graph: GraphEngine, memory: MemoryEngine):
        self._graph  = graph
        self._memory = memory

    async def sync(self, query: str, project_id: str,
                   token: str, user_id: str) -> dict:
        """Search Gmail and store matching threads as memories.
        Requires Gmail API OAuth scope."""
        raise NotImplementedError("Gmail sync not yet implemented")
```

### Excel Integration (stub)

```python
# app/integrations/excel.py
from app.graph import GraphEngine
from app.memory import MemoryEngine

class ExcelIntegration:
    def __init__(self, graph: GraphEngine, memory: MemoryEngine):
        self._graph  = graph
        self._memory = memory

    async def sync(self, file_path: str, project_id: str,
                   token: str, user_id: str) -> dict:
        """Parse an Excel/CSV file with openpyxl and store rows as memories."""
        raise NotImplementedError("Excel sync not yet implemented")
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
import os
import uuid
import boto3
from cryptography.fernet import Fernet
from app.db import db

class CredentialStore:
    def __init__(self):
        # Key lives in AWS KMS, never in app memory at rest
        self.kms = boto3.client("kms")
        self._key_id = os.environ["KMS_KEY_ID"]

    async def store(self, user_id: str, provider: str, token: str) -> str:
        """Encrypt and store; return opaque reference ID."""
        encrypted = self.kms.encrypt(
            KeyId=self._key_id,
            Plaintext=token.encode()
        )["CiphertextBlob"]
        ref_id = str(uuid.uuid4())
        await db.credentials.insert(id=ref_id, user_id=user_id,
                                     provider=provider, encrypted_token=encrypted)
        return ref_id

    async def resolve(self, ref_id: str, user_id: str) -> str:
        """Decrypt only at point of use; result never persisted."""
        row = await db.credentials.get(id=ref_id, user_id=user_id)
        return self.kms.decrypt(
            CiphertextBlob=row["encrypted_token"]
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

---

## 14. Database Layer (app/db.py)

```python
# app/db.py
import asyncpg
import os

_pool: asyncpg.Pool | None = None

async def _get_pool() -> asyncpg.Pool:
    global _pool
    if _pool is None:
        _pool = await asyncpg.create_pool(
            dsn=os.environ["DATABASE_URL"],
            min_size=2,
            max_size=10
        )
    return _pool

_qdrant_client = None  # AsyncQdrantClient | None

async def _get_qdrant():
    """Shared Qdrant client — created once, reused for all calls."""
    global _qdrant_client
    if _qdrant_client is None:
        from qdrant_client import AsyncQdrantClient
        _qdrant_client = AsyncQdrantClient(
            host=os.environ.get("QDRANT_HOST", "localhost"),
            port=int(os.environ.get("QDRANT_PORT", "6333"))
        )
    return _qdrant_client

class _MemoriesTable:
    async def insert(self, *, id: str, content: str, content_type: str,
                     embedding_id: str, importance: float,
                     session_id: str = "", node_id: str | None = None) -> None:
        pool = await _get_pool()
        await pool.execute(
            """INSERT INTO memories
                   (id, session_id, node_id, content, content_type, importance, embedding_id)
               VALUES ($1, $2, $3::uuid, $4, $5, $6, $7)
               ON CONFLICT (id) DO NOTHING""",
            id, session_id, node_id, content, content_type, importance, embedding_id
        )

class _CredentialsTable:
    async def insert(self, *, id: str, user_id: str, provider: str,
                     encrypted_token: bytes) -> None:
        pool = await _get_pool()
        await pool.execute(
            """INSERT INTO credentials (id, user_id, provider, encrypted_token)
               VALUES ($1, $2::uuid, $3, $4)
               ON CONFLICT (user_id, provider)
               DO UPDATE SET encrypted_token = EXCLUDED.encrypted_token""",
            id, user_id, provider, encrypted_token
        )

    async def get(self, *, id: str, user_id: str) -> dict:
        pool = await _get_pool()
        row = await pool.fetchrow(
            "SELECT * FROM credentials WHERE id = $1 AND user_id = $2::uuid",
            id, user_id
        )
        if row is None:
            raise PermissionError(f"Credential {id} not found for user {user_id}")
        return dict(row)

class _DB:
    memories    = _MemoriesTable()
    credentials = _CredentialsTable()

    # Exposed so scheduler.py and CLI can access the pool without importing _get_pool
    _get_pool_directly = staticmethod(_get_pool)

    async def create_assumption(self, *, statement: str, project_id: str,
                                 confidence: float) -> str:
        pool = await _get_pool()
        row = await pool.fetchrow(
            """INSERT INTO assumptions (project_id, statement, confidence)
               VALUES ($1::uuid, $2, $3) RETURNING id""",
            project_id, statement, confidence
        )
        return str(row["id"])

    async def upsert_assumption_in_qdrant(self, *, assumption_id: str,
                                           project_id: str, statement: str,
                                           confidence: float,
                                           embedding: list[float]) -> None:
        """Keep the assumptions Qdrant collection in sync after each INSERT."""
        from qdrant_client.models import PointStruct
        from datetime import datetime, timezone
        qdrant = await _get_qdrant()
        await qdrant.upsert("assumptions", points=[
            PointStruct(
                id=assumption_id,
                vector=embedding,
                payload={
                    "assumption_id": assumption_id,
                    "project_id":    project_id,
                    "statement":     statement,
                    "confidence":    confidence,
                    "status":        "active",
                    "created_at":    datetime.now(timezone.utc).isoformat()
                }
            )
        ])

    async def get_due_reminders(self, *, project_id: str) -> list[dict]:
        pool = await _get_pool()
        rows = await pool.fetch(
            """SELECT r.* FROM reminders r
               WHERE r.node_id IN (
                   SELECT id FROM nodes WHERE metadata->>'project_id' = $1
               )
               AND r.due_at <= NOW()
               AND r.delivered = FALSE
               ORDER BY r.due_at""",
            project_id
        )
        return [dict(r) for r in rows]

    async def get_integration_credential(self, *, user_id: str,
                                          provider: str) -> str | None:
        """Return the opaque credential ref_id for this user+provider."""
        pool = await _get_pool()
        row = await pool.fetchrow(
            """SELECT credentials FROM integrations
               WHERE user_id = $1::uuid AND provider = $2
               LIMIT 1""",
            user_id, provider
        )
        return row["credentials"] if row else None

db = _DB()
```

---

## 15. Graph Engine (app/graph.py)

```python
# app/graph.py
import asyncio
import uuid
from app.db import _get_pool

class GraphEngine:
    async def create_node(self, *, type: str, title: str, body: str = "",
                          metadata: dict | None = None,
                          owner_id: str, project_id: str | None = None) -> dict:
        pool = await _get_pool()
        node_id = str(uuid.uuid4())
        meta = {**(metadata or {})}
        if project_id:
            meta["project_id"] = project_id

        await pool.execute(
            """INSERT INTO nodes (id, type, title, body, owner_id, metadata)
               VALUES ($1, $2, $3, $4, $5::uuid, $6)""",
            node_id, type, title, body, owner_id, meta
        )
        return {"id": node_id, "type": type, "title": title,
                "body": body, "metadata": meta}

    async def create_edge(self, from_id: str, to_id: str,
                          rel_type: str, metadata: dict | None = None) -> dict:
        pool = await _get_pool()
        edge_id = str(uuid.uuid4())
        await pool.execute(
            """INSERT INTO edges (id, from_id, to_id, rel_type, metadata)
               VALUES ($1, $2::uuid, $3::uuid, $4, $5)""",
            edge_id, from_id, to_id, rel_type, metadata or {}
        )
        return {"id": edge_id, "from_id": from_id,
                "to_id": to_id, "rel_type": rel_type}

    async def build_project_context(self, project_id: str) -> dict:
        pool = await _get_pool()

        project = await pool.fetchrow(
            "SELECT * FROM nodes WHERE id = $1::uuid AND type = 'project'",
            project_id
        )
        if project is None:
            raise ValueError(f"Project {project_id!r} not found")

        goals, open_tasks, recent_decisions, assumptions = await asyncio.gather(
            pool.fetch(
                """SELECT n.* FROM nodes n JOIN edges e ON e.to_id = n.id
                   WHERE e.from_id = $1::uuid AND n.type = 'goal'
                   AND n.status = 'active'""",
                project_id
            ),
            pool.fetch(
                """SELECT * FROM nodes
                   WHERE metadata->>'project_id' = $1
                   AND type = 'task' AND status != 'completed'
                   ORDER BY created_at DESC LIMIT 50""",
                project_id
            ),
            pool.fetch(
                """SELECT * FROM nodes
                   WHERE metadata->>'project_id' = $1
                   AND type = 'decision'
                   AND created_at > NOW() - INTERVAL '30 days'
                   ORDER BY created_at DESC LIMIT 10""",
                project_id
            ),
            pool.fetch(
                "SELECT * FROM assumptions WHERE project_id = $1::uuid AND status = 'active'",
                project_id
            ),
        )

        return {
            "id":               project_id,
            "title":            project["title"],
            "status":           project["status"],
            "description":      project["body"] or "",
            "goals":            [dict(g) for g in goals],
            "open_tasks":       [dict(t) for t in open_tasks],
            "recent_decisions": [dict(d) for d in recent_decisions],
            "assumptions":      [dict(a) for a in assumptions],
        }

    async def get_synced_github_numbers(self, project_id: str) -> set[int]:
        """Return GitHub issue numbers already imported for this project."""
        pool = await _get_pool()
        rows = await pool.fetch(
            """SELECT (metadata->>'github_number')::int AS num
               FROM nodes
               WHERE metadata->>'source' = 'github'
               AND metadata->>'project_id' = $1
               AND (metadata->>'github_number') IS NOT NULL""",
            project_id
        )
        return {r["num"] for r in rows}
```

---

## 16. Infrastructure Files

### docker-compose.yml

```yaml
version: "3.9"

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER:     projectos
      POSTGRES_PASSWORD: projectos
      POSTGRES_DB:       projectos
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U projectos"]
      interval: 5s
      timeout: 3s
      retries: 5

  qdrant:
    image: qdrant/qdrant:v1.11.0
    ports:
      - "6333:6333"  # REST / gRPC
      - "6334:6334"  # gRPC
    volumes:
      - qdrant_data:/qdrant/storage
    healthcheck:
      test: ["CMD-SHELL", "curl -sf http://localhost:6333/readyz"]
      interval: 5s
      timeout: 3s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5

volumes:
  postgres_data:
  qdrant_data:
  redis_data:
```

### pyproject.toml

```toml
[build-system]
requires      = ["hatchling"]
build-backend = "hatchling.build"

[project]
name            = "project-os"
version         = "0.1.0"
requires-python = ">=3.12"
dependencies = [
    "mcp[cli]>=1.0.0",
    "fastapi>=0.115.0",
    "uvicorn>=0.32.0",
    "asyncpg>=0.29.0",
    "qdrant-client>=1.11.0",
    "openai>=1.54.0",
    "anthropic>=0.40.0",
    "PyGithub>=2.3.0",
    "notion-client>=2.2.1",
    "google-api-python-client>=2.150.0",
    "google-auth-oauthlib>=1.2.0",
    "boto3>=1.35.0",
    "cryptography>=43.0.0",
    "redis>=5.2.0",
    "apscheduler>=3.10.4",
    "click>=8.1.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=8.3.0",
    "pytest-asyncio>=0.24.0",
    "httpx>=0.27.0",
]

[project.scripts]
project-os = "cli.project_os:cli"

[tool.pytest.ini_options]
asyncio_mode = "auto"
```

---

## 17. Database Migration (migrations/001_initial_schema.sql)

Complete, runnable SQL. Run once against a fresh database:
`psql $DATABASE_URL < migrations/001_initial_schema.sql`

```sql
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── users ────────────────────────────────────────────────────────────────────
-- Created first; nodes and integrations both reference it.
CREATE TABLE users (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    email      TEXT        UNIQUE NOT NULL,
    settings   JSONB       NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── nodes ────────────────────────────────────────────────────────────────────
CREATE TABLE nodes (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    type       TEXT        NOT NULL
                           CHECK (type IN ('project','goal','task','person',
                                          'decision','assumption','file','note')),
    title      TEXT        NOT NULL,
    body       TEXT,
    status     TEXT        NOT NULL DEFAULT 'active'
                           CHECK (status IN ('active','archived','completed','contradicted')),
    owner_id   UUID        NOT NULL REFERENCES users(id),
    metadata   JSONB       NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_nodes_type   ON nodes(type);
CREATE INDEX idx_nodes_status ON nodes(status);
CREATE INDEX idx_nodes_owner  ON nodes(owner_id);
CREATE INDEX idx_nodes_meta   ON nodes USING gin(metadata);

CREATE OR REPLACE FUNCTION _set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER nodes_updated_at
    BEFORE UPDATE ON nodes
    FOR EACH ROW EXECUTE FUNCTION _set_updated_at();

-- ── edges ────────────────────────────────────────────────────────────────────
CREATE TABLE edges (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    from_id    UUID        NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
    to_id      UUID        NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
    rel_type   TEXT        NOT NULL,
    weight     FLOAT       NOT NULL DEFAULT 1.0,
    metadata   JSONB       NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_edges_from ON edges(from_id);
CREATE INDEX idx_edges_to   ON edges(to_id);
CREATE INDEX idx_edges_rel  ON edges(rel_type);

-- ── memories ─────────────────────────────────────────────────────────────────
CREATE TABLE memories (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id   TEXT        NOT NULL DEFAULT '',
    node_id      UUID        REFERENCES nodes(id) ON DELETE SET NULL,
    content      TEXT        NOT NULL,
    content_type TEXT        NOT NULL DEFAULT 'observation'
                             CHECK (content_type IN
                                ('observation','decision','assumption','question','answer')),
    importance   FLOAT       NOT NULL DEFAULT 0.5
                             CHECK (importance BETWEEN 0 AND 1),
    embedding_id TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_memories_session ON memories(session_id);
CREATE INDEX idx_memories_node    ON memories(node_id);
CREATE INDEX idx_memories_type    ON memories(content_type);

-- ── assumptions ──────────────────────────────────────────────────────────────
CREATE TABLE assumptions (
    id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    node_id          UUID        REFERENCES nodes(id) ON DELETE SET NULL,
    project_id       UUID        NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
    statement        TEXT        NOT NULL,
    confidence       FLOAT       NOT NULL DEFAULT 0.8
                                 CHECK (confidence BETWEEN 0 AND 1),
    status           TEXT        NOT NULL DEFAULT 'active'
                                 CHECK (status IN
                                    ('active','confirmed','contradicted','superseded')),
    evidence_for     TEXT[]      NOT NULL DEFAULT '{}',
    evidence_against TEXT[]      NOT NULL DEFAULT '{}',
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at      TIMESTAMPTZ
);

CREATE INDEX idx_assumptions_project ON assumptions(project_id);
CREATE INDEX idx_assumptions_status  ON assumptions(status);

-- ── reminders ────────────────────────────────────────────────────────────────
CREATE TABLE reminders (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID        NOT NULL REFERENCES users(id),
    node_id    UUID        REFERENCES nodes(id) ON DELETE CASCADE,
    message    TEXT        NOT NULL,
    due_at     TIMESTAMPTZ NOT NULL,
    recurrence TEXT,
    delivered  BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reminders_user ON reminders(user_id);
CREATE INDEX idx_reminders_due  ON reminders(due_at) WHERE NOT delivered;

-- ── integrations ─────────────────────────────────────────────────────────────
CREATE TABLE integrations (
    id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID        NOT NULL REFERENCES users(id),
    provider       TEXT        NOT NULL,
    resource_id    TEXT        NOT NULL,
    node_id        UUID        REFERENCES nodes(id) ON DELETE SET NULL,
    last_synced_at TIMESTAMPTZ,
    sync_cursor    TEXT,
    credentials    TEXT,        -- opaque ref_id into credentials table
    UNIQUE(user_id, provider, resource_id)
);

-- ── credentials ──────────────────────────────────────────────────────────────
-- KMS-encrypted OAuth tokens. Never queried by token value; only by ref_id.
CREATE TABLE credentials (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID        NOT NULL REFERENCES users(id),
    provider        TEXT        NOT NULL,
    encrypted_token BYTEA       NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, provider)
);
```

---

## 18. Scheduler (app/scheduler.py)

APScheduler runs inside the MCP server process and fires the weekly briefing
plus due-reminder delivery.

```python
# app/scheduler.py
import asyncio
import logging
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from app.db import db
from app import intelligence

log = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()

@scheduler.scheduled_job(CronTrigger(day_of_week="mon", hour=8, minute=0))
async def weekly_briefing() -> None:
    """Every Monday 08:00 — summarize all active projects and log drift."""
    pool = await db._get_pool_directly()  # internal helper; see db.py
    rows = await pool.fetch(
        "SELECT id, title FROM nodes WHERE type = 'project' AND status = 'active'"
    )
    for row in rows:
        try:
            from app.graph import GraphEngine
            ctx = await GraphEngine().build_project_context(str(row["id"]))
            summary = await intelligence.summarize_project(ctx)
            drift   = await intelligence.detect_project_drift(
                ctx, [g["title"] for g in ctx.get("goals", [])]
            )
            log.info("Briefing [%s]: %s | drift=%s", row["title"], summary,
                     drift.get("severity", "none"))
        except Exception:
            log.exception("Briefing failed for project %s", row["id"])

@scheduler.scheduled_job("interval", minutes=5)
async def deliver_due_reminders() -> None:
    """Poll for reminders due in the past 5 minutes and log them."""
    pool = await db._get_pool_directly()
    rows = await pool.fetch(
        """UPDATE reminders SET delivered = TRUE
           WHERE due_at <= NOW() AND delivered = FALSE
           RETURNING id, message, user_id"""
    )
    for r in rows:
        log.info("Reminder delivered to user %s: %s", r["user_id"], r["message"])

def start() -> None:
    scheduler.start()

def stop() -> None:
    scheduler.shutdown(wait=False)
```

> Wire `scheduler.start()` / `scheduler.stop()` in `server.py` startup/shutdown
> lifecycle hooks so APScheduler runs alongside the MCP server event loop.

---

## 19. CLI (cli/project_os.py)

```python
# cli/project_os.py
import asyncio
import json
import click

def _run(coro):
    return asyncio.get_event_loop().run_until_complete(coro)

@click.group()
def cli():
    """Project OS — command-line interface."""

@cli.command()
@click.argument("query")
@click.option("--project", "-p", default=None, help="Scope to a project ID")
@click.option("--limit", "-n", default=5, show_default=True)
def recall(query: str, project: str | None, limit: int):
    """Semantic search over long-term memory."""
    from app.memory import MemoryEngine
    results = _run(MemoryEngine().retrieve(query=query, project_id=project, limit=limit))
    for r in results:
        click.echo(f"[{r['_score']:.3f}] {r['content']}")

@cli.command()
@click.argument("statement")
@click.option("--project", "-p", required=True, help="Project ID")
@click.option("--confidence", "-c", default=0.8, show_default=True)
def decide(statement: str, project: str, confidence: float):
    """Log a decision and check for contradictions."""
    from app.db import db
    from app.memory import MemoryEngine
    mem = MemoryEngine()

    async def _decide():
        contradictions = await mem.detect_contradictions(statement, project)
        assumption_id  = await db.create_assumption(
            statement=statement, project_id=project, confidence=confidence
        )
        embedding = await mem._embed(statement)
        await db.upsert_assumption_in_qdrant(
            assumption_id=assumption_id, project_id=project,
            statement=statement, confidence=confidence, embedding=embedding
        )
        return assumption_id, contradictions

    aid, contradictions = _run(_decide())
    click.echo(f"Logged assumption {aid}")
    if contradictions:
        click.echo(f"⚠  {len(contradictions)} contradiction(s) detected:")
        for c in contradictions:
            click.echo(f"   - {c.payload['statement']}")

@cli.command()
def briefing():
    """Print a summary of all active projects."""
    from app.graph import GraphEngine
    from app.db import db
    from app import intelligence

    async def _briefing():
        import asyncpg, os
        pool = await db._get_pool_directly()
        rows = await pool.fetch(
            "SELECT id, title FROM nodes WHERE type = 'project' AND status = 'active'"
        )
        graph = GraphEngine()
        for row in rows:
            ctx     = await graph.build_project_context(str(row["id"]))
            summary = await intelligence.summarize_project(ctx)
            click.echo(f"\n## {row['title']}")
            click.echo(summary)
            click.echo(f"  Open tasks: {len(ctx['open_tasks'])}")

    _run(_briefing())

@cli.command()
@click.option("--all", "sync_all", is_flag=True, default=False)
@click.option("--repo", default=None, help="GitHub repo (owner/name)")
@click.option("--project", "-p", required=True, help="Project ID")
@click.option("--user-id", "-u", required=True, help="User ID")
def sync(sync_all: bool, repo: str | None, project: str, user_id: str):
    """Sync connected integrations into the project graph."""
    from app.integrations import IntegrationRouter
    from app.graph import GraphEngine
    from app.memory import MemoryEngine
    from app.db import db
    from app.security.credentials import CredentialStore

    router = IntegrationRouter(graph=GraphEngine(), memory=MemoryEngine())
    creds  = CredentialStore()

    async def _sync():
        if repo or sync_all:
            cred_ref = await db.get_integration_credential(user_id=user_id,
                                                            provider="github")
            if cred_ref:
                token = await creds.resolve(cred_ref, user_id)
                result = await router.github.sync(repo=repo, project_id=project,
                                                  token=token, user_id=user_id)
                click.echo(f"GitHub: {result}")

    _run(_sync())

if __name__ == "__main__":
    cli()
```

---

*This document is a living design spec. As implementation progresses, update
the schema versions in `migrations/` and keep the tool signatures in sync with
`server.py`.*
