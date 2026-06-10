#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import https from "https";
import http from "http";

const server = new McpServer({
  name: "job-search-free",
  version: "1.2.0",
});

const USAJOBS_KEY = process.env.USAJOBS_API_KEY || "";
const ADZUNA_ID = process.env.ADZUNA_APP_ID || "";
const ADZUNA_KEY = process.env.ADZUNA_APP_KEY || "";

// Verified finance/fintech companies with active Greenhouse or Lever job boards
const FINANCE_ATS_COMPANIES = [
  // Fintech / neobanks
  { slug: "robinhood",               name: "Robinhood",                ats: "greenhouse" },
  { slug: "coinbase",                name: "Coinbase",                 ats: "greenhouse" },
  { slug: "chime",                   name: "Chime",                    ats: "greenhouse" },
  { slug: "sofi",                    name: "SoFi",                     ats: "greenhouse" },
  { slug: "mercury",                 name: "Mercury",                  ats: "greenhouse" },
  { slug: "betterment",              name: "Betterment",               ats: "greenhouse" },
  { slug: "wealthfront",             name: "Wealthfront",              ats: "lever"      },
  // Payments & infrastructure
  { slug: "stripe",                  name: "Stripe",                   ats: "greenhouse" },
  { slug: "brex",                    name: "Brex",                     ats: "greenhouse" },
  { slug: "affirm",                  name: "Affirm",                   ats: "greenhouse" },
  { slug: "marqeta",                 name: "Marqeta",                  ats: "greenhouse" },
  { slug: "adyen",                   name: "Adyen",                    ats: "greenhouse" },
  { slug: "payoneer",                name: "Payoneer",                 ats: "greenhouse" },
  { slug: "melio",                   name: "Melio",                    ats: "greenhouse" },
  // Equity / corporate finance tools
  { slug: "carta",                   name: "Carta",                    ats: "greenhouse" },
  { slug: "blend",                   name: "Blend",                    ats: "greenhouse" },
  // Payroll / HR finance
  { slug: "gusto",                   name: "Gusto",                    ats: "greenhouse" },
  { slug: "justworks",               name: "Justworks",                ats: "greenhouse" },
  // Finance-adjacent / investment banking
  { slug: "financialtechnologypartners", name: "FT Partners",          ats: "greenhouse" },
  { slug: "breezeairways",           name: "Breeze Airways",           ats: "greenhouse" },
  { slug: "upwork",                  name: "Upwork",                   ats: "greenhouse" },
];

const FINANCE_TITLE_KEYWORDS = [
  "financ", "accounti", "accountant", "fp&a", "treasury", "audit",
  "tax", "budget", "invest", "controller", "payroll", "compliance",
  "risk analyst", "credit", "equity", "capital", "banking", "actuar",
  "underwr", "insurance analyst", "revenue", "billing", "bookkeep",
];

const FINANCE_EXCLUDE_TITLE = [
  "account executive", "account manager", "sales", "marketing",
  "software engineer", "data engineer", "devops", "designer",
  "product manager", "recruiter", "legal", "support engineer",
  "customer success", "software development", "data scientist",
  "infrastructure", "security engineer", "machine learning",
];

function fetchJSON(url, extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    const headers = { "User-Agent": "claude-job-search/1.0", ...extraHeaders };
    const req = client.get(url, { headers }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve([]);
        }
      });
    });
    req.on("error", () => resolve([]));
    req.setTimeout(8000, () => { req.destroy(); resolve([]); });
  });
}

async function searchRemotive(query, type) {
  const category = type === "internship" ? "" : "";
  const url = `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(query)}&limit=10`;
  const data = await fetchJSON(url);
  const jobs = data?.jobs || [];
  return jobs.map((j) => ({
    title: j.title,
    company: j.company_name,
    location: j.candidate_required_location || "Remote",
    type: j.job_type,
    url: j.url,
    posted: j.publication_date?.slice(0, 10),
    source: "Remotive",
    description: j.description?.replace(/<[^>]+>/g, "").slice(0, 300) + "...",
  }));
}

async function searchRemoteOK(query) {
  const url = `https://remoteok.com/api?tags=${encodeURIComponent(query)}`;
  const data = await fetchJSON(url);
  const jobs = Array.isArray(data) ? data.filter((j) => j.id) : [];
  return jobs.slice(0, 10).map((j) => ({
    title: j.position,
    company: j.company,
    location: "Remote",
    type: "Remote",
    url: `https://remoteok.com/remote-jobs/${j.slug}`,
    posted: j.date?.slice(0, 10),
    source: "RemoteOK",
    description: j.description?.replace(/<[^>]+>/g, "").slice(0, 300) + "...",
  }));
}

