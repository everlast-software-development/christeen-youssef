'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import portrait from '@/assets/about-me.jpeg';

const INTRO = [
  'With over 12 years of dedicated practice in aesthetic medicine, Dr. Christeen Youssef has established herself as a leading authority in non-surgical facial rejuvenation. Her approach combines artistic precision with evidence-based clinical expertise to deliver natural, harmonious results.',
  'A graduate of prestigious international institutions including Harvard Medical School and the American Academy of Aesthetic Medicine, she brings world-class training to every consultation. Her commitment to advancing the field is reflected in her peer-reviewed publications and regular presentations at global dermatology conferences.',
];

const EXPERTISE = [
  'Advanced Injectables',
  'Facial Harmonization',
  'Laser Resurfacing',
  'Scar Revision',
  'Medical Dermatology',
  'Skin Rejuvenation',
];

const METRICS = [
  { value: '12+', label: 'Years Experience' },
  { value: '5000+', label: 'Procedures' },
  { value: '15+', label: 'Publications' },
];

const STEP_COUNT = 3;

// Shared by all three panels: ordinary stacked blocks on small screens, exactly
// overlaid inside the pinned frame from lg up so they can cross-fade in place.
const STEP_CLASS =
  'relative px-5 py-20 md:px-8 lg:absolute lg:inset-0 lg:flex lg:items-center lg:px-12 lg:py-0 xl:px-20';

