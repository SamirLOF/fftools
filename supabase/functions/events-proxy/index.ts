// Lovable Cloud function: proxy events API to avoid browser CORS/proxy instability

const ALLOWED_REGIONS = new Set([
  "SG",
  "BD",
  "IND",
  "CIS",
  "EU",
  "NA",
  "PK",
  "ID",
  "TH",
  "ME",
  "BR",
  "SAC",
  "VN",
]);

const API_KEY = "SHAHG";
const BASE_URL = "https://x-ff.vercel.app/event";

function corsHeaders(origin: string | null) {
  // permissive for public data
  return {
    "Access-Control-Allow-Origin": origin ?? "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };
}

async function getRegion(req: Request): Promise<string> {
  const url = new URL(req.url);

  // GET: ?region=SG
  const fromQuery = (url.searchParams.get("region") || "").toUpperCase();
  if (fromQuery) return fromQuery;

  // POST: { region: "SG" }
  if (req.method === "POST") {
    try {
      const body = await req.json();
      const fromBody = String(body?.region || "").toUpperCase();
      return fromBody;
    } catch {
      return "";
    }
  }

  return "";
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders(origin) });
  }

  try {
    const region = await getRegion(req);

    if (!ALLOWED_REGIONS.has(region)) {
      return new Response(JSON.stringify({ error: "Invalid region" }), {
        status: 400,
        headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
      });
    }

    const upstreamUrl = `${BASE_URL}?region=${encodeURIComponent(region)}&key=${encodeURIComponent(API_KEY)}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);

    const upstreamRes = await fetch(upstreamUrl, {
      signal: controller.signal,
      headers: { "User-Agent": "lovable-events-proxy" },
    }).finally(() => clearTimeout(timeout));

    const text = await upstreamRes.text();

    return new Response(text, {
      status: upstreamRes.status,
      headers: {
        ...corsHeaders(origin),
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=30",
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 502,
      headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
    });
  }
});
