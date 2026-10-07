import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Reads request headers, so it must never be cached or prerendered.
export const dynamic = 'force-dynamic';

/** How long a browser may reuse its own answer. Nobody changes country mid-visit. */
const CLIENT_TTL = 60 * 60 * 24;

/** How long one IP's lookup is reused on the server. */
const MEMO_TTL_MS = 60 * 60 * 1000;

/**
 * Most requests never need the lookup at all.
 *
 * Cloudflare answers from its own edge data and costs nothing. The outbound
 * call below only runs when that header is missing, and it is the expensive
 * path in every sense: a third-party round trip on the request's critical path,
 * against a free tier that rate-limits by origin IP — so every visitor shares
 * one quota, and a scanner hammering this route could exhaust it for everyone.
 *
 * Two things keep that from happening. The answers are memoised per IP, and the
 * number of distinct IPs the memo will hold is capped: a flood of unique
 * addresses evicts its way through a fixed-size map instead of growing one.
 */
const memo = new Map<string, { code: string | null; at: number }>();
const MEMO_MAX = 500;

function remember(ip: string, code: string | null) {
  // Oldest-first eviction. Map keeps insertion order, so the first key is the
  // oldest — deleting before set keeps a refreshed IP from aging out early.
  memo.delete(ip);
  if (memo.size >= MEMO_MAX) {
    const oldest = memo.keys().next().value;
    if (oldest !== undefined) memo.delete(oldest);
  }
  memo.set(ip, { code, at: Date.now() });
}

function answer(countryCode: string | null) {
  return NextResponse.json(
    { countryCode },
    {
      headers: {
        // `private`, not `public`: this is derived from the caller's own IP and
        // must never be held in a shared cache and handed to someone else.
        'cache-control': `private, max-age=${CLIENT_TTL}`,
      },
    },
  );
}

export async function GET() {
  const headerList = await headers();

  // Cloudflare resolves this for us in production.
  const cfCountry = headerList.get('cf-ipcountry');
  if (cfCountry && cfCountry.length === 2) {
    return answer(cfCountry.toUpperCase());
  }

  // Fallback: geolocate the forwarded client IP.
  const clientIp =
    headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headerList.get('x-real-ip');

  const isRoutable =
    clientIp && clientIp !== '::1' && clientIp !== '127.0.0.1';

  if (!isRoutable) return answer(null);

  const seen = memo.get(clientIp);
  if (seen && Date.now() - seen.at < MEMO_TTL_MS) return answer(seen.code);

  try {
    const response = await fetch(`https://ipapi.co/${clientIp}/json/`, {
      signal: AbortSignal.timeout(3000),
    });

    if (response.ok) {
      const data = (await response.json()) as { country_code?: string };

      if (data.country_code?.length === 2) {
        const code = data.country_code.toUpperCase();
        remember(clientIp, code);
        return answer(code);
      }
    }

    // A rate-limited or unhelpful answer is still an answer: remembering it
    // stops the next request retrying immediately and making things worse.
    remember(clientIp, null);
  } catch (error) {
    console.error('IP geolocation failed:', error);
    remember(clientIp, null);
  }

  return answer(null);
}