async function searchTheMuse(query, isInternship) {
  const level = isInternship ? "&level=Internship" : "";
  const url = `https://www.themuse.com/api/public/jobs?category=Engineering%2CTechnology${level}&page=0&descending=true`;
  const data = await fetchJSON(url);
  const jobs = data?.results || [];
  const filtered = jobs.filter((j) => j.name.toLowerCase().includes(query.toLowerCase())).slice(0, 10);
  return filtered.map((j) => ({
    title: j.name,
    company: j.company?.name,
    location: j.locations?.map((l) => l.name).join(", ") || "Unknown",
    type: j.type,
    url: j.refs?.landing_page,
    posted: j.publication_date?.slice(0, 10),
    source: "The Muse",
    description: j.contents?.replace(/<[^>]+>/g, "").slice(0, 300) + "...",
  }));
}

async function searchArbeitnow(query) {
  const url = `https://www.arbeitnow.com/api/job-board-api?search=${encodeURIComponent(query)}`;
  const data = await fetchJSON(url);
  const jobs = data?.data || [];
  return jobs.slice(0, 10).map((j) => ({
    title: j.title,
    company: j.company_name,
    location: j.location || "Remote",
    type: j.remote ? "Remote" : "On-site",
    url: j.url,
    posted: j.created_at?.slice(0, 10),
    source: "Arbeitnow",
    description: j.description?.replace(/<[^>]+>/g, "").slice(0, 300) + "...",
  }));
}

async function searchHimalayas(query) {
  const url = `https://himalayas.app/jobs/api?q=${encodeURIComponent(query)}&limit=10`;
  const data = await fetchJSON(url);
  const jobs = data?.jobs || [];
  return jobs.slice(0, 10).map((j) => ({
    title: j.title,
    company: j.companyName,
    location: j.locationRestrictions?.join(", ") || "Remote",
    type: "Remote",
    url: j.applicationLink || j.websiteLink,
    posted: j.createdAt?.slice(0, 10),
    source: "Himalayas",
    description: j.description?.replace(/<[^>]+>/g, "").slice(0, 300) + "...",
  }));
}

async function searchUSAJobs(query, location, radiusMiles) {
  if (!USAJOBS_KEY) return [{ _noKey: true, source: "USAJobs" }];
  const radius = radiusMiles || 25;
  const loc = location || "United States";
  const url = `https://data.usajobs.gov/api/search?Keyword=${encodeURIComponent(query)}&LocationName=${encodeURIComponent(loc)}&Radius=${radius}&ResultsPerPage=10`;
  const data = await fetchJSON(url, {
    "Authorization-Key": USAJOBS_KEY,
    "Host": "data.usajobs.gov",
  });
  const items = data?.SearchResult?.SearchResultItems || [];
  return items.map((i) => {
    const d = i.MatchedObjectDescriptor;
    return {
      title: d?.PositionTitle,
      company: d?.OrganizationName,
      location: d?.PositionLocationDisplay,
      type: d?.PositionOfferingType?.[0]?.Name,
      url: d?.PositionURI,
      posted: d?.PublicationStartDate?.slice(0, 10),
      salary: d?.PositionRemuneration?.[0]
        ? `$${d.PositionRemuneration[0].MinimumRange}–$${d.PositionRemuneration[0].MaximumRange} ${d.PositionRemuneration[0].RateIntervalCode}`
        : null,
      source: "USAJobs",
      description: d?.UserArea?.Details?.JobSummary?.replace(/<[^>]+>/g, "").slice(0, 300) + "...",
    };
  });
}

async function searchAdzuna(query, location, radiusMiles) {
  if (!ADZUNA_ID || !ADZUNA_KEY) return [{ _noKey: true, source: "Adzuna" }];
  const dist = Math.round((radiusMiles || 20) * 1.60934);
  const where = location || "United States";
  const url = `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${ADZUNA_ID}&app_key=${ADZUNA_KEY}&results_per_page=10&what=${encodeURIComponent(query)}&where=${encodeURIComponent(where)}&distance=${dist}&content-type=application/json`;
  const data = await fetchJSON(url);
  const jobs = data?.results || [];
  return jobs.map((j) => ({
    title: j.title,
    company: j.company?.display_name,
    location: j.location?.display_name,
    type: j.contract_time || j.contract_type,
    url: j.redirect_url,
    posted: j.created?.slice(0, 10),
    salary: j.salary_min ? `$${Math.round(j.salary_min).toLocaleString()}–$${Math.round(j.salary_max || j.salary_min).toLocaleString()}` : null,
    source: "Adzuna",
    description: j.description?.replace(/<[^>]+>/g, "").slice(0, 300) + "...",
  }));
}

