'use client';

import { useRef } from 'react';
import { gsap, SplitText, useGSAP } from '@/lib/gsap';
import { CtaPill } from '@/components/ui/cta-pill';
import { schedule } from '@/data/schedule';

/** Digits only — `tel:` will not dial through the spaces in the source data. */
const TEL = `tel:${schedule.phone.replace(/\s+/g, '')}`;

/**
 * The last thing on the home page: the ask, and two ways to answer it.
 *
 * Its own section rather than the shared ClosingCta, which carries one action.
 * This one has two, and they are deliberately not equals — booking is the
 * outcome the page is for, calling is for the reader who would rather not wait.
 */
export function FinalCta() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const title = rootRef.current?.querySelector<HTMLElement>('[data-title]');
      const items = gsap.utils.toArray<HTMLElement>(
        '[data-item]',
        rootRef.current,
      );

      const arrival = {
        trigger: rootRef.current,
        start: 'top 80%',
        once: true,
      } as const;

      if (title) {
        SplitText.create(title, {
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

      gsap.from(items, {
        y: 22,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.3,
        scrollTrigger: arrival,
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="book"
      // Opaque and above everything before it: the hero is sticky for the whole
      // page. The hairline separates it from the Partners section, which ends on
      // the same cream.
      className="relative z-20 overflow-hidden border-t border-ink/10 bg-cream py-20 text-ink lg:py-28"
    >
      {/* Warm bloom, the same device the other sections use. */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/4 size-[34rem] -translate-x-1/2 translate-y-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(201,153,40,0.14), transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8 lg:px-12 xl:px-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-center lg:gap-20">
          {/* ---------------- The ask ---------------- */}
          <div>
            <h2
              data-title
              className="max-w-[20ch] font-display text-display-md text-ink"
            >
              Ready to Discover Your Best Skin?
            </h2>

            <div
              data-item
              aria-hidden
              className="mt-7 h-px w-24 origin-left bg-gradient-gold"
            />

            <p
              data-item
              className="mt-8 max-w-xl font-body text-[0.98rem]/relaxed text-slate lg:text-base/relaxed"
            >
              Schedule a highly personalized consultation today &amp;
              experience the pinnacle of aesthetic dermatology. Let us craft a
              bespoke treatment plan exclusively for you.
            </p>
          </div>

          {/* ---------------- The two ways in ----------------
              An ink card so the actions read as the one thing on this cream
              field that is meant to be pressed. */}
          <div
            data-item
            className="rounded-3xl border border-cream/10 bg-ink p-7 text-cream lg:p-9"
          >
            <p className="font-body text-[0.68rem] tracking-[0.2em] text-gold uppercase">
              Take the First Step
            </p>

            <p className="mt-4 font-body text-[0.95rem]/relaxed text-cream/70">
              Our dedicated patient coordinators are ready to assist you right
              now.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <CtaPill href="/reach-me" label="Book Consultation" onDark />

              {/* Quieter by a border and no fill, so the two are not equals.
                  A `tel:` href, which CtaPill renders as a plain anchor —
                  routing it through the page transition would swallow it. */}
              <CtaPill
                href={TEL}
                label="Call Directly"
                onDark
                className="border-cream/15 bg-transparent"
              />
            </div>

            <p className="mt-6 font-body text-[0.8rem] text-cream/45">
              {schedule.phone} &middot; {schedule.workingDays[0]}&ndash;
              {schedule.workingDays[schedule.workingDays.length - 1]},{' '}
              {schedule.hours}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
