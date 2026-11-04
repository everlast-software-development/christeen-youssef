import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { ScrollTrigger } from '@/lib/gsap';

/**
 * A new route always opens at the top, instantly — never a scroll up from
 * wherever the last page was left. Keyed on the pathname, so a #hash link
 * within a page is left to the browser. Once the new page has painted,
 * ScrollTrigger re-measures its positions.
 *
 * Scrolling itself is the browser's own everywhere; ScrollTrigger reads the
 * window as its scroller.
 */
export function RouteScroll() {
  const pathname = useLocation().pathname;
  const previous = useRef(pathname);

  useEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;

    window.scrollTo(0, 0);
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