async function searchJobicy(query) {
  const url = `https://jobicy.com/api/v2/remote-jobs?count=10&tag=${encodeURIComponent(query)}`;
  const data = await fetchJSON(url);
  const jobs = data?.jobs || [];
  return jobs.map((j) => ({
    title: j.jobTitle,
    company: j.companyName,
    location: j.jobGeo || "Remote",
    type: j.jobType,
    url: j.url,
    posted: j.pubDate?.slice(0, 10),
    source: "Jobicy",
    description: j.jobDescription?.replace(/<[^>]+>/g, "").slice(0, 300) + "...",
  }));
}

async function searchFinanceATS(query, internshipOnly) {
  const q = query.toLowerCase();

  const fetches = FINANCE_ATS_COMPANIES.map(async (co) => {
    try {
      let jobs = [];
      if (co.ats === "greenhouse") {
        const data = await fetchJSON(
          `https://boards-api.greenhouse.io/v1/boards/${co.slug}/jobs`
        );
        jobs = (data?.jobs || []).map((j) => ({
          title: j.title,
          company: co.name,
          location: j.location?.name || "Unknown",
          url: j.absolute_url || `https://boards.greenhouse.io/${co.slug}/jobs/${j.id}`,
          posted: j.updated_at?.slice(0, 10),
          source: `${co.name} (Greenhouse)`,
        }));
      } else if (co.ats === "lever") {
        const data = await fetchJSON(
          `https://api.lever.co/v0/postings/${co.slug}?mode=json`
        );
        jobs = (Array.isArray(data) ? data : []).map((j) => ({
          title: j.text,
          company: co.name,
          location: j.categories?.location || j.workplaceType || "Unknown",
          url: j.hostedUrl || j.applyUrl,
          posted: j.createdAt ? new Date(j.createdAt).toISOString().slice(0, 10) : null,
          source: `${co.name} (Lever)`,
        }));
      }

      return jobs.filter((j) => {
        const title = j.title?.toLowerCase() || "";
        const isExcluded = FINANCE_EXCLUDE_TITLE.some((ex) => title.includes(ex));
        if (isExcluded) return false;
        const wordMatch = (str, word) => new RegExp(`\\b${word}\\b`).test(str);
        const isIntern = wordMatch(title, "intern") || wordMatch(title, "co-op") || title.includes("internship");
        if (internshipOnly && !isIntern) return false;
        const isFinance = FINANCE_TITLE_KEYWORDS.some((kw) => title.includes(kw));
        if (!q) return isFinance;
        const queryWords = q.split(/\s+/).filter(Boolean);
        const matchesQuery = queryWords.every((w) => wordMatch(title, w) || title.includes(w));
        return isFinance || matchesQuery;
      });
    } catch {
      return [];
    }
  });

  const results = await Promise.allSettled(fetches);
  return results.flatMap((r) => r.status === "fulfilled" ? r.value : []);
}

server.tool(
  "search_finance_native",
  {
    query: z.string().optional().default("").describe("Finance keywords to search for (e.g. 'FP&A', 'accounting intern', 'treasury'). Leave blank to return all finance roles."),
    internship_only: z.boolean().optional().default(false).describe("Set true to return only internship and co-op roles"),
  },
  async ({ query, internship_only }) => {
    const jobs = await searchFinanceATS(query, internship_only);

    if (jobs.length === 0) {
      return {
        content: [{ type: "text", text: `No finance roles found matching "${query}" across the ${FINANCE_ATS_COMPANIES.length} company boards. Try broader terms like "finance" or "analyst".` }],
      };
    }

    const grouped = {};
    for (const job of jobs) {
      if (!grouped[job.source]) grouped[job.source] = [];
      grouped[job.source].push(job);
    }

    let out = `## Finance Native Job Board Results\n`;
    out += `Searched **${FINANCE_ATS_COMPANIES.length} company career pages** directly via Greenhouse & Lever.\n`;
    out += `Found **${jobs.length} finance roles**${internship_only ? " (internships/co-ops only)" : ""}${query ? ` matching "${query}"` : ""}.\n\n`;

    for (const [source, list] of Object.entries(grouped)) {
      out += `### ${source} (${list.length})\n`;
      for (const job of list) {
        out += `**[${job.title}](${job.url})**\n`;
        out += `- Location: ${job.location}\n`;
        if (job.posted) out += `- Updated: ${job.posted}\n`;
        out += "\n";
      }
    }

    return { content: [{ type: "text", text: out }] };
  }
);

