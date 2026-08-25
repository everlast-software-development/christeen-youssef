'use client';

import { useEffect } from 'react';
import { ReactLenis, useLenis } from 'lenis/react';
import { useReducedMotion } from 'motion/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

/**
 * Drives Lenis from GSAP's ticker instead of its own RAF loop.
 *
 * This has to be a child of ReactLenis rather than a sibling effect: ReactLenis
 * creates the Lenis instance inside an effect and holds it in state, so the
 * imperative ref still reads `undefined` when a parent effect runs. Reading it
 * through useLenis() means this re-runs once the instance actually exists —
 * which matters a lot, because with autoRaf disabled nothing else calls raf()
 * and the page would not scroll at all.
 */
function LenisGsapBridge() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    // One RAF loop for both, so Lenis moves the scroll position and
    // ScrollTrigger reads it in the same frame. That is what stops pinned
    // sections from jittering.
    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off('scroll', ScrollTrigger.update);
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
    };
  }, [lenis]);

  return null;
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  // null until detected, so this is falsy on the server and during hydration
  // and only drops to native scrolling once reduced motion is confirmed.
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        autoRaf: false,
        // Longer settle + a damped wheel put a ceiling on how fast the page
        // can travel, so a hard flick cannot outrun the scroll-driven
        // sections. wheelMultiplier is the real limiter: it caps the distance
        // one wheel tick can throw the page no matter how hard it is spun.
        duration: 1.35,
        wheelMultiplier: 0.7,
        smoothWheel: true,
        // Touch devices keep native scrolling — smoothing it feels laggy.
        syncTouch: false,
      }}
    >
      <LenisGsapBridge />
      {children}
    </ReactLenis>
  );
}
