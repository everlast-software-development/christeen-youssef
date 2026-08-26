'use client';

import { useEffect, useState } from 'react';

/**
 * Whether the page has scrolled past `threshold` pixels.
 *
 * Reads `window.scrollY` rather than a Lenis value: Lenis here drives real
 * window scroll, which is the same arrangement the footer's reveal and the
 * scroll progress bar already depend on, so there is nothing to bridge.
 */
export function useScrolled(threshold = 40) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;

    const read = () => {
      frame = 0;
      setScrolled(window.scrollY > threshold);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    // Deferred into a frame rather than read inline. A back navigation or a
    // hash link can land mid-page, so the first reading cannot be assumed to be
    // false — and setting state synchronously in an effect body is what the
    // react-hooks rules forbid.
    schedule();

    window.addEventListener('scroll', schedule, { passive: true });
    // A resize can change how far the document scrolls, and with it whether the
    // current offset is still past the threshold.
    window.addEventListener('resize', schedule);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [threshold]);

  return scrolled;
}
