import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Reads request headers, so it must never be cached or prerendered.
export const dynamic = 'force-dynamic';

export async function GET() {
  const headerList = await headers();

  // Cloudflare resolves this for us in production.
  const cfCountry = headerList.get('cf-ipcountry');
  if (cfCountry && cfCountry.length === 2) {
    return NextResponse.json({ countryCode: cfCountry.toUpperCase() });
  }

  // Fallback: geolocate the forwarded client IP.
  const clientIp =
    headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headerList.get('x-real-ip');

  const isRoutable =
    clientIp && clientIp !== '::1' && clientIp !== '127.0.0.1';

  if (isRoutable) {
    try {
      const response = await fetch(`https://ipapi.co/${clientIp}/json/`, {
        signal: AbortSignal.timeout(3000),
      });

      if (response.ok) {
        const data = (await response.json()) as { country_code?: string };

        if (data.country_code?.length === 2) {
          return NextResponse.json({
            countryCode: data.country_code.toUpperCase(),
          });
        }
      }
    } catch (error) {
      console.error('IP geolocation failed:', error);
    }
  }

  return NextResponse.json({ countryCode: null });
}
