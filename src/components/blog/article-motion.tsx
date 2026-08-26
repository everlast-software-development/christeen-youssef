'use client';

import { useRef, type ReactNode } from 'react';
import { gsap, SplitText, useGSAP } from '@/lib/gsap';

/**
 * Scroll motion for an article, applied to server-rendered children.
 *
 * A wrapper taking `children` rather than motion built into ArticleBody, so the
 * body stays a server component: the article markup is the largest thing on
 * these pages and there is no reason to ship it to the client to animate it. All
 * that crosses the boundary is this file.
 *
 * The targets are opted into by attribute rather than by tag. Animating every
 * paragraph would mean an article that never settles while you read it — only
 * the furniture moves: headings, lists, quotes, case cards, images and the
 * panels.
 */
export function ArticleMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      // Nothing here is essential to reading the article, so with reduced
      // motion the whole thing is skipped and the markup renders as-is. It has
      // to be an early return rather than a matchMedia with a shorter tween:
      // these are `from` tweens, so not running them is exactly the right
      // outcome — the element is already in its final state.
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      // Headings rise out of a mask, the same device the About hero uses.
      // autoSplit so a re-wrap at a different width re-splits rather than
      // leaving the lines broken where they were measured.
      root
        .querySelectorAll<HTMLElement>('[data-reveal-heading]')
        .forEach((heading) => {
          SplitText.create(heading, {
            type: 'lines',
            mask: 'lines',
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 115,
                duration: 1.1,
                stagger: 0.09,
                ease: 'power4.out',
                scrollTrigger: { trigger: heading, start: 'top 88%' },
              }),
          });
        });

      root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
        gsap.from(element, {
          y: 26,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 90%' },
        });
      });

      // Images uncover rather than fade, so they arrive as objects rather than
      // as pictures loading.
      root
        .querySelectorAll<HTMLElement>('[data-reveal-image]')
        .forEach((frame) => {
          gsap.from(frame, {
            clipPath: 'inset(0% 0% 100% 0%)',
            duration: 1.3,
            ease: 'power4.inOut',
            scrollTrigger: { trigger: frame, start: 'top 88%' },
          });
        });
    },
    { scope: rootRef },
  );

  return <div ref={rootRef}>{children}</div>;
}
