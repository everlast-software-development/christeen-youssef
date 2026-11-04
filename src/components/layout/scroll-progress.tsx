import { useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { useLenis } from 'lenis/react';

/**
 * Gold scroll-progress bar pinned to the top of the viewport, standing in for
 * the hidden native scrollbar.
 *
 * Driven from Lenis rather than Motion's useScroll for two reasons: Lenis
 * already lerps its scroll position, so the raw value is smooth without a
 * spring that would have to unwind on navigation; and Lenis recalculates its
 * own `limit` when content height changes, so the bar stays correct after a
 * route swap to a page of a different length. The bar is written straight to
 * the DOM each frame — no React render, and no animation library in the
 * site's shell for one transform.
 */
export function ScrollProgress() {
  const pathname = useLocation().pathname;
  const bar = useRef<HTMLDivElement>(null);
  const set = useCallback((value: number) => {
    if (bar.current) bar.current.style.transform = `scaleX(${value})`;
  }, []);

  const lenis = useLenis((instance) => {
    // Lenis returns progress 1 when limit is 0 ("all content seen"), which
    // would paint a full gold bar on any page too short to scroll. An empty
    // bar is the correct reading there.
    set(instance.limit > 0 ? instance.progress : 0);
  });

  // Snap back to empty on navigation.
  useEffect(() => {
    set(0);
  }, [pathname, set]);

  // Reduced motion means Lenis is never mounted, so fall back to native scroll.
  useEffect(() => {
    if (lenis) return;

    const read = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      set(max > 0 ? el.scrollTop / max : 0);
    };

    read();
    window.addEventListener('scroll', read, { passive: true });
    window.addEventListener('resize', read);

    return () => {
      window.removeEventListener('scroll', read);
      window.removeEventListener('resize', read);
    };
  }, [lenis, set]);

  return (
    <div
      ref={bar}
      aria-hidden
      style={{ transform: 'scaleX(0)' }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[105] h-0.5 origin-left bg-gold"
    />
  );
}
