'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';
import { useLenis } from 'lenis/react';

const EASE = [0.22, 1, 0.36, 1] as const;

/** Sweep in from the right. */
export const COVER_MS = 900;
/** Minimum time the loader stays visible, so it never just flickers. */
const LOAD_MIN_MS = 750;
/** Continue out to the left. */
const REVEAL_MS = 900;
/** If a route never resolves, reveal anyway rather than hang covered. */
const SAFETY_MS = 4000;

// Wider than the viewport so the domed left/right edges sit off-screen while
// covering, leaving a flat full-bleed panel across the middle.
const PANEL_VW = 112;
const DOME_VW = 6;

// 105vw, not 100vw. At exactly 100vw the panel's left edge — and the 1px gold
// border on it — sits precisely on the right edge of the viewport, where
// subpixel rounding leaves a gold hairline down the side of every page. On a
// phone at devicePixelRatio 3 that reads as a visible stripe.
const X_RIGHT = '105vw'; // parked off-screen right
const X_COVER = `-${DOME_VW}vw`; // covering, domes outside the viewport
const X_LEFT = `-${PANEL_VW}vw`; // swept off-screen left

type Phase = 'idle' | 'covering' | 'loading' | 'revealing';

type TransitionValue = {
  navigate: (href: string) => void;
  phase: Phase;
};

const TransitionContext = createContext<TransitionValue | null>(null);

export function usePageTransition() {
  const ctx = useContext(TransitionContext);
  if (!ctx) {
    throw new Error('usePageTransition must be used inside <PageTransition>');
  }
  return ctx;
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const reduced = useReducedMotion();

  const [phase, setPhase] = useState<Phase>('idle');

  const targetRef = useRef<string | null>(null);
  const loadStartRef = useRef(0);
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  const after = useCallback((ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const startReveal = useCallback(() => {
    setPhase('revealing');
    after(REVEAL_MS, () => setPhase('idle'));
  }, [after]);

  const navigate = useCallback(
    (href: string) => {
      if (href === pathname) return;

      if (reduced) {
        router.push(href);
        return;
      }

      clearTimers();
      targetRef.current = href;
      setPhase('covering');

      // Swap only once the screen is fully covered.
      after(COVER_MS, () => {
        setPhase('loading');
        loadStartRef.current = Date.now();
        router.push(href);
      });

      after(COVER_MS + SAFETY_MS, () => {
        if (targetRef.current) {
          targetRef.current = null;
          startReveal();
        }
      });
    },
    [pathname, reduced, router, clearTimers, after, startReveal],
  );

  // Route has rendered. Reset scroll while still covered, then hold the loader
  // for its full minimum beat before sweeping away, so the reveal always plays
  // out after loading finishes instead of cutting it short.
  useEffect(() => {
    if (!targetRef.current || targetRef.current !== pathname) return;

    targetRef.current = null;
    clearTimers();

    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
      // The new page is a different height, so Lenis needs to recompute its
      // limit — otherwise the top progress bar reads against the old page's
      // scroll range.
      lenis.resize();
    } else {
      window.scrollTo(0, 0);
    }

    const elapsed = Date.now() - loadStartRef.current;
    after(Math.max(0, LOAD_MIN_MS - elapsed), startReveal);
  }, [pathname, lenis, clearTimers, after, startReveal]);

  const covered = phase === 'covering' || phase === 'loading';

  return (
    <TransitionContext.Provider value={{ navigate, phase }}>
      {children}

      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[200] overflow-hidden"
      >
      <motion.div
        aria-hidden={phase !== 'loading'}
        role={phase === 'loading' ? 'status' : undefined}
        aria-label={phase === 'loading' ? 'Loading page' : undefined}
        initial={false}
        animate={{
          x: covered ? X_COVER : phase === 'revealing' ? X_LEFT : X_RIGHT,
        }}
        transition={{
          duration:
            phase === 'covering'
              ? COVER_MS / 1000
              : phase === 'revealing'
                ? REVEAL_MS / 1000
                : // 'loading' is already in place; 'idle' snaps back to the
                  // right so the next sweep starts from off-screen again.
                  0,
          ease: EASE,
        }}
        className={covered ? 'pointer-events-auto' : 'pointer-events-none'}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${PANEL_VW}vw`,
          // 100% of the fixed wrapper above, not a viewport unit.
          //
          // This was `100svh`, which is the *small* viewport — the height the
          // page has when a phone browser is showing its URL bar and toolbars.
          // Scrolled down, those retract and the visible viewport becomes the
          // large one, so the sweep came up short and left a strip of the page
          // showing along the bottom edge for the whole transition.
          //
          // `100dvh` would track that, but it also re-measures whenever the bars
          // slide, which is a relayout in the middle of an animation. The
          // wrapper is `fixed inset-0` and already spans whatever the viewport
          // actually is, so inheriting it is both correct and stable.
          height: '100%',
          background: 'var(--ink)',
          // Elliptical leading/trailing edges soften the sweep.
          borderRadius: `${DOME_VW}vw / 50%`,
          borderLeft: '1px solid var(--gold)',
          borderRight: '1px solid var(--gold)',
          willChange: 'transform',
        }}
      >
        <motion.div
          initial={false}
          animate={{ opacity: phase === 'loading' ? 1 : 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <span className="size-9 animate-spin rounded-full border-2 border-cream/20 border-t-gold" />
        </motion.div>
      </motion.div>
      </div>
    </TransitionContext.Provider>
  );
}
