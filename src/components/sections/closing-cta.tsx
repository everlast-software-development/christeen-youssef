'use client';

import { useRef } from 'react';
import { gsap, SplitText, useGSAP } from '@/lib/gsap';
import { CtaPill } from '@/components/ui/cta-pill';

type ClosingCtaProps = {
  title: string;
  body: string;
  href: string;
  label: string;
};

/**
 * The closing beat of a page: a held line, a sentence, and the site's CTA.
 *
 * Its own component rather than markup in the page because the reveal has to
 * run on the client, and because every inner page wants the same ending — the
 * copy is passed in, the choreography is not.
 */
export function ClosingCta({ title, body, href, label }: ClosingCtaProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const heading = rootRef.current?.querySelector<HTMLElement>('[data-title]');
      const items = gsap.utils.toArray<HTMLElement>('[data-item]', rootRef.current);

      const arrival = {
        trigger: rootRef.current,
        start: 'top 82%',
        once: true,
      } as const;

      // Per-line mask reveal, the same device the sections on the home page
      // use, so a reader arriving here from there recognises it.
      if (heading) {
        SplitText.create(heading, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 120,
              duration: 1.2,
              stagger: 0.12,
              ease: 'power4.out',
              scrollTrigger: arrival,
            }),
        });
      }

      // The rule, the sentence and the pill follow the heading rather than
      // arriving with it, so the block reads top to bottom.
      gsap.from(items, {
        y: 20,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.35,
        scrollTrigger: arrival,
      });
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      className="mt-16 border-t border-ink/10 pt-16 text-center lg:mt-24 lg:pt-24"
    >
      <h2
        data-title
        className="mx-auto max-w-[26ch] font-display text-display-sm text-ink"
      >
        {title}
      </h2>

      <div
        data-item
        aria-hidden
        className="mx-auto mt-8 h-px w-16 origin-center bg-gradient-gold"
      />

      <p
        data-item
        className="mx-auto mt-8 max-w-lg font-body text-[0.95rem]/relaxed text-slate lg:text-base/relaxed"
      >
        {body}
      </p>

      {/* The pill sets its own hover state, so it is wrapped rather than
          given the data-item class directly — the reveal animates the wrapper
          and leaves the CTA's own transitions alone. */}
      <div data-item className="mt-10 flex justify-center">
        <CtaPill href={href} label={label} />
      </div>
    </div>
  );
}
