import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

/**
 * Gold scroll-progress bar pinned to the top of the viewport, standing in for
 * the hidden native scrollbar: scrollY / (scrollHeight − innerHeight), read
 * once per frame from a passive scroll listener and written straight to the
 * bar's transform — no React render per frame.
 *
 * A page too short to scroll reads 0, not 1: an empty bar is the right answer
 * when there is nothing below.
 */
export function ScrollProgress() {
  const pathname = useLocation().pathname;
  const bar = useRef<HTMLDivElement>(null);

  // Re-subscribed per route, which also re-reads the new page from the top.
  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const value = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${value})`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    // The page also grows without a scroll (lazy images, a section opening).
    const grow = new ResizeObserver(schedule);
    grow.observe(document.body);
    return () => {
      grow.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return (
    <div
      ref={bar}
      aria-hidden
      style={{ transform: 'scaleX(0)' }}
      className="pointer-events-none fixed inset-x-0 top-[env(safe-area-inset-top)] z-[105] h-0.5 origin-left bg-gold"
    />
  );
}
