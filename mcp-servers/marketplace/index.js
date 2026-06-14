#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import https from "https";
import http from "http";

const server = new McpServer({
  name: "marketplace-price-comparison",
  version: "1.0.0",
});

const EBAY_CLIENT_ID = process.env.EBAY_CLIENT_ID || "";
const EBAY_CLIENT_SECRET = process.env.EBAY_CLIENT_SECRET || "";
const BESTBUY_API_KEY = process.env.BESTBUY_API_KEY || "";

let _ebayToken = null;
let _ebayTokenExpiry = 0;

function httpRequest(url, { method = "GET", headers = {}, body = null } = {}) {
  return new Promise((resolve) => {
    const client = url.startsWith("https") ? https : http;
    const opts = { method, headers: { "User-Agent": "claude-marketplace/1.0", ...headers } };
    const req = client.request(url, opts, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve({ status: res.statusCode, data }));
    });
    req.on("error", () => resolve({ status: 0, data: "" }));
    req.setTimeout(10000, () => { req.destroy(); resolve({ status: 0, data: "" }); });
    if (body) req.write(body);
    req.end();
  });
}

async function fetchJSON(url, opts = {}) {
  const { data } = await httpRequest(url, opts);
  try { return JSON.parse(data); } catch { return null; }
}

async function fetchText(url, opts = {}) {
  const { data } = await httpRequest(url, opts);
  return data || "";
}

async function getEbayToken() {
  if (_ebayToken && Date.now() < _ebayTokenExpiry) return _ebayToken;
  if (!EBAY_CLIENT_ID || !EBAY_CLIENT_SECRET) return null;

  const credentials = Buffer.from(`${EBAY_CLIENT_ID}:${EBAY_CLIENT_SECRET}`).toString("base64");
  const body = "grant_type=client_credentials&scope=https%3A%2F%2Fapi.ebay.com%2Foauth%2Fapi_scope";

  const result = await fetchJSON("https://api.ebay.com/identity/v1/oauth2/token", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": String(Buffer.byteLength(body)),
    },
    body,
  });

  if (result?.access_token) {
    _ebayToken = result.access_token;
    _ebayTokenExpiry = Date.now() + (result.expires_in - 60) * 1000;
    return _ebayToken;
  }
  return null;
}

async function searchEbay(query, { condition = "any", maxPrice, minPrice } = {}) {
  const token = await getEbayToken();
  if (!token) return { source: "eBay", items: [], _noKey: true };

  const filters = [];
  if (condition === "new") filters.push("conditions:{NEW}");
  else if (condition === "used") filters.push("conditions:{USED_EXCELLENT|USED_GOOD|USED_ACCEPTABLE|FOR_PARTS_OR_NOT_WORKING}");
  if (minPrice !== undefined || maxPrice !== undefined) {
    const lo = minPrice ?? 0;
    const hi = maxPrice ?? "";
    filters.push(`price:[${lo}..${hi}]`);
  }

  let url = `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(query)}&sort=price&limit=20`;
  if (filters.length) url += `&filter=${encodeURIComponent(filters.join(","))}`;

  const data = await fetchJSON(url, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
    },
  });

  const items = data?.itemSummaries || [];
  return {
    source: "eBay",
    items: items.map((item) => {
      const price = parseFloat(item.price?.value ?? 0);
      const shipping = parseFloat(item.shippingOptions?.[0]?.shippingCost?.value ?? 0);
      return {
        title: item.title,
        price,
        shipping,
        total: price + shipping,
        condition: item.condition,
        seller: item.seller?.username,
        url: item.itemWebUrl,
        source: "eBay",
      };
    }),
  };
}

async function searchBestBuy(query, { maxPrice } = {}) {
  if (!BESTBUY_API_KEY) return { source: "BestBuy", items: [], _noKey: true };

  const priceClause = maxPrice ? `&salePrice<=${maxPrice}` : "";
  const params = new URLSearchParams({
    apiKey: BESTBUY_API_KEY,
    format: "json",
    show: "sku,name,salePrice,regularPrice,url",
    pageSize: "15",
    sort: "salePrice.asc",
  });
  const url = `https://api.bestbuy.com/v1/products(search=${encodeURIComponent(query)}${priceClause})?${params}`;

  const data = await fetchJSON(url);
  const products = data?.products || [];

  return {
    source: "BestBuy",
    items: products.map((p) => ({
      title: p.name,
      price: p.salePrice,
      shipping: 0,
      total: p.salePrice,
      condition: "New",
      url: p.url || `https://www.bestbuy.com/site/searchpage.jsp?st=${encodeURIComponent(query)}`,
      source: "BestBuy",
    })),
  };
}

