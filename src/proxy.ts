import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Paths that only a vulnerability scanner ever asks for.
 *
 * None of these can collide with a real route. The site is `/`, `/about-me`,
 * `/before-and-after`, `/blog`, `/blog/<slug>`, `/reach-me`, two API routes and
 * four legacy redirects — no PHP, no admin panel, no CMS. Anything matching
 * below is a probe, and the only correct answer is a short one.
 *
 * `.well-known` is deliberately absent: it looks like a dotfile and is not —
 * certificate renewal and Apple's app-site association live there, and blocking
 * it breaks them quietly, months later.
 */
const PROBE =
  /(^|\/)(wp-|wordpress|xmlrpc|phpmyadmin|pma|myadmin|administrator|admin\/|cgi-bin|vendor\/|owa\/|autodiscover|\.env|\.git|\.svn|\.hg|\.aws|\.ssh|\.vscode|\.idea|\.DS_Store|config\.(json|php|yml)|backup|dump\.sql|wlwmanifest)|\.(php[0-9]?|asp|aspx|jsp|cgi|sql|bak|old|swp|tar|gz|zip|rar|7z)$/i;

/**
 * Turns away scanner traffic before it reaches the app.
 *
 * The site's 404 is a prerendered page, which is cheap to *render* but 52 KB to
 * *send*. Across roughly 80,000 unreal requests a month that is about four
 * gigabytes of egress spent telling robots that `/wp-login.php` does not exist.
 * This answers the same thing in nine bytes.
 *
 * It is also cacheable, which matters more than the size: Cloudflare sits in
 * front of this origin (see the `cf-ipcountry` handling in /api/country), so a
 * cached 404 means the second probe for a path never reaches Railway at all.
 *
 * 404 rather than 403. A 403 says "this exists and you may not have it", which
 * is both untrue and an invitation; 404 is the honest answer and ends the
 * conversation.
 *
 * Named `proxy`, in `proxy.ts`. The `middleware.ts` convention this would have
 * used is deprecated in Next 16 and renamed — same behaviour, different file
 * and export.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PROBE.test(pathname)) {
    return new NextResponse('Not Found', {
      status: 404,
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'cache-control': 'public, max-age=3600',
        // Nothing here is a page; keep it out of any index that finds it.
        'x-robots-tag': 'noindex',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  /**
   * Everything except the things served straight off disk.
   *
   * Without a matcher this runs on *every* request including `_next/static` and
   * `_next/image`, which would put a regex test in front of every chunk, font
   * and photograph on the site for no gain — none of those paths can match
   * PROBE anyway.
   */
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml).*)',
  ],
};
