'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, useMotionValue } from 'motion/react';
import { useLenis } from 'lenis/react';

/**
 * Gold scroll-progress bar pinned to the top of the viewport, standing in for
 * the hidden native scrollbar.
 *
 * Driven from Lenis rather than Motion's useScroll for two reasons: Lenis
 * already lerps its scroll position, so the raw value is smooth without a
 * spring that would have to unwind on navigation; and Lenis recalculates its
 * own `limit` when content height changes, so the bar stays correct after a
 * route swap to a page of a different length.
 */
export function ScrollProgress() {
  const pathname = usePathname();
  const progress = useMotionValue(0);

  const lenis = useLenis((instance) => {
    // Lenis returns progress 1 when limit is 0 ("all content seen"), which
    // would paint a full gold bar on any page too short to scroll. An empty
    // bar is the correct reading there.
    progress.set(instance.limit > 0 ? instance.progress : 0);
  });

  // Snap back to empty on navigation. Motion values are not React state, so
  // setting one here is not a render cascade.
  useEffect(() => {
    progress.set(0);
  }, [pathname, progress]);

  // Reduced motion means Lenis is never mounted, so fall back to native scroll.
  useEffect(() => {
    if (lenis) return;

    const read = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      progress.set(max > 0 ? el.scrollTop / max : 0);
    };

    read();
    window.addEventListener('scroll', read, { passive: true });
    window.addEventListener('resize', read);

    return () => {
      window.removeEventListener('scroll', read);
      window.removeEventListener('resize', read);
    };
  }, [lenis, progress]);

  return (
    <motion.div
      aria-hidden
      style={{ scaleX: progress }}
      className="fixed inset-x-0 top-0 z-60 h-0.75 origin-left bg-gradient-gold shadow-[0_0_12px_rgba(201,153,40,0.5)]"
    />
  );
}
