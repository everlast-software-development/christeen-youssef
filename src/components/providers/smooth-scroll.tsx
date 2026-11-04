import { useEffect, useRef, useSyncExternalStore } from 'react';
import { useLocation } from 'react-router';
import { ReactLenis, useLenis } from 'lenis/react';
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

/**
 * A new route always opens at the top, instantly — never a smooth scroll up
 * from wherever the last page was left. Keyed on the pathname, so hash links
 * within a page keep scrolling smoothly. Once the new page has painted, Lenis
 * re-measures its height and ScrollTrigger its positions.
 */
function RouteScrollReset() {
  const lenis = useLenis();
  const pathname = useLocation().pathname;
  const previous = useRef(pathname);

  useEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;

    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);

    const frame = requestAnimationFrame(() => {
      lenis?.resize();
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, lenis]);

  return null;
}

const REDUCED = '(prefers-reduced-motion: reduce)';
const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  // Reduced motion turns the smoothing off rather than unmounting Lenis. The
  // wrapper has to be in the tree either way: the server cannot know the
  // preference, and a client tree with one provider fewer shifts every useId
  // beneath it, which React reports as a hydration mismatch.
  const reducedMotion = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );

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
        smoothWheel: !reducedMotion,
        // Touch devices keep native scrolling — smoothing it feels laggy.
        syncTouch: false,
        // #section links scroll smoothly and stop below the fixed header
        // (64px compact height + the notch inset, as scroll-padding-top).
        anchors: { offset: -64 },
      }}
    >
      <LenisGsapBridge />
      <RouteScrollReset />
      {children}
    </ReactLenis>
  );
}