export function AboutSection() {
  const rootRef = useRef<HTMLElement>(null);
  const runwayRef = useRef<HTMLDivElement>(null);
  const swapRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // From lg up the panels are stacked in one pinned frame and cross-fade.
      // Everything below is a pure function of one scroll-derived number, so
      // there is no second, clock-driven animation to fall out of step with it
      // when the scroll speed changes.
      mm.add('(min-width: 1024px)', () => {
        const steps = gsap.utils.toArray<HTMLElement>(
          '[data-step]',
          rootRef.current,
        );
        const dots = gsap.utils.toArray<HTMLElement>(
          '[data-dot]',
          rootRef.current,
        );
        if (steps.length < 2) return;

        const items = steps.map((step) =>
          gsap.utils.toArray<HTMLElement>('[data-item]', step),
        );
        const zoom =
          rootRef.current?.querySelector<HTMLElement>('[data-zoom]') ?? null;

        const last = steps.length - 1;

        // Panels swap rather than cross-fade. Text is the reason: two blocks of
        // copy at 50% on top of each other is unreadable mush. The outgoing
        // panel plays its exit out in full across the first 45% of the tween,
        // both sit empty for a beat at the midpoint, then the incoming panel
        // plays its entrance across the last 45%. One is always finished
        // before the other starts.
        //
        // SWAP is deliberately just under 0.5. Any lower wastes the middle of
        // the tween on dead air; at 0.5 exactly the handoff has no beat at all.
        const HOLD = 0;
        const SWAP = 0.45;
        const smoothstep = (t: number) => t * t * (3 - 2 * t);

        const phase = (d: number) =>
          smoothstep(
            gsap.utils.clamp(0, 1, (Math.abs(d) - HOLD) / (SWAP - HOLD)),
          );

        // Item travel is keyed to the same phase, so items sit perfectly still
        // while their panel is being read and only move during the swap.
        const shift = (d: number) => (d < 0 ? -1 : 1) * phase(d);

        // Scroll no longer drives the panels frame by frame. It only picks a
        // destination; a real tween walks there and cannot be interrupted. That
        // is what makes the swap unglitchable — there is no partial state for a
        // scroll reversal to strand it in.
        const state = { pos: 0 };
        let stop = 0;
        let animating = false;
        let target = 0;
        let primed = false;
        let tween: gsap.core.Tween | null = null;

        const render = () => {
          steps.forEach((step, i) => {
            const d = state.pos - i;
            const o = 1 - phase(d);
            const sh = shift(d);

            step.style.opacity = String(o);
            // Faded panels are still stacked over the visible one and would
            // otherwise swallow its clicks.
            step.style.pointerEvents = o > 0.6 ? 'auto' : 'none';

            items[i].forEach((item, j) => {
              item.style.transform = `translate3d(0, ${sh * -(46 + j * 14)}px, 0)`;
            });
          });

          dots.forEach((dot, i) => {
            const on = Math.abs(state.pos - i) < 0.5;
            dot.style.opacity = on ? '1' : '0.3';
            dot.style.transform = `scaleX(${on ? 1 : 0.35})`;
          });
        };

        // One panel at a time, always played out in full. If the scroll ran
        // further while this was busy, onComplete picks the next one up, so a
        // fast flick becomes a queue of whole swaps instead of a scrub through
        // half-finished ones.
        const advance = () => {
          if (animating) return;
          const wanted = gsap.utils.clamp(0, last, Math.round(target));
          if (wanted === stop) return;

          const dest = stop + (wanted > stop ? 1 : -1);
          animating = true;
          tween = gsap.to(state, {
            pos: dest,
            duration: 1,
            // Linear on purpose: phase() already applies the smoothstep, and
            // easing the tween as well would double up and rush the handoff
            // through the exact middle where the two panels trade places.
            ease: 'none',
            onUpdate: render,
            onComplete: () => {
              stop = dest;
              animating = false;
              advance();
            },
          });
        };

        steps.forEach((step, i) => {
          step.style.willChange = 'opacity';
          items[i].forEach((item) => {
            item.style.willChange = 'transform';
          });
        });
        if (zoom) zoom.style.willChange = 'transform';

        // Continuous parallax, deliberately not part of the discrete swap — it
        // reads off raw scroll, which Lenis has already smoothed, so it never
        // waits on a panel.
        //
        // A scrubbed tween rather than a write inside onUpdate below. onUpdate
        // only fires *within* the range, so the image sat at its natural size
        // while the section scrolled into view and then snapped to 1.14 the
        // instant the runway started. ScrollTrigger holds a scrubbed tween at
        // progress 0 before its range and at 1 after, so the scale is correct
        // at every scroll position and there is no boundary to pop across.
        //
        // It also stops at 1.02, never 1. At exactly 1 the image matches its
        // frame edge for edge, and sub-pixel rounding on a promoted layer
        // leaves a flickering hairline of background down the seam — which is
        // what showed at the very end of the runway. 1.02 keeps it bled past.
        if (zoom) {
          gsap.fromTo(
            zoom,
            { scale: 1.14 },
            {
              scale: 1.02,
              ease: 'none',
              scrollTrigger: {
                trigger: runwayRef.current,
                start: 'top top',
                end: 'bottom bottom',
                scrub: true,
              },
            },
          );
        }

        // Keyed to the swap zone rather than the whole runway. The runway now
        // carries a held screen at each end — the frame is pinned but nothing
        // is changing — and mapping the swaps across all of it would spread
        // them into that padding instead of leaving it still.
        ScrollTrigger.create({
          trigger: swapRef.current,
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: ({ progress }) => {
            target = progress * last;

            // A reload partway down the runway lands on a panel rather than
            // animating through everything above it.
            if (!primed) {
              primed = true;
              stop = gsap.utils.clamp(0, last, Math.round(target));
              state.pos = stop;
              render();
            }

            advance();
          },
        });

        render();

        return () => {
          tween?.kill();
          // matchMedia reverts the parallax tween itself; these are the plain
          // inline writes it knows nothing about.
          steps.forEach((step, i) => {
            step.style.removeProperty('opacity');
            step.style.removeProperty('pointer-events');
            step.style.removeProperty('will-change');
            items[i].forEach((item) => {
              item.style.removeProperty('transform');
              item.style.removeProperty('will-change');
            });
          });
          if (zoom) {
            zoom.style.removeProperty('transform');
            zoom.style.removeProperty('will-change');
          }
        };
      });

      // Below lg the panels are ordinary stacked blocks, so each reveals on its
      // own as it arrives. Nothing is cross-fading, so a plain timed stagger
      // has nothing to fight with here.
      mm.add('(max-width: 1023.98px)', () => {
        gsap.utils
          .toArray<HTMLElement>('[data-step]', rootRef.current)
          .forEach((step) => {
            const plain = gsap.utils
              .toArray<HTMLElement>('[data-item]', step)
              .filter((el) => !el.querySelector('[data-reveal]'));

            if (!plain.length) return;

            gsap.from(plain, {
              y: 30,
              opacity: 0,
              duration: 0.8,
              stagger: 0.07,
              ease: 'power3.out',
              scrollTrigger: { trigger: step, start: 'top 80%' },
            });
          });
      });

      // The opening panel's copy rises into place and settles up to full size,
      // one line after the next. Deliberately outside matchMedia: it reads the
      // same at every breakpoint, and neither branch owns the spans it targets.
      //
      // Every target is an inner span, never the [data-item] wrapper, because
      // render() rewrites those elements' transforms on every frame of a panel
      // swap and would wipe these tweens out halfway through.
      const reveals = gsap.utils.toArray<HTMLElement>(
        '[data-reveal]',
        rootRef.current,
      );

      if (reveals.length) {
        gsap.from(reveals, {
          // Absolute pixels, not yPercent — these elements run from a 1px rule
          // to a three-line paragraph, and a percentage would move the divider
          // by a third of a pixel while throwing the copy half a line.
          y: 28,
          scale: 0.94,
          opacity: 0,
          duration: 1.1,
          ease: 'power3.out',
          stagger: 0.09,
          // Triggered off the first line, not the section: the panel is centred
          // in a full-height frame, so the section's top crosses the viewport
          // long before this text is anywhere near visible.
          scrollTrigger: { trigger: reveals[0], start: 'top 88%', once: true },
        });
      }

      // The photo gets its own trigger rather than joining the stagger above:
      // below lg it is order-first, so it sits above the copy and has to reveal
      // on its own arrival, not on the headline's.
      const photo =
        rootRef.current?.querySelector<HTMLElement>('[data-photo]') ?? null;

      if (photo) {
        gsap.from(photo, {
          y: 24,
          // Settles down to full size instead of growing into it. The layer
          // fills an overflow-hidden frame edge to edge, so approaching from
          // under 1 would show ink around the photo for the whole tween;
          // starting over 1 keeps it bled past the frame the entire way.
          scale: 1.08,
          opacity: 0,
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: { trigger: photo, start: 'top 90%', once: true },
        });
      }

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    // z-20, above the cream section that follows: About is the traveller here.
    // It covers the hero on the way in, then slides up and off the principles
    // on the way out, which sit pinned beneath it at z-10.
    <section
      ref={rootRef}
      id="about"
      // Tells the fixed header to invert while this panel is under it.
      data-header-surface="dark"
      className="relative z-20 bg-ink"
    >
      {/* The runway is what the pinned frame scrubs against: roughly one
          viewport of scroll per panel. On mobile it collapses to nothing and
          the panels simply stack. */}
      <div ref={runwayRef}>
        <div className="flex flex-col overflow-hidden lg:sticky lg:top-0 lg:h-svh lg:flex-row">
          {/* ---------------- Left: cross-fading panels ---------------- */}
          <div className="relative flex-1 lg:min-w-0">
            {/* Warm bloom so the ink field has a centre of gravity */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-40 left-1/3 size-[42rem] -translate-x-1/2 rounded-full opacity-50 blur-3xl"
              style={{
                background:
                  'radial-gradient(circle, rgba(232,200,106,0.14), transparent 70%)',
              }}
            />

            {/* -------- 01 · Who she is -------- */}
            <div data-step className={STEP_CLASS}>
              <div className="mx-auto w-full max-w-xl">
                <h2
                  data-item
                  className="font-display text-display-md text-cream"
                >
                  {/* The reveal rides this span, not the [data-item] h2 above
                      it — see the tween for why. `block` is load-bearing:
                      transforms do not apply to a non-replaced inline box. */}
                  <span data-reveal className="block origin-bottom">
                    Dr. Christeen Youssef
                  </span>
                </h2>

                <p
                  data-item
                  className="mt-5 font-body text-[0.72rem] tracking-[0.24em] text-gold uppercase sm:text-[0.8rem]"
                >
                  <span data-reveal className="block origin-bottom">
                    Aesthetic Dermatologist &amp; Medical Consultant
                  </span>
                </p>

                <div data-item className="mt-8">
                  <div
                    data-reveal
                    className="h-px w-24 origin-bottom bg-gradient-gold opacity-70"
                  />
                </div>

                {INTRO.map((text) => (
                  <p
                    key={text.slice(0, 32)}
                    data-item
                    className="mt-6 font-body text-[0.95rem]/relaxed text-cream/70 lg:text-base/relaxed"
                  >
                    <span data-reveal className="block origin-bottom">
                      {text}
                    </span>
                  </p>
                ))}
              </div>
            </div>

            {/* -------- 02 · What she does -------- */}
            <div data-step className={STEP_CLASS}>
              <div className="mx-auto w-full max-w-xl">
                <h3
                  data-item
                  className="font-display text-display-sm text-cream"
                >
                  Areas of Expertise
                </h3>

                <div
                  data-item
                  className="mt-8 h-px w-24 bg-gradient-gold opacity-70"
                />

                <ul className="mt-10 grid grid-cols-1 gap-x-10 sm:grid-cols-2">
                  {EXPERTISE.map((item, i) => (
                    <li
                      key={item}
                      data-item
                      className="flex items-baseline gap-4 border-t border-cream/12 py-4"
                    >
                      <span className="font-body text-[0.7rem] tabular-nums text-gold">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="font-body text-[0.95rem] text-cream/85">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* -------- 03 · Where she does it -------- */}
            <div data-step className={STEP_CLASS}>
              <div className="mx-auto w-full max-w-xl">
                <div
                  data-item
                  className="h-px w-24 bg-gradient-gold opacity-70"
                />

                <p
                  data-item
                  className="mt-8 font-display text-xl/relaxed text-cream/90 lg:text-2xl/relaxed"
                >
                  At Everlast Wellness Medical Center in Abu Dhabi, Dr. Youssef
                  leads a patient-centered practice built on trust, education,
                  and uncompromising safety standards.
                </p>

                <p
                  data-item
                  className="mt-6 font-body text-[0.95rem]/relaxed text-cream/65 lg:text-base/relaxed"
                >
                  Every treatment plan is uniquely crafted to honor individual
                  facial anatomy and aesthetic goals.
                </p>

                <dl className="mt-12 grid grid-cols-3">
                  {METRICS.map((metric, i) => (
                    <div
                      key={metric.label}
                      data-item
                      className={
                        i > 0 ? 'border-l border-cream/12 pl-5' : 'pr-5'
                      }
                    >
                      <dt className="sr-only">{metric.label}</dt>
                      <dd>
                        <span className="block font-display text-3xl leading-none text-gold lg:text-4xl">
                          {metric.value}
                        </span>
                        <span className="mt-2 block font-body text-[0.7rem] tracking-[0.14em] text-cream/55 uppercase">
                          {metric.label}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* -------- Which panel you are on -------- */}
            <div
              aria-hidden
              className="absolute bottom-10 left-12 hidden gap-2 lg:flex xl:left-20"
            >
              {Array.from({ length: STEP_COUNT }, (_, i) => (
                <span
                  key={i}
                  data-dot
                  className="h-px w-10 origin-left bg-gradient-gold opacity-30"
                />
              ))}
            </div>
          </div>

          {/* ---------------- Right: the photo, pinned ----------------
              The old mount-time fade never read on desktop: the section sits
              below the fold, so it had finished long before anyone scrolled
              here. It is scroll-driven now, like the copy beside it. */}
          <div className="relative order-first h-[55svh] w-full shrink-0 overflow-hidden lg:order-none lg:h-svh lg:w-[35%]">
            {/* The reveal needs its own layer. The <Image> below already
                carries the parallax transform that ScrollTrigger rewrites each
                frame, so animating it here would be overwritten instantly. */}
            <div data-photo className="absolute inset-0">
              <Image
                data-zoom
                src={portrait}
                alt="Dr. Christeen Youssef"
                fill
                placeholder="blur"
                sizes="(min-width: 1024px) 35vw, 100vw"
                className="object-cover will-change-transform"
              />
            </div>

            {/* Feathers only the seam where the photo meets the ink column.
                Outside [data-photo] on purpose — it is tied to the container
                edge and must not travel with the reveal. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-[18%] bg-gradient-to-r from-ink/75 to-transparent"
            />
          </div>
        </div>

        {/* ------ Scroll-only zones. No content, pure runway. ------
            The frame above is h-svh and sticky, so it occupies the first
            screen of this container in flow and then pins for the rest of it.
            That makes the arithmetic below entirely positional:

              frame     100svh  in flow, pinned from the top of the runway
              swap      220svh  panels trade places over the middle 120svh
              hold       60svh  pinned, holding the last panel before release

            What the swap zone actually costs is its height minus one screen,
            because the trigger runs `top top` → `bottom bottom`: 220 - 100 =
            120svh for two handovers, so roughly 60svh of scroll per panel. It
            was 400svh, which worked out at 150svh a panel — a screen and a half
            of scrolling to change one line of copy, which is what made the
            section feel stuck.

            Nothing else needs adjusting to match. The swap progress is mapped
            straight onto the panel index (`target = progress * last`), so it is
            proportional to this height and nothing downstream carries a pixel
            figure of its own. The one thing not on this scale is the handover
            tween, which is a fixed 1s and deliberately always plays in full —
            scroll faster than that and swaps queue rather than half-render.

            The swap zone starts one screen down, which is what gives the
            opening panel a full screen of held scroll before anything moves —
            the padding at the top. The hold gives a shorter beat at the bottom.
            The container is deliberately not given a height: it is the sum of
            these three, and stating it again would be a second source of truth
            to drift. */}
        <div
          ref={swapRef}
          aria-hidden
          className="hidden lg:block lg:h-[220svh]"
        />
        <div aria-hidden className="hidden lg:block lg:h-[60svh]" />
      </div>
    </section>
  );
}
