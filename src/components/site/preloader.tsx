import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useLenis } from 'lenis/react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';
import { preloadPage } from '@/routes';

/** sessionStorage key: set once the full preloader has played this session. */
export const PRELOADED_KEY = 'cy:preloaded';

/** Fired on window when the first-visit preloader has gone; motion waits for it. */
export const PRELOADER_DONE = 'preloader:done';

const MIN_MS = 900;
const MAX_MS = 2500;
const NAV_IN_MS = 200;
const NAV_OUT_MS = 300;
/** If a route never resolves, fade back in rather than hang on ink. */
const NAV_SAFETY_MS = 4000;

/**
 * Runs during HTML parse, before first paint (inlined in the root layout):
 * decides whether this load plays the full preloader and stamps the answer on
 * <html>, so a refresh later in the session never flashes the overlay. If the
 * app never takes over, it releases the page itself after 4s.
 */
export const PRELOADER_BOOT = `(function(){var d=document.documentElement;try{d.dataset.preloader=sessionStorage.getItem('${PRELOADED_KEY}')?'skip':'run'}catch(e){d.dataset.preloader='skip'}if(d.dataset.preloader==='run'){setTimeout(function(){if(!window.__cyPreloaderLive&&d.dataset.preloader==='run'){d.dataset.preloader='done'}},4000)}})();`;

type NavigationValue = { navigate: (href: string) => void };

const NavigationContext = createContext<NavigationValue | null>(null);

export function usePageNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('usePageNavigation must be used inside <Preloader>');
  return ctx;
}

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

const pageLoaded = () =>
  document.readyState === 'complete'
    ? Promise.resolve()
    : new Promise<void>((resolve) => window.addEventListener('load', () => resolve(), { once: true }));

/**
 * The first-visit preloader and the short cover for in-site navigation.
 *
 * First visit (once per browser session): an ink screen with the CY mark, the
 * name and a gold progress line. It holds until fonts and the window load are
 * in — at least 900ms, at most 2.5s — then the mark and name lift away and the
 * screen slides up. Scrolling is locked while it shows; the page's entry and
 * scroll motion begin only once it has gone.
 *
 * Later navigations: the ink fades in over 200ms, the new route renders
 * behind it at the top of the page, and it fades out over 300ms.
 *
 * The overlay is server-rendered so nothing flashes before it, but it can
 * never trap anyone: CSS hides it after 3s if scripts stall, the boot script
 * releases the page after 4s, and <noscript> hides it outright.
 */
export function Preloader({ children }: { children: React.ReactNode }) {
  const go = useNavigate();
  const pathname = useLocation().pathname;
  const lenis = useLenis();

  const overlay = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [running, setRunning] = useState(false);

  // ---------------- First visit ----------------
  useEffect(() => {
    const html = document.documentElement;
    if (html.dataset.preloader !== 'run' || !overlay.current) return;

    // The app has taken over: switch off both failsafes.
    (window as Window & { __cyPreloaderLive?: boolean }).__cyPreloaderLive = true;
    overlay.current.dataset.live = '';
    setRunning(true);

    const reduced = prefersReducedMotion();
    const fill = gsap.fromTo(bar.current, { scaleX: 0 }, { scaleX: 0.9, duration: MIN_MS / 1000, ease: 'power2.out' });
    let cancelled = false;

    const ready = Promise.all([document.fonts?.ready ?? Promise.resolve(), pageLoaded(), wait(MIN_MS)]);

    Promise.race([ready, wait(MAX_MS)]).then(() => {
      if (cancelled) return;
      fill.kill();
      const finish = () => {
        try {
          sessionStorage.setItem(PRELOADED_KEY, '1');
        } catch {
          // Private mode: it simply plays again next time.
        }
        html.dataset.preloader = 'done';
        if (overlay.current) overlay.current.style.display = 'none';
        setRunning(false);
        window.dispatchEvent(new Event(PRELOADER_DONE));
        requestAnimationFrame(() => ScrollTrigger.refresh());
      };

      if (reduced) {
        gsap.to(overlay.current, { opacity: 0, duration: 0.3, ease: 'none', onComplete: finish });
        return;
      }

      gsap
        .timeline({ onComplete: finish })
        .to(bar.current, { scaleX: 1, duration: 0.2, ease: 'power1.out' })
        .to(content.current, { opacity: 0, y: -12, duration: 0.35, ease: 'power2.in' })
        .to(overlay.current, { yPercent: -100, duration: 0.7, ease: 'power3.inOut' }, '-=0.05');
    });

    return () => {
      cancelled = true;
      fill.kill();
    };
  }, []);

  // Scroll stays locked while the first-visit screen is up.
  useEffect(() => {
    if (!lenis) return;
    if (running) lenis.stop();
    else lenis.start();
  }, [lenis, running]);

  // ---------------- Navigation ----------------
  const [cover, setCover] = useState(false);
  const target = useRef<string | null>(null);
  const timers = useRef<number[]>([]);

  const clear = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);
  useEffect(() => clear, [clear]);

  const reveal = useCallback(() => {
    clear();
    target.current = null;
    setCover(false);
  }, [clear]);

  const navigate = useCallback(
    (href: string) => {
      // The route alone: a query or hash does not change useLocation().pathname.
      const path = href.split(/[?#]/)[0] || pathname;
      if (path === pathname) {
        go(href);
        return;
      }
      clear();
      target.current = path;
      // No lenis.stop() here: its stopped state clips the root's overflow,
      // which drops the scroll position to 0 before the ink is even up.
      setCover(true);
      // The route changes once the ink is up and the page's chunk is in, so
      // the swap happens behind it rather than through an empty fallback.
      const loaded = preloadPage(path).catch(() => undefined);
      timers.current.push(
        window.setTimeout(() => {
          loaded.then(() => {
            if (target.current === path) go(href);
          });
        }, NAV_IN_MS),
      );
      timers.current.push(window.setTimeout(reveal, NAV_IN_MS + NAV_SAFETY_MS));
    },
    [pathname, go, clear, reveal],
  );

  // The new route has rendered (and SmoothScroll has put it at the top):
  // give it a frame to paint behind the ink, then fade out.
  useEffect(() => {
    if (target.current !== pathname) return;
    const frame = requestAnimationFrame(() => requestAnimationFrame(reveal));
    return () => cancelAnimationFrame(frame);
  }, [pathname, reveal]);

  return (
    <NavigationContext.Provider value={{ navigate }}>
      {children}

      {/* First visit. Server-rendered; see the failsafes in globals.css. */}
      <div ref={overlay} aria-hidden className="preloader">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 70% at 50% 0%, #2E2A22 0%, #17150F 70%)' }}
        />
        <div ref={content} className="relative flex flex-col items-center">
          <img src="/favicon.webp" alt="" width={48} height={48} className="size-12 brightness-0 invert" />
          <p className="m-0 mt-4 font-display text-[1.5rem] leading-none text-cream">Christeen Youssef</p>
          <span className="mt-6 block h-px w-40 bg-white/13">
            <span ref={bar} className="block h-full origin-left scale-x-0 bg-gold" />
          </span>
        </div>
      </div>

      {/* Navigation cover: a plain ink fade, nothing else. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[500] bg-ink transition-opacity ease-out"
        style={{
          opacity: cover ? 1 : 0,
          transitionDuration: `${cover ? NAV_IN_MS : NAV_OUT_MS}ms`,
          pointerEvents: cover ? 'auto' : 'none',
        }}
      />
    </NavigationContext.Provider>
  );
}
