'use client';

import Image, { type StaticImageData } from 'next/image';
import { useRef } from 'react';
import { gsap, ScrollTrigger, SplitText, useGSAP } from '@/lib/gsap';

// Filenames are deliberately URL-safe. The image optimizer re-fetches the
// built asset by path, and an `&` in the filename truncates that request —
// the original "Acne & Acne Scarring.jpeg" served a 400 rather than a photo.
import introImage from '@/assets/Clinical Expertise & Treatments/dermatology-aesthetics-regenerative-medicine.jpeg';
import acneImage from '@/assets/Clinical Expertise & Treatments/acne-and-acne-scarring.jpeg';
import aestheticImage from '@/assets/Clinical Expertise & Treatments/aesthetic-dermatology.jpeg';
import eczemaImage from '@/assets/Clinical Expertise & Treatments/eczema-psoriasis-skin-conditions.jpeg';
import hairImage from '@/assets/Clinical Expertise & Treatments/hair-and-scalp-health.jpeg';
import rejuvenationImage from '@/assets/Clinical Expertise & Treatments/skin-rejuvenation-collagen-stimulation.jpeg';
import regenerativeImage from '@/assets/Clinical Expertise & Treatments/regenerative-medicine-tissue-repair.jpeg';
import allergyImage from '@/assets/Clinical Expertise & Treatments/allergy-and-clinical-dermatology.jpeg';

type Panel = {
  index: string;
  title: string;
  body: string;
  image: StaticImageData;
};

// Eight panels, all equal citizens — the opening one is numbered and behaves
// exactly like the rest, it just happens to lead. Every one carries its own
// photograph now, so the tonal-field fallback the earlier five used is gone
// along with the type flags that selected it.
const PANELS: Panel[] = [
  {
    index: '01',
    title: 'Dermatology, Aesthetics & Regenerative Medicine',
    body: 'A comprehensive approach to skin, hair, and aesthetic health — combining clinical expertise, advanced technologies, and evidence-based treatment protocols tailored to every patient.',
    image: introImage,
  },
  {
    index: '02',
    title: 'Acne & Acne Scarring',
    body: 'Personalized treatment plans for acne and post-acne scarring, combining medical therapies and advanced procedures to restore clearer, healthier-looking skin.',
    image: acneImage,
  },
  {
    index: '03',
    title: 'Aesthetic Dermatology',
    body: 'Enhance your natural features through carefully tailored treatments including injectables, skin resurfacing, chemical peels, laser procedures, and non-surgical facial rejuvenation.',
    image: aestheticImage,
  },
  {
    index: '04',
    title: 'Eczema, Psoriasis & Skin Conditions',
    body: 'Comprehensive diagnosis and individualized management of chronic inflammatory skin conditions, with a focus on effective treatment and long-term skin health.',
    image: eczemaImage,
  },
  {
    index: '05',
    title: 'Hair & Scalp Health',
    body: 'Advanced approaches to hair loss and scalp disorders, including regenerative treatments such as PRP, alongside evidence-based medical therapies and personalized treatment plans.',
    image: hairImage,
  },
  {
    index: '06',
    title: 'Skin Rejuvenation & Collagen Stimulation',
    body: 'Restore skin quality, texture, and radiance through advanced rejuvenation technologies designed to stimulate collagen, improve skin tone, and address signs of aging.',
    image: rejuvenationImage,
  },
  {
    index: '07',
    title: 'Regenerative Medicine & Tissue Repair',
    body: 'Exploring innovative regenerative approaches to skin and tissue healing, including advanced cell-based and biologically inspired therapies at the intersection of dermatology, research, and tissue bioengineering.',
    image: regenerativeImage,
  },
  {
    index: '08',
    title: 'Allergy & Clinical Dermatology',
    body: 'Accurate assessment and personalized management of allergic and dermatological conditions, combining clinical evaluation, targeted treatment, and long-term care strategies.',
    image: allergyImage,
  },
];

