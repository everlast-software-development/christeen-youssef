'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Just below the header row (h-18 = 4.5rem) and the menu pill (top-3 + h-12),
 * so the probe reads the page rather than the chrome sitting on top of it.
 */
const PROBE_Y = 76;

/**
 * Whether the header is currently over a dark surface.
 *
 * Read with `elementFromPoint` rather than an IntersectionObserver on the
 * sections themselves, because on this site a section's box being on screen
 * says nothing about whether it is the thing you can see: the hero is sticky
 * for the whole of the home page with later sections travelling over it, and
 * Expertise pins. An observer can only report boxes and would call the hero
 * visible while it sits behind three other panels. elementFromPoint asks the
 * browser what actually painted at that pixel, which is the real question.
 *
 * Surfaces opt in with `data-header-surface="dark"`. Anything unmarked — and
 * any gap between marked sections — reads as light, which is the page default.
 *
 * @param paused Freeze the current reading. The open menu panel covers the
 *   probe point, so without this the header would flip as the menu expands.
 * @param revalidateKey Any value that should force a fresh reading when it
 *   changes. The header passes the page-transition phase, so a route change
 *   re-reads the moment the new page commits instead of waiting for a scroll.
 */
export function useHeaderSurface(paused = false, revalidateKey?: unknown) {
  const [onDark, setOnDark] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (paused) return;

    let frame = 0;

    const probe = () => {
      frame = 0;

      // elementsFromPoint, plural: the single-element version returns whatever
      // is on top, and during a route change that is the page-transition
      // curtain — a fixed, full-viewport panel with no surface of its own. It
      // read as "no marker found", defaulted to light, and stayed light until
      // something else triggered a re-read. Walking the stack top-down and
      // taking the first entry that actually belongs to a marked surface skips
      // the curtain, and any other overlay, without having to know about them.
      const stack = document.elementsFromPoint(window.innerWidth / 2, PROBE_Y);

      for (const element of stack) {
        // closest(), not the element itself: the pixel at that point usually
        // belongs to a scrim, a bloom layer or an image inside the section, not
        // to the section carrying the attribute.
        const surface = element.closest<HTMLElement>('[data-header-surface]');

        if (surface) {
          setOnDark(surface.dataset.headerSurface === 'dark');
          return;
        }
      }

      // Nothing marked under the header: the page default is light.
      setOnDark(false);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(probe);
    };

    // One frame late on purpose: on a fresh route the probe would otherwise run
    // against a layout that has not been painted yet.
    schedule();

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [paused, pathname, revalidateKey]);

  return onDark;
}