async function searchDepop(query, { maxPrice, minPrice } = {}) {
  const params = new URLSearchParams({
    q: query,
    country: "us",
    currency: "USD",
    numberOfResults: "20",
    sort: "priceAscending",
  });
  const url = `https://webapi.depop.com/api/v2/search/products/?${params}`;

  const data = await fetchJSON(url, {
    headers: {
      Accept: "application/json",
      "depop-user-type": "guest",
    },
  });

  const products = data?.products || [];
  return {
    source: "Depop",
    items: products
      .map((p) => {
        const price = parseFloat(p.price?.priceAmount ?? p.priceAmount ?? 0);
        return {
          title: p.title || p.slug?.replace(/-/g, " ") || "Depop listing",
          price,
          shipping: 0,
          total: price || null,
          condition: "Used",
          seller: p.seller?.username,
          url: `https://www.depop.com/products/${p.slug}/`,
          source: "Depop",
        };
      })
      .filter((item) => {
        if (minPrice != null && item.total != null && item.total < minPrice) return false;
        if (maxPrice != null && item.total != null && item.total > maxPrice) return false;
        return true;
      }),
  };
}

async function searchHiBid(query, { maxPrice, minPrice } = {}) {
  const params = new URLSearchParams({
    searchTerm: query,
    webcast: "false",
    sort: "lowestprice",
    pageSize: "20",
    page: "1",
  });

  const data = await fetchJSON(`https://www.hibid.com/catalog/lots?${params}`, {
    headers: {
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
  });

  const lots = data?.lots || data?.items || data?.results || [];
  return {
    source: "HiBid",
    items: lots
      .map((lot) => {
        const price = parseFloat(lot.currentBid ?? lot.currentPrice ?? lot.startingBid ?? 0);
        return {
          title: lot.title || lot.description,
          price,
          shipping: 0,
          total: price || null,
          condition: "Auction",
          url: lot.url || (lot.lotId ? `https://www.hibid.com/lot/${lot.lotId}` : null),
          source: "HiBid",
        };
      })
      .filter((item) => {
        if (minPrice != null && item.total != null && item.total < minPrice) return false;
        if (maxPrice != null && item.total != null && item.total > maxPrice) return false;
        return true;
      }),
  };
}

async function searchShopGoodwill(query, { maxPrice, minPrice } = {}) {
  const body = JSON.stringify({
    searchText: query,
    categoryId: 0,
    sortColumn: "1",
    sortDescending: false,
    pageNumber: 1,
    pageSize: 20,
    showEnded: false,
  });

  const data = await fetchJSON("https://www.shopgoodwill.com/api/Search/ItemListing", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": String(Buffer.byteLength(body)),
      Accept: "application/json",
    },
    body,
  });

  const items = data?.searchResults?.items || data?.items || [];
  return {
    source: "ShopGoodwill",
    items: items
      .map((item) => {
        const price = parseFloat(item.currentPrice ?? item.minBidAmount ?? 0);
        const shipping = parseFloat(item.shippingPrice ?? 0);
        return {
          title: item.title,
          price,
          shipping,
          total: price + shipping || null,
          condition: "Used (Auction)",
          seller: item.sellerName,
          url: item.itemId ? `https://www.shopgoodwill.com/Item/${item.itemId}` : null,
          source: "ShopGoodwill",
        };
      })
      .filter((item) => {
        if (minPrice != null && item.total != null && item.total < minPrice) return false;
        if (maxPrice != null && item.total != null && item.total > maxPrice) return false;
        return true;
      }),
  };
}

async function searchAuctionOLA(query, { maxPrice, minPrice } = {}) {
  const params = new URLSearchParams({ q: query, sort: "price_asc", per_page: "20" });
  const data = await fetchJSON(`https://www.auctionola.com/api/search?${params}`, {
    headers: { Accept: "application/json", "X-Requested-With": "XMLHttpRequest" },
  });

  const lots = data?.lots || data?.items || data?.results || [];
  return {
    source: "AuctionOLA",
    items: lots
      .map((lot) => {
        const price = parseFloat(lot.currentBid ?? lot.currentPrice ?? lot.price ?? 0);
        return {
          title: lot.title || lot.name,
          price,
          shipping: 0,
          total: price || null,
          condition: "Auction",
          url: lot.url || lot.link || (lot.id ? `https://www.auctionola.com/lot/${lot.id}` : null),
          source: "AuctionOLA",
        };
      })
      .filter((item) => {
        if (minPrice != null && item.total != null && item.total < minPrice) return false;
        if (maxPrice != null && item.total != null && item.total > maxPrice) return false;
        return true;
      }),
  };
}

