#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import https from "https";
import http from "http";

const server = new McpServer({
  name: "job-search-free",
  version: "1.0.0",
});

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    const req = client.get(url, { headers: { "User-Agent": "claude-job-search/1.0" } }, (res) => {
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

server.tool(
  "search_free_jobs",
  {
    query: z.string().describe("Job title, skills, or keywords to search for (e.g. 'software engineering internship', 'data science', 'frontend')"),
    type: z.enum(["any", "internship", "full_time", "part_time", "contract", "remote"]).optional().default("any").describe("Job type filter"),
    sources: z.array(z.enum(["remotive", "remoteok", "themuse", "arbeitnow", "himalayas", "jobicy"])).optional().describe("Which job boards to search (default: all)"),
  },
  async ({ query, type, sources }) => {
    const isInternship = type === "internship" || query.toLowerCase().includes("intern");
    const searchQuery = query;
    const activeSources = sources || ["remotive", "remoteok", "themuse", "arbeitnow", "himalayas", "jobicy"];

    const searches = [];
    if (activeSources.includes("remotive")) searches.push(searchRemotive(searchQuery, type));
    if (activeSources.includes("remoteok")) searches.push(searchRemoteOK(searchQuery));
    if (activeSources.includes("themuse")) searches.push(searchTheMuse(searchQuery, isInternship));
    if (activeSources.includes("arbeitnow")) searches.push(searchArbeitnow(searchQuery));
    if (activeSources.includes("himalayas")) searches.push(searchHimalayas(searchQuery));
    if (activeSources.includes("jobicy")) searches.push(searchJobicy(searchQuery));

    const results = await Promise.allSettled(searches);
    const allJobs = results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));

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

    if (deduped.length === 0) {
      return {
        content: [{ type: "text", text: `No jobs found across free job boards for "${query}". Try broader keywords like the field name alone.` }],
      };
    }

    const grouped = {};
    for (const job of deduped) {
      if (!grouped[job.source]) grouped[job.source] = [];
      grouped[job.source].push(job);
    }

    let output = `## Job Search Results for "${query}"\n\n`;
    output += `Found **${deduped.length} listings** across ${Object.keys(grouped).length} free job boards.\n\n`;

    for (const [source, jobs] of Object.entries(grouped)) {
      output += `### ${source} (${jobs.length} results)\n\n`;
      for (const job of jobs) {
        output += `**[${job.title}](${job.url})**\n`;
        output += `- Company: ${job.company || "Unknown"}\n`;
        output += `- Location: ${job.location || "Unknown"}\n`;
        if (job.type) output += `- Type: ${job.type}\n`;
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
