'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

// Register once, here, so no component has to think about plugin setup.
// useGSAP is registered as a plugin per GSAP's React guidance.
gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

// House style for every tween that doesn't override it. Matches --ease-brand.
gsap.defaults({
  ease: 'power3.out',
  duration: 1,
});

/**
 * Whether the reader has asked their system for less motion.
 *
 * Read at the moment a `useGSAP` body runs rather than subscribed to, because
 * that is also when GSAP builds its tweens: a reader who flips the setting
 * mid-session gets the new behaviour on the next route change, which is soon
 * enough and costs nothing to maintain.
 *
 * SSR-safe — `useGSAP` only ever runs on the client, but this is exported and
 * the guard means a stray import cannot crash a server render.
 */
export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * The media query for the *other* side of that, for `gsap.matchMedia()`.
 *
 * Composed into a breakpoint query — `(min-width: 1024px) and ${MOTION_OK}` —
 * so a section that only animates on desktop states both conditions in one
 * place and matchMedia reverts the whole branch if either stops holding.
 */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';

export { gsap, ScrollTrigger, SplitText, useGSAP };