async function searchWhatnot(query, { maxPrice, minPrice } = {}) {
  const params = new URLSearchParams({ q: query, sort: "price_asc", limit: "20" });
  const data = await fetchJSON(`https://www.whatnot.com/api/search/listings?${params}`, {
    headers: { Accept: "application/json", "X-Requested-With": "XMLHttpRequest" },
  });

  const items = data?.results || data?.listings || data?.items || [];
  return {
    source: "Whatnot",
    items: items
      .map((item) => {
        const price = parseFloat(item.currentPrice ?? item.buyNowPrice ?? item.price ?? 0);
        return {
          title: item.title || item.name,
          price,
          shipping: 0,
          total: price || null,
          condition: "Live Auction",
          seller: item.seller?.username || item.sellerName,
          url: item.url || (item.id ? `https://www.whatnot.com/listings/${item.id}` : null),
          source: "Whatnot",
        };
      })
      .filter((item) => {
        if (minPrice != null && item.total != null && item.total < minPrice) return false;
        if (maxPrice != null && item.total != null && item.total > maxPrice) return false;
        return true;
      }),
  };
}

async function searchHeritageAuctions(query, { maxPrice, minPrice } = {}) {
  const params = new URLSearchParams({
    keyword: query,
    status: "0",
    sort: "currentBid",
    pageSize: "20",
  });
  const data = await fetchJSON(`https://api.ha.com/c/mobileapi/v1/searchResults?${params}`, {
    headers: { Accept: "application/json" },
  });

  const lots = data?.lots || data?.results || data?.items || [];
  return {
    source: "Heritage Auctions",
    items: lots
      .map((lot) => {
        const price = parseFloat(lot.currentBid ?? lot.startingBid ?? lot.openingBid ?? 0);
        return {
          title: lot.title || lot.description,
          price,
          shipping: 0,
          total: price || null,
          condition: "Auction",
          url: lot.url || (lot.lotId ? `https://ha.com/lot/${lot.lotId}` : null),
          source: "Heritage Auctions",
        };
      })
      .filter((item) => {
        if (minPrice != null && item.total != null && item.total < minPrice) return false;
        if (maxPrice != null && item.total != null && item.total > maxPrice) return false;
        return true;
      }),
  };
}

async function searchAuctionOhio(query, { maxPrice, minPrice } = {}) {
  const params = new URLSearchParams({
    q: query,
    sort: "price_asc",
    format: "json",
    limit: "20",
  });
  const data = await fetchJSON(`https://www.auctionohio.com/search?${params}`, {
    headers: { Accept: "application/json", "X-Requested-With": "XMLHttpRequest" },
  });

  const lots = data?.lots || data?.items || data?.results || [];
  return {
    source: "Auction Ohio",
    items: lots
      .map((lot) => {
        const price = parseFloat(lot.currentBid ?? lot.currentPrice ?? lot.price ?? 0);
        return {
          title: lot.title || lot.name,
          price,
          shipping: 0,
          total: price || null,
          condition: "Auction",
          url: lot.url || lot.link || (lot.id ? `https://www.auctionohio.com/lot/${lot.id}` : null),
          source: "Auction Ohio",
        };
      })
      .filter((item) => {
        if (minPrice != null && item.total != null && item.total < minPrice) return false;
        if (maxPrice != null && item.total != null && item.total > maxPrice) return false;
        return true;
      }),
  };
}

async function searchGSAAuctions(query, { maxPrice, minPrice } = {}) {
  const params = new URLSearchParams({ srchStr: query, so: "1", sapar: "1" });
  const data = await fetchJSON(`https://gsaauctions.gov/api/search?${params}`, {
    headers: { Accept: "application/json" },
  });

  const items = data?.auctions || data?.items || data?.results || [];
  return {
    source: "GSA Auctions",
    items: items
      .map((item) => {
        const price = parseFloat(item.currentBid ?? item.openingBid ?? item.price ?? 0);
        return {
          title: item.title || item.description,
          price,
          shipping: 0,
          total: price || null,
          condition: "Government Surplus (Auction)",
          url: item.url || (item.saleId ? `https://gsaauctions.gov/gsaauctions/auctiondetail?saleId=${item.saleId}` : null),
          source: "GSA Auctions",
        };
      })
      .filter((item) => {
        if (minPrice != null && item.total != null && item.total < minPrice) return false;
        if (maxPrice != null && item.total != null && item.total > maxPrice) return false;
        return true;
      }),
  };
}

