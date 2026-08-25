'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

// Three authored lines, not one string that happens to wrap. The break after
// each clause is the whole rhythm of the thing, so it is never left to the
// measure to decide.
const LINES = [
  'Precision in every detail.',
  'Science in every decision.',
  'Care in every result.',
];

/**
 * The held beat between Principles and Expertise. It has to sit outside
 * Expertise rather than be padding inside it: that section pins at `top top`,
 * so padding of its own would be held on screen for the whole horizontal run
 * instead of scrolling past.
 */
export function ManifestoBand() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const rule = rootRef.current?.querySelector<HTMLElement>('[data-rule]');
      const lines = gsap.utils.toArray<HTMLElement>(
        '[data-line]',
        rootRef.current,
      );

      // One timeline so the rule and the lines can never drift apart. The band
      // is short — barely more than a third of a screen — so it is well inside
      // the viewport by `top 80%` and the reveal plays where it can be seen.
      const tl = gsap.timeline({
        scrollTrigger: { trigger: rootRef.current, start: 'top 80%', once: true },
      });

      // Draws out from the centre, matching the composition rather than the
      // left-origin rules the other sections use for their left-aligned type.
      if (rule) {
        tl.from(rule, { scaleX: 0, duration: 1.2, ease: 'power3.inOut' }, 0);
      }

      // The mask wrappers are authored in the markup rather than produced by
      // SplitText: the lines are fixed and sized never to wrap, so there is
      // nothing for autoSplit to re-measure and no reason to pay for a split.
      tl.from(
        lines,
        {
          yPercent: 115,
          duration: 1.3,
          stagger: 0.13,
          ease: 'power4.out',
        },
        0.15,
      );

      // A slow counter-drift as the band crosses the screen, so the statement
      // is not simply pasted onto the cream. Deliberately small: ±5% of the
      // stack, well inside the band's padding, so it can never crowd the
      // sections either side of it.
      gsap.fromTo(
        stackRef.current,
        { yPercent: 5 },
        {
          yPercent: -5,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      );
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      // Opaque cream and above the hero: the hero is sticky for the whole page,
      // so a transparent band here would show it through the gap.
      className="relative z-20 overflow-hidden bg-cream py-16 lg:py-20"
    >
      <div ref={stackRef} className="flex flex-col items-center px-5">
        {/* Leads the lines in, then holds as the centre mark of the block. */}
        <div
          data-rule
          aria-hidden
          className="mb-9 h-px w-16 origin-center bg-gradient-gold lg:mb-12 lg:w-24"
        />

        {/* Redound sets the longest of these three clauses at 12.8em, so at
            4.6vw it runs to 59vw — centred, with room either side, and no
            width at which it can wrap. The clamp keeps it readable on a phone
            (where 4.6vw would be ~17px) and stops it turning into a billboard
            on a very wide display.

            `font-bold` on a face with only a Regular cut is a synthetic
            embolden by the browser, not a second file — see the redound
            comment in layout.tsx. */}
        <p className="text-center font-redound text-[clamp(1.35rem,4.6vw,5rem)]/[1.18] font-bold text-ink">
          {LINES.map((line) => (
            // The mask. Overflow-hidden on the wrapper is what turns the
            // inner translate into type rising out of nothing.
            <span key={line} className="block overflow-hidden">
              <span data-line className="block whitespace-nowrap">
                {line}
              </span>
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
