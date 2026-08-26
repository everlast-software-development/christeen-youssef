'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { gsap, SplitText, useGSAP } from '@/lib/gsap';

const PRINCIPLES = [
  {
    index: '01',
    name: 'Personalized Excellence',
    statement: 'Your skin. Your goals. Your journey.',
    body: 'Thoughtfully designed treatment plans built around your unique anatomy, skin condition, lifestyle, and desired outcomes.',
  },
  {
    index: '02',
    name: 'Science-Driven Medicine',
    statement: 'Innovation backed by evidence.',
    body: 'Advanced aesthetic and dermatological approaches guided by scientific research, clinical expertise, and a commitment to patient safety.',
  },
  {
    index: '03',
    name: 'Regeneration & Innovation',
    statement: 'Beyond aesthetics.',
    body: 'Integrating emerging concepts in regenerative medicine and tissue bioengineering with modern dermatological care to explore the future of healing and rejuvenation.',
  },
];

export function PrinciplesSection() {
  const rootRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Lenis drives real window scroll, so Motion's useScroll reads it without a
  // bridge. Scoped via `target`, which also means it needs no resize bookkeeping
  // of its own — unlike the global ScrollProgress bar, which reads from Lenis
  // directly because it has to survive route swaps.
  //
  // Measured against the list rather than the section: the section now starts a
  // screen early so About can travel off it, and a rail keyed to the section
  // would already read ~40% full the moment it was uncovered.
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start center', 'end center'],
  });

  // A light spring only. Lenis has already smoothed the input; anything heavier
  // here would visibly lag the rail behind the copy it is measuring.
  const rail = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  useGSAP(
    () => {
      // ---- Sticky title: per-line mask reveal ----
      // autoSplit re-splits once the webfont resolves; splitting against
      // fallback metrics would break the lines in the wrong places.
      const title = rootRef.current?.querySelector<HTMLElement>('[data-title]');

      if (title) {
        SplitText.create(title, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 120,
              duration: 1.1,
              stagger: 0.11,
              ease: 'power4.out',
              // Keyed to the reveal stage, not the title. The title is
              // sticky and pins a full screen before it is uncovered, so its
              // own position would fire this behind the ink panel.
              scrollTrigger: {
                trigger: '[data-stage]',
                start: 'bottom 60%',
                once: true,
              },
            }),
        });
      }

      // ---- Principles: each block reveals on its own arrival ----
      // Not one shared trigger with a long stagger: the blocks are a full
      // viewport apart, so a single timeline would run the third one out of
      // sight while the reader is still on the first.
      gsap.utils
        .toArray<HTMLElement>('[data-principle]', rootRef.current)
        .forEach((block) => {
          const rule = block.querySelector<HTMLElement>('[data-rule]');
          const statement =
            block.querySelector<HTMLElement>('[data-statement]');
          const items = gsap.utils.toArray<HTMLElement>('[data-item]', block);

          const tl = gsap.timeline({
            scrollTrigger: { trigger: block, start: 'top 78%', once: true },
          });

          // The hairline draws itself in before anything above it arrives,
          // so each principle reads as a new entry being ruled off.
          if (rule) {
            tl.from(
              rule,
              { scaleX: 0, duration: 1.1, ease: 'power3.inOut' },
              0,
            );
          }

          tl.from(items, { y: 22, opacity: 0, stagger: 0.08 }, 0.12);

          if (statement) {
            SplitText.create(statement, {
              type: 'lines',
              mask: 'lines',
              autoSplit: true,
              onSplit: (self) =>
                gsap.from(self.lines, {
                  yPercent: 115,
                  duration: 1,
                  stagger: 0.09,
                  ease: 'power4.out',
                  scrollTrigger: {
                    trigger: block,
                    start: 'top 78%',
                    once: true,
                  },
                }),
            });
          }
        });
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="approach"
      // Two stacking relationships at once. Above the hero, which is sticky
      // inside <main> and stays pinned the whole way down — so this has to
      // paint over it. Below About (z-20), which travels up and off this
      // section to uncover it.
      //
      // The negative margin is what makes that possible: it starts this
      // section one screen before About's box ends, so the two share that much
      // scroll. The sticky title below pins inside the overlap, holding still
      // while the ink panel slides away over it.
      className="relative z-10 overflow-x-clip bg-cream text-ink lg:-mt-[100svh]"
    >
      {/* Spans exactly the overlap, so its bottom edge tracks About's bottom
          edge — the ink line sweeping up the screen. Collapsed to nothing below
          lg, where the sections simply stack and there is no reveal. */}
      <div
        data-stage
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-0 lg:h-[100svh]"
      />

      {/* Warm bloom, same device as the other two sections, kept faint so the
          field still reads as flat cream rather than a gradient. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 size-[38rem] translate-x-1/3 -translate-y-1/3 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(201,153,40,0.10), transparent 70%)',
        }}
      />

      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 lg:px-12 lg:py-0 xl:px-20">
        <div className="lg:grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16 xl:gap-24">
          {/* ---------------- Left: the title, held ---------------- */}
          <div className="lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col lg:justify-center">
            <h2
              data-title
              className="font-display text-display-lg text-ink lg:max-w-[10ch]"
            >
              The Art &amp; Science of Advanced Care
            </h2>

            {/* Reads the section's own scroll rather than the page's, so it
                tracks the principles beside it and nothing else — and nothing
                outside this section. It is deliberately self-contained: it
                lives in a sticky, vertically-centred column, so it travels
                with that column as you scroll and its endpoints are never in a
                fixed place on the page. Anything downstream trying to meet it
                had to chase a moving target, which is why the attempts to run
                it on into Expertise never lined up. */}
            <div
              aria-hidden
              className="mt-10 hidden h-40 w-px bg-ink/12 lg:block"
            >
              <motion.div
                style={{ scaleY: rail }}
                className="h-full w-full origin-top bg-gradient-gold"
              />
            </div>
          </div>

          {/* ---------------- Right: the principles, scrolling ---------------- */}
          {/* The extra 100svh of lead is the overlap: without it the first
              principle would sit behind the ink panel during the reveal. What
              is left past it is the same 28svh of breathing room as before. */}
          <div className="mt-16 lg:mt-0 lg:pt-[128svh] lg:pb-[28svh]">
            <div ref={listRef}>
              {PRINCIPLES.map((principle) => (
                <article
                  key={principle.index}
                  data-principle
                  className="py-14 lg:py-[14svh]"
                >
                  <div
                    data-rule
                    className="h-px w-full origin-left bg-ink/15"
                    aria-hidden
                  />

                  <p
                    data-item
                    className="mt-8 font-body text-[0.8rem] tabular-nums tracking-[0.2em] text-gold-dark"
                    aria-hidden
                  >
                    {principle.index}
                  </p>

                  <h3
                    data-item
                    className="mt-4 font-body text-[0.72rem] tracking-[0.24em] text-slate uppercase sm:text-[0.78rem]"
                  >
                    {principle.name}
                  </h3>

                  <p
                    data-statement
                    // 16ch is an editorial measure for a short statement beside the other
                    // column; in a single mobile column it just makes the line
                    // narrow, so the cap starts at sm.
                    className="mt-6 font-display text-display-sm text-ink sm:max-w-[16ch]"
                  >
                    {principle.statement}
                  </p>

                  <p
                    data-item
                    className="mt-6 max-w-md font-body text-[0.95rem]/relaxed text-slate lg:text-base/relaxed"
                  >
                    {principle.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