async function searchLiquidation(query, { maxPrice, minPrice } = {}) {
  const params = new URLSearchParams({
    keyword: query,
    sort: "price_asc",
    limit: "20",
  });

  const data = await fetchJSON(`https://www.liquidation.com/auction/search?${params}`, {
    headers: {
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
  });

  const auctions = data?.auctions || data?.items || data?.results || [];
  return {
    source: "Liquidation.com",
    items: auctions
      .map((a) => {
        const price = parseFloat(a.currentBid ?? a.currentPrice ?? a.startingBid ?? 0);
        return {
          title: a.title || a.name,
          price,
          shipping: 0,
          total: price || null,
          condition: "Liquidation (Auction)",
          url: a.url || (a.id ? `https://www.liquidation.com/auction/view?id=${a.id}` : null),
          source: "Liquidation.com",
        };
      })
      .filter((item) => {
        if (minPrice != null && item.total != null && item.total < minPrice) return false;
        if (maxPrice != null && item.total != null && item.total > maxPrice) return false;
        return true;
      }),
  };
}

async function searchCraigslist(query, city = "newyork") {
  const url = `https://${city}.craigslist.org/search/sss?format=rss&query=${encodeURIComponent(query)}&sort=priceasc`;
  const text = await fetchText(url, {
    headers: { Accept: "application/rss+xml, text/xml, */*" },
  });

  if (!text.includes("<item>")) return { source: "Craigslist", items: [] };

  const items = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRe.exec(text)) !== null && items.length < 15) {
    const block = match[1];
    const title = (
      block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) ||
      block.match(/<title>(.*?)<\/title>/)
    )?.[1]?.trim();
    const link = block.match(/<link>(.*?)<\/link>/)?.[1]?.trim();

    const priceMatch = title?.match(/\$([0-9,]+(?:\.[0-9]{2})?)/);
    const price = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, "")) : null;

    if (title && link) {
      items.push({
        title,
        price,
        shipping: 0,
        total: price,
        condition: "Used (varies)",
        url: link,
        source: "Craigslist",
      });
    }
  }

  return { source: "Craigslist", items };
}

