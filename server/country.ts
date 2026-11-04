import type { Request, Response } from 'express';

/** How long a browser may reuse its own answer. Nobody changes country mid-visit. */
const CLIENT_TTL = 60 * 60 * 24;

/** How long one IP's lookup is reused on the server. */
const MEMO_TTL_MS = 60 * 60 * 1000;

/**
 * Most requests never need the lookup at all: Cloudflare answers from its own
 * edge data. The outbound call only runs when that header is missing, against
 * a free tier that rate-limits by origin IP — so answers are memoised per IP,
 * and the memo is capped so a flood of unique addresses cannot grow it.
 */
const memo = new Map<string, { code: string | null; at: number }>();
const MEMO_MAX = 500;

function remember(ip: string, code: string | null) {
  // Oldest-first eviction: Map keeps insertion order.
  memo.delete(ip);
  if (memo.size >= MEMO_MAX) {
    const oldest = memo.keys().next().value;
    if (oldest !== undefined) memo.delete(oldest);
  }
  memo.set(ip, { code, at: Date.now() });
}

function answer(response: Response, countryCode: string | null) {
  // `private`: derived from the caller's own IP, never for a shared cache.
  response.set('cache-control', `private, max-age=${CLIENT_TTL}`).json({ countryCode });
}

/** GET /api/country — the visitor's country, for the phone field's default. */
export async function country(request: Request, response: Response) {
  const cfCountry = request.get('cf-ipcountry');
  if (cfCountry && cfCountry.length === 2) {
    answer(response, cfCountry.toUpperCase());
    return;
  }

  const clientIp =
    request.get('x-forwarded-for')?.split(',')[0]?.trim() ?? request.get('x-real-ip');
  const isRoutable = clientIp && clientIp !== '::1' && clientIp !== '127.0.0.1';

  if (!isRoutable) {
    answer(response, null);
    return;
  }

  const seen = memo.get(clientIp);
  if (seen && Date.now() - seen.at < MEMO_TTL_MS) {
    answer(response, seen.code);
    return;
  }

  try {
    const lookup = await fetch(`https://ipapi.co/${clientIp}/json/`, {
      signal: AbortSignal.timeout(3000),
    });

    if (lookup.ok) {
      const data = (await lookup.json()) as { country_code?: string };
      if (data.country_code?.length === 2) {
        const code = data.country_code.toUpperCase();
        remember(clientIp, code);
        answer(response, code);
        return;
      }
    }

    // A rate-limited or unhelpful answer is still an answer.
    remember(clientIp, null);
  } catch (error) {
    console.error('IP geolocation failed:', error);
    remember(clientIp, null);
  }

  answer(response, null);
}