server.tool(
  "search_free_jobs",
  {
    query: z.string().describe("Job title, skills, or keywords to search for (e.g. 'software engineering internship', 'data science', 'frontend')"),
    type: z.enum(["any", "internship", "full_time", "part_time", "contract", "remote"]).optional().default("any").describe("Job type filter"),
    location: z.string().optional().describe("City and state, e.g. 'Cleveland, OH'"),
    radius_miles: z.number().optional().describe("Search radius in miles from location"),
    sources: z.array(z.enum(["remotive", "remoteok", "themuse", "arbeitnow", "himalayas", "jobicy", "usajobs", "adzuna"])).optional().describe("Which job boards to search (default: all)"),
  },
  async ({ query, type, location, radius_miles, sources }) => {
    const isInternship = type === "internship" || query.toLowerCase().includes("intern");
    const searchQuery = query;
    const activeSources = sources || ["remotive", "remoteok", "themuse", "arbeitnow", "himalayas", "jobicy", "usajobs", "adzuna"];

    const searches = [];
    if (activeSources.includes("remotive")) searches.push(searchRemotive(searchQuery, type));
    if (activeSources.includes("remoteok")) searches.push(searchRemoteOK(searchQuery));
    if (activeSources.includes("themuse")) searches.push(searchTheMuse(searchQuery, isInternship));
    if (activeSources.includes("arbeitnow")) searches.push(searchArbeitnow(searchQuery));
    if (activeSources.includes("himalayas")) searches.push(searchHimalayas(searchQuery));
    if (activeSources.includes("jobicy")) searches.push(searchJobicy(searchQuery));
    if (activeSources.includes("usajobs")) searches.push(searchUSAJobs(searchQuery, location, radius_miles));
    if (activeSources.includes("adzuna")) searches.push(searchAdzuna(searchQuery, location, radius_miles));

    const results = await Promise.allSettled(searches);
    const allRaw = results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));

    const missingKeys = [...new Set(allRaw.filter((j) => j._noKey).map((j) => j.source))];
    const allJobs = allRaw.filter((j) => !j._noKey);

    const filtered = isInternship
      ? allJobs.filter((j) =>
          j.title?.toLowerCase().includes("intern") ||
          j.type?.toLowerCase().includes("intern") ||
          query.toLowerCase().includes("intern")
        )
      : allJobs;

    const dedupedTitles = new Set();
    const deduped = filtered.filter((j) => {
      const key = `${j.title?.toLowerCase()}-${j.company?.toLowerCase()}`;
      if (dedupedTitles.has(key)) return false;
      dedupedTitles.add(key);
      return true;
    });

    const grouped = {};
    for (const job of deduped) {
      if (!grouped[job.source]) grouped[job.source] = [];
      grouped[job.source].push(job);
    }

    let output = `## Job Search Results for "${query}"\n\n`;

    if (missingKeys.length > 0) {
      output += `> **API keys not configured for:** ${missingKeys.join(", ")}\n`;
      for (const src of missingKeys) {
        if (src === "USAJobs") output += `> - USAJobs: register free at https://developer.usajobs.gov → set env var \`USAJOBS_API_KEY\`\n`;
        if (src === "Adzuna") output += `> - Adzuna: register free at https://developer.adzuna.com → set env vars \`ADZUNA_APP_ID\` and \`ADZUNA_APP_KEY\`\n`;
      }
      output += "\n";
    }

    if (deduped.length === 0) {
      output += `No jobs found across the active job boards for "${query}". Try broader keywords.\n`;
      return { content: [{ type: "text", text: output }] };
    }

    output += `Found **${deduped.length} listings** across ${Object.keys(grouped).length} job boards.\n\n`;

    for (const [source, jobs] of Object.entries(grouped)) {
      output += `### ${source} (${jobs.length} results)\n\n`;
      for (const job of jobs) {
        output += `**[${job.title}](${job.url})**\n`;
        output += `- Company: ${job.company || "Unknown"}\n`;
        output += `- Location: ${job.location || "Unknown"}\n`;
        if (job.type) output += `- Type: ${job.type}\n`;
        if (job.salary) output += `- Salary: ${job.salary}\n`;
        if (job.posted) output += `- Posted: ${job.posted}\n`;
        if (job.description) output += `- Preview: ${job.description}\n`;
        output += "\n";
      }
    }

    return { content: [{ type: "text", text: output }] };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