server.tool(
  "compare_prices",
  {
    query: z.string().describe("Product to search for (e.g. 'smart TV 43 inch', 'PS5', 'iPhone 15')"),
    condition: z.enum(["any", "new", "used"]).optional().default("any").describe("Item condition"),
    max_price: z.number().optional().describe("Maximum budget in USD"),
    min_price: z.number().optional().describe("Minimum price to filter out junk listings"),
    city: z
      .string()
      .optional()
      .default("newyork")
      .describe("Craigslist city slug: newyork, sfbay, chicago, losangeles, houston, seattle, boston, denver, etc."),
    sources: z
      .array(z.enum(["ebay", "bestbuy", "craigslist", "depop", "hibid", "shopgoodwill", "auctionola", "liquidation", "whatnot", "heritage", "auctionohio", "gsa"]))
      .optional()
      .describe("Which marketplaces to search (default: all)"),
  },
  async ({ query, condition, max_price, min_price, city, sources }) => {
    const activeSources = sources ?? ["ebay", "bestbuy", "craigslist", "depop", "hibid", "shopgoodwill", "auctionola", "liquidation", "whatnot", "heritage", "auctionohio", "gsa"];

    const fetches = [];
    if (activeSources.includes("ebay")) fetches.push(searchEbay(query, { condition, maxPrice: max_price, minPrice: min_price }));
    if (activeSources.includes("bestbuy")) fetches.push(searchBestBuy(query, { maxPrice: max_price }));
    if (activeSources.includes("craigslist")) fetches.push(searchCraigslist(query, city));
    if (activeSources.includes("depop")) fetches.push(searchDepop(query, { maxPrice: max_price, minPrice: min_price }));
    if (activeSources.includes("hibid")) fetches.push(searchHiBid(query, { maxPrice: max_price, minPrice: min_price }));
    if (activeSources.includes("shopgoodwill")) fetches.push(searchShopGoodwill(query, { maxPrice: max_price, minPrice: min_price }));
    if (activeSources.includes("auctionola")) fetches.push(searchAuctionOLA(query, { maxPrice: max_price, minPrice: min_price }));
    if (activeSources.includes("liquidation")) fetches.push(searchLiquidation(query, { maxPrice: max_price, minPrice: min_price }));
    if (activeSources.includes("whatnot")) fetches.push(searchWhatnot(query, { maxPrice: max_price, minPrice: min_price }));
    if (activeSources.includes("heritage")) fetches.push(searchHeritageAuctions(query, { maxPrice: max_price, minPrice: min_price }));
    if (activeSources.includes("auctionohio")) fetches.push(searchAuctionOhio(query, { maxPrice: max_price, minPrice: min_price }));
    if (activeSources.includes("gsa")) fetches.push(searchGSAAuctions(query, { maxPrice: max_price, minPrice: min_price }));

    const settled = await Promise.allSettled(fetches);
    const allResults = settled.map((r) => (r.status === "fulfilled" ? r.value : { source: "unknown", items: [] }));

    const missingKeys = allResults.filter((r) => r._noKey).map((r) => r.source);
    const allItems = allResults.flatMap((r) => r.items ?? []);

    const filtered = allItems.filter((item) => {
      if (item.total === null || item.total === undefined) return true;
      if (min_price !== undefined && item.total < min_price) return false;
      if (max_price !== undefined && item.total > max_price) return false;
      return true;
    });

    const sorted = [...filtered].sort((a, b) => {
      if (a.total == null && b.total == null) return 0;
      if (a.total == null) return 1;
      if (b.total == null) return -1;
      return a.total - b.total;
    });

    let out = `## Price Comparison: "${query}"\n`;
    if (condition !== "any") out += `Condition: ${condition}\n`;
    if (max_price) out += `Budget: up to $${max_price}\n`;
    out += "\n";

    if (missingKeys.length > 0) {
      out += `> **API keys needed for:** ${missingKeys.join(", ")}\n`;
      if (missingKeys.includes("eBay"))
        out += `> - eBay: register at https://developer.ebay.com → set env vars \`EBAY_CLIENT_ID\` and \`EBAY_CLIENT_SECRET\`\n`;
      if (missingKeys.includes("BestBuy"))
        out += `> - BestBuy: register at https://developer.bestbuy.com → set env var \`BESTBUY_API_KEY\`\n`;
      out += "\n";
    }

    out += `> **Facebook Marketplace** has no public API — check manually at facebook.com/marketplace\n\n`;

    if (sorted.length === 0) {
      out += `No listings found across active sources. Try broader search terms.\n`;
      return { content: [{ type: "text", text: out }] };
    }

    const withPrice = sorted.filter((i) => i.total != null);
    if (withPrice.length > 0) {
      const best = withPrice[0];
      const shipNote = best.shipping > 0 ? ` ($${best.price.toFixed(2)} + $${best.shipping.toFixed(2)} shipping)` : " (incl. shipping / local)";
      out += `### Best Price\n`;
      out += `**[${best.title}](${best.url})**\n`;
      out += `- **$${best.total.toFixed(2)}**${shipNote}\n`;
      if (best.condition) out += `- Condition: ${best.condition}\n`;
      out += `- Source: ${best.source}\n`;
      if (best.seller) out += `- Seller: ${best.seller}\n`;
      out += "\n";
    }

    out += `### All Listings (${sorted.length} total, cheapest first)\n\n`;

    for (const item of sorted.slice(0, 30)) {
      const priceStr = item.total != null ? `**$${item.total.toFixed(2)}**` : "_Price not listed_";
      const shipStr = item.shipping > 0 ? ` + $${item.shipping.toFixed(2)} ship` : "";
      out += `**[${item.title}](${item.url})**\n`;
      out += `${priceStr}${shipStr} — ${item.source}`;
      if (item.condition) out += ` | ${item.condition}`;
      if (item.seller) out += ` | ${item.seller}`;
      out += "\n\n";
    }

    const bySource = {};
    for (const r of allResults) {
      if (!r._noKey) bySource[r.source] = r.items?.length ?? 0;
    }
    out += `---\n_Sources searched: ${Object.entries(bySource).map(([s, n]) => `${s} (${n})`).join(", ")}_\n`;

    return { content: [{ type: "text", text: out }] };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
