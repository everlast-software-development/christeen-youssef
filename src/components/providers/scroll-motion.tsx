'use client';

import { usePathname } from 'next/navigation';
import {
  gsap,
  ScrollTrigger,
  SplitText,
  useGSAP,
  prefersReducedMotion,
} from '@/lib/gsap';
import { PRELOADER_DONE } from '@/components/site/preloader';

/**
 * The site's scroll motion, declared in markup and run from one place.
 *
 * Every effect here moves things — none of them hides anything. Elements are
 * rendered in their final, fully visible state; GSAP only offsets them on the
 * way in. So with JavaScript off, or before it arrives, or with reduced motion
 * on (in which case nothing below runs at all), the page is simply there.
 *
 *   data-reveal                 rises 22px into place when it enters
 *   data-reveal-group           staggers its [data-reveal-item] children up
 *   data-reveal-img             settles from scale 1.1 → 1 (parent must clip)
 *   data-parallax="<percent>"   drifts against the scroll, scrubbed
 *   data-word-fill              words brighten from dim to full as you scroll
 *   data-rise                   climbs 80px into place (the CTA portrait)
 *
 * Re-run on every route change so the new page's elements are picked up. On a
 * first visit it waits for the preloader to lift ("preloader:done").
 */
export function ScrollMotion() {
  const pathname = usePathname();

  useGSAP(
    (_context, contextSafe) => {
      if (prefersReducedMotion()) return;
      const setup = () => {

        // A reveal must never be left part-way: an offset that outlives its
        // tween is what pushes one block of text into the next. So every one
        // clears its inline transform when it finishes, and if its trigger is
        // already passed — or can never be reached because it sits too close to
        // the bottom of the page — it is played straight to the end instead of
        // waiting for a scroll that will not come.
        const enter = (trigger: Element) => ({
          trigger,
          start: 'top 90%',
          once: true,
          onRefresh: (self: ScrollTrigger) => {
            if (self.start > ScrollTrigger.maxScroll(window) || self.progress === 1) {
              self.animation?.progress(1);
            }
          },
        });

        const settle = { clearProps: 'transform' };

        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
          gsap.from(el, {
            y: 22,
            duration: 1.1,
            ease: 'power3.out',
            ...settle,
            scrollTrigger: enter(el),
          });
        });

        gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
          const items = group.querySelectorAll('[data-reveal-item]');
          if (!items.length) return;
          gsap.from(items, {
            y: 22,
            duration: 1.1,
            stagger: 0.08,
            ease: 'power3.out',
            ...settle,
            scrollTrigger: enter(group),
          });
        });

        gsap.utils.toArray<HTMLElement>('[data-reveal-img]').forEach((el) => {
          gsap.from(el, {
            scale: 1.1,
            duration: 1.6,
            ease: 'power2.out',
            ...settle,
            scrollTrigger: enter(el),
          });
        });

        gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
          const amount = Number(el.dataset.parallax) || 8;
          gsap.fromTo(
            el,
            { yPercent: amount },
            {
              yPercent: -amount,
              ease: 'none',
              scrollTrigger: {
                trigger: el.parentElement ?? el,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>('[data-rise]').forEach((el) => {
          gsap.from(el, {
            y: 80,
            duration: 1.6,
            ease: 'power3.out',
            ...settle,
            scrollTrigger: { ...enter(el.parentElement ?? el), start: 'top 80%' },
          });
        });

        gsap.utils.toArray<HTMLElement>('[data-word-fill]').forEach((el) => {
          // data-word-fill="dark": on ink, each word fills from a dim warm grey
          // to pure white, and is fully white once the heading reaches the
          // middle of the screen. Otherwise words brighten by opacity.
          const toWhite = el.dataset.wordFill === 'dark';
          SplitText.create(el, {
            type: 'words',
            autoSplit: true,
            onSplit: (self) =>
              gsap.fromTo(
                self.words,
                toWhite ? { color: '#5E5850' } : { opacity: 0.22 },
                {
                  ...(toWhite ? { color: '#FFFFFF' } : { opacity: 1 }),
                  stagger: 0.12,
                  ease: 'none',
                  scrollTrigger: {
                    trigger: el,
                    start: 'top 82%',
                    end: toWhite ? 'top 45%' : 'bottom 45%',
                    scrub: true,
                  },
                },
              ),
          });
        });

        // Positions were measured before late images and the route's scroll
        // reset settled; measure again once they have.
        const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
        return () => cancelAnimationFrame(frame);
      };

      // On a first visit the preloader is up; nothing moves until it lifts.
      if (document.documentElement.dataset.preloader === 'run' && contextSafe) {
        const start = contextSafe(setup);
        window.addEventListener(PRELOADER_DONE, start, { once: true });
        return () => window.removeEventListener(PRELOADER_DONE, start);
      }
      return setup();
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}