/**
 * Every panel is the same box, so the size lives in exactly one place.
 *
 * The lg height is capped rather than fixed: from lg up the whole stack —
 * header, track, progress rail — has to fit inside one pinned screen, and a
 * flat 72svh overflows that on laptop-height displays. 20rem is the room
 * reserved for everything that is not the panel — including the frame's own
 * top padding — so short viewports give the panel what is left instead of
 * pushing the rail off the bottom.
 */
const PANEL_BOX =
  'relative h-[64svh] w-[84vw] shrink-0 snap-center overflow-hidden rounded-2xl sm:h-[68svh] sm:w-[74vw] lg:h-[min(72svh,calc(100svh-20rem))] lg:w-[70vw] lg:max-w-[68rem] lg:snap-none';

export function ExpertiseSection() {
  const rootRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // ---- Header: per-line mask reveal, same device as the other sections ----
      // The trigger is the whole point here. Keyed to `top 65%` this fired
      // while the section was still two thirds of a screen below the fold and
      // had finished long before the header was worth looking at — which is why
      // the title read as having no animation at all. `top 25%` puts it just
      // before the section takes the screen and pins, so the reveal plays into
      // the moment the reader actually arrives.
      const title = rootRef.current?.querySelector<HTMLElement>('[data-title]');
      const titleRule =
        rootRef.current?.querySelector<HTMLElement>('[data-title-rule]');

      const headerTrigger = {
        trigger: rootRef.current,
        start: 'top 25%',
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
              duration: 1.4,
              stagger: 0.14,
              ease: 'power4.out',
              scrollTrigger: headerTrigger,
            }),
        });
      }

      if (titleRule) {
        // Starts once the first line of the title is most of the way up, so it
        // reads as the underline being drawn rather than a second event.
        gsap.from(titleRule, {
          scaleX: 0,
          duration: 1.3,
          delay: 0.45,
          ease: 'power3.inOut',
          scrollTrigger: headerTrigger,
        });
      }

      // ---- Desktop only: vertical scroll drives the track sideways ----
      // Pinning a horizontal rail on touch fights the native gesture, and
      // Lenis deliberately leaves touch scrolling alone (syncTouch: false), so
      // below lg the track is just an ordinary snap scroller and none of this
      // exists. matchMedia also re-runs the whole setup across the breakpoint,
      // which a plain width check at mount would not.
      const mm = gsap.matchMedia();

      mm.add('(min-width: 1024px)', () => {
        const track = trackRef.current;
        const viewport = viewportRef.current;
        if (!track || !viewport) return;

        // Measured, never assumed: the track is w-max, so its own width is the
        // full run of panels plus gutters. Read through a function so
        // invalidateOnRefresh can re-measure on resize instead of caching a
        // width from mount.
        const distance = () =>
          Math.max(0, track.offsetWidth - viewport.clientWidth);

        const horizontal = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top top',
            // Scroll distance equals travel distance, so the panels move at
            // the same rate as the page — no drift between the two axes.
            end: () => `+=${distance()}`,
            // The inner viewport, NOT `true` (which would pin the trigger).
            // Pinning wraps the element in a `.pin-spacer` div, so whatever is
            // pinned stops being a child of its React parent. With the section
            // pinned, <main>'s real first-level child became the spacer, and
            // React inserting any sibling before the section threw
            // "insertBefore: the node ... is not a child of this node".
            // Pinning one level in keeps that surgery inside the section, where
            // React owns nothing it has to reconcile against.
            pin: viewport,
            // Lenis has already smoothed the input; this is a light trailing
            // catch-up on top of it, which is what keeps a hard flick from
            // snapping the track. Anything heavier reads as lag.
            scrub: 0.6,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        horizontal
          .to(track, { x: () => -distance() }, 0)
          .to(railRef.current, { scaleX: 1 }, 0);

        // ---- Per-panel work, keyed to horizontal position ----
        // containerAnimation is what makes "when this panel reaches the middle
        // of the screen" mean anything on a sideways track: the triggers below
        // read progress along `horizontal` rather than page scroll.
        gsap.utils
          .toArray<HTMLElement>('[data-panel]', track)
          .forEach((panel, i) => {
            // A panel sitting inside the first screenful has no horizontal
            // arrival to wait for — it is already there when the section pins.
            // Keyed to the track it would fire at setup, invisibly, before the
            // reader ever got here; so those reveal on the section's own
            // vertical arrival instead, lightly staggered.
            const initiallyOnScreen = panel.offsetLeft < viewport.clientWidth;

            gsap.from(panel, {
              opacity: 0,
              // Was 0.94 with a 0.9s power3 — the snap at the end of that read
              // as abrupt. A longer travel on a gentler curve settles instead
              // of arriving.
              scale: 0.96,
              yPercent: 3,
              duration: 1.7,
              ease: 'power2.out',
              delay: initiallyOnScreen ? i * 0.12 : 0,
              scrollTrigger: initiallyOnScreen
                ? { trigger: rootRef.current, start: 'top 40%', once: true }
                : {
                    trigger: panel,
                    containerAnimation: horizontal,
                    // 'left right' is the earliest position there is: the
                    // instant the panel's leading edge crosses the right edge
                    // of the screen. At the old 'left 92%' it was already a
                    // tenth of the way in before anything started, which is
                    // what made it feel late.
                    start: 'left right',
                    once: true,
                  },
            });

            // Slow counter-drift on the artwork as its panel crosses the
            // screen. The frame is 120% wide (see [data-parallax]) so ±8% of
            // travel never exposes an edge.
            const parallax =
              panel.querySelector<HTMLElement>('[data-parallax]');

            if (parallax) {
              gsap.fromTo(
                parallax,
                { xPercent: -8 },
                {
                  xPercent: 8,
                  ease: 'none',
                  scrollTrigger: {
                    trigger: panel,
                    containerAnimation: horizontal,
                    start: 'left right',
                    end: 'right left',
                    scrub: true,
                  },
                },
              );
            }
          });

        // The pin adds a spacer worth several screens, which every trigger
        // below this section has to be re-measured against.
        ScrollTrigger.refresh();
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="expertise"
      // Opaque and above everything before it: the hero is sticky for the whole
      // page and this section is pinned over it.
      className="relative z-20 bg-cream text-ink"
    >
      {/* Warm bloom, the same device the other three sections use — kept faint
          so the field still reads as flat cream. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 size-[42rem] -translate-x-1/3 -translate-y-1/3 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(201,153,40,0.12), transparent 70%)',
        }}
      />

      {/* Exactly one screen tall once pinned, so the track, the header above it
          and the rail below all share the same held frame. Below lg it is an
          ordinary padded block and the height never applies.

          The frame itself stays full-bleed so the track can run off both edges
          of the screen, which a centred measure would stop it doing on wide
          displays. The header and rail take the measure instead — see below.

          The top padding sits inside that one screen (border-box), so it nudges
          the centred stack down off the top edge without making the section any
          taller than the viewport. PANEL_BOX reserves room for it. */}
      <div
        ref={viewportRef}
        className="relative flex flex-col justify-center py-20 lg:h-svh lg:pt-8 lg:pb-0"
      >
        {/* ---------------- Header ----------------
            Same measure and padding as the Principles section, so the two
            headings start on one line down the page rather than this one
            hanging out at the screen edge. The track below keeps its own
            full-bleed measure — only the type is constrained. */}
        <header className="mx-auto mb-10 w-full max-w-7xl px-5 md:px-8 lg:mb-12 lg:px-12 xl:px-20">
          <h2
            data-title
            className="max-w-[24ch] font-display text-display-md text-ink"
          >
            Clinical Expertise &amp; Treatments
          </h2>

          {/* Draws itself out under the title as part of the same reveal, so
              the header arrives as a movement rather than a static block. */}
          <div
            data-title-rule
            aria-hidden
            className="mt-7 h-px w-24 origin-left bg-gradient-gold"
          />
        </header>

        {/* ---------------- The track ----------------
            overflow-x-auto below lg is the real scroller, with snap points.
            At lg it is clipped instead and GSAP translates the track inside it.
            The native scrollbar is hidden to match the rest of the page, where
            the gold rail is the scroll indicator. */}
        <div className="overflow-x-auto [scrollbar-width:none] lg:overflow-hidden [&::-webkit-scrollbar]:hidden">
          <div
            ref={trackRef}
            // w-max, not a percentage: the track has to be as wide as its own
            // content for the distance measurement above to mean anything.
            className="flex w-max snap-x snap-mandatory gap-4 px-5 md:gap-6 md:px-8 lg:snap-none lg:gap-8 lg:px-12 xl:px-20"
          >
            {PANELS.map((panel, i) => (
              <article
                key={panel.index}
                data-panel
                // Focusable so the hover-revealed copy is reachable from the
                // keyboard too; the copy stays in the DOM either way, so
                // screen readers never depend on the interaction.
                tabIndex={0}
                className={`group ${PANEL_BOX} outline-none`}
              >
                <div data-parallax className="absolute inset-y-0 -inset-x-[10%]">
                  <Image
                    src={panel.image}
                    alt=""
                    fill
                    placeholder="blur"
                    // The first two panels are on screen the moment the section
                    // pins, so they are the ones worth fetching early; the rest
                    // are off to the right and lazy-load as the track travels.
                    loading={i < 2 ? 'eager' : 'lazy'}
                    sizes="(min-width: 1024px) 70vw, 84vw"
                    className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05] group-focus-visible:scale-[1.05]"
                  />
                </div>

                {/* Two overlays, not one. The base keeps the title legible
                    against any photograph; the second deepens on hover so the
                    revealed paragraph has a field to sit on. */}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/45 to-ink/10"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-ink/45 opacity-0 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-focus-visible:opacity-100"
                />

                {/* Hairline frame, warming to gold on hover. */}
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-2xl ring-1 ring-cream/10 ring-inset transition-colors duration-700 group-hover:ring-gold/30"
                />

                <div className="absolute inset-0 flex flex-col justify-end p-7 sm:p-9 lg:p-12">
                  <p
                    className="font-body text-[0.78rem] tabular-nums tracking-[0.2em] text-gold"
                    aria-hidden
                  >
                    {panel.index}
                  </p>

                  <h3 className="mt-4 max-w-[20ch] font-display text-display-sm text-cream">
                    {panel.title}
                  </h3>

                  {/* The reveal. 0fr→1fr interpolates the row itself, so the
                      paragraph pushes nothing around and needs no measured
                      max-height to animate against. Collapsed only from lg
                      up: without hover there is nothing to open it, so on
                      touch the copy is simply always there. */}
                  <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:grid-rows-[0fr] lg:group-hover:grid-rows-[1fr] lg:group-focus-visible:grid-rows-[1fr]">
                    <div className="overflow-hidden">
                      <p className="max-w-md pt-5 font-body text-[0.9rem]/relaxed text-cream/75 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-focus-visible:translate-y-0 lg:group-focus-visible:opacity-100">
                        {panel.body}
                      </p>
                    </div>
                  </div>

                  {/* Draws itself out under the copy as the panel opens. */}
                  <span
                    aria-hidden
                    className="mt-7 h-px w-16 origin-left scale-x-100 bg-gradient-gold transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:scale-x-0 lg:group-hover:scale-x-100 lg:group-focus-visible:scale-x-100"
                  />
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* ---------------- Progress ----------------
            Driven from the same timeline as the track, so it can never
            disagree with where the panels actually are. Hidden below lg, where
            the native scroller has its own momentum to read — and where there
            is no hover to advertise either. */}
        <div className="mx-auto mt-10 hidden w-full max-w-7xl items-center gap-6 px-5 md:px-8 lg:mt-12 lg:flex lg:px-12 xl:px-20">
          <div className="h-px w-full max-w-xs bg-ink/12">
            <div
              ref={railRef}
              className="h-full w-full origin-left scale-x-0 bg-gradient-gold"
            />
          </div>

          {/* The lead panel used to carry this hint in its body copy; that copy
              is the section's own standfirst now, so the affordance moves here
              rather than disappearing. */}
          <p className="font-body text-[0.68rem] tracking-[0.18em] text-slate/70 uppercase">
            Hover a panel for detail
          </p>
        </div>
      </div>
    </section>
  );
}
