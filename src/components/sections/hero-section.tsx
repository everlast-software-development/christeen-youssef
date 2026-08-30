"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { TransitionLink } from "@/components/ui/transition-link";
import { CountUp } from "@/components/ui/count-up";
import { EventSpotlight } from "@/components/ui/event-spotlight";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { stats } from "@/data/stats";
import portrait from "@/assets/hero-portrait.webp";

const EASE = [0.22, 1, 0.36, 1] as const;

const rise = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

export function HeroSection() {
  const nameRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Per-character upward reveal. `mask: 'chars'` wraps each glyph in its own
  // clipping box, so a letter slides up out of nothing rather than fading.
  // autoSplit re-splits (and re-runs this) once the webfont resolves, which
  // matters because splitting against fallback metrics misplaces every letter.
  useGSAP(
    () => {
      const lines = gsap.utils.toArray<HTMLElement>("[data-line]");
      if (!lines.length) return;

      lines.forEach((line, i) => {
        SplitText.create(line, {
          type: "chars",
          mask: "chars",
          charsClass: "hero-char",
          autoSplit: true,
          onSplit: (self) => {
            const chars = self.chars as HTMLElement[];
            const lineBox = line.getBoundingClientRect();

            // The line ships at opacity 0 so the un-split text — which paints in
            // the flat `text-gold-dark` fallback until .hero-char takes over —
            // never flashes. By the time we reveal it, every glyph is already
            // wearing the gradient and parked out of sight below its mask.
            gsap.set(line, { opacity: 1 });

            // Each character clips its own gradient, so left alone every letter
            // would shimmer identically. Sizing the gradient to the line and
            // offsetting each character by its own x makes the band continuous
            // across the word.
            const bandWidth = lineBox.width * 2.4;
            line.style.setProperty("--word-w", `${bandWidth}px`);
            line.style.setProperty("--shimmer", `${-bandWidth}px`);

            chars.forEach((char) => {
              const x = char.getBoundingClientRect().left - lineBox.left;
              char.style.setProperty("--char-x", `${x}px`);
            });

            const tl = gsap.timeline();

            tl.from(chars, {
              yPercent: 115,
              opacity: 0,
              duration: 1.15,
              ease: "power4.out",
              stagger: 0.045,
              delay: 0.25 + i * 0.32,
            });

            // Sweep the light band across, then hold before repeating.
            const sweep = { x: -bandWidth };
            tl.to(
              sweep,
              {
                x: lineBox.width,
                duration: 2.4,
                ease: "none",
                repeat: -1,
                repeatDelay: 3.6,
                onUpdate: () =>
                  line.style.setProperty("--shimmer", `${sweep.x}px`),
              },
              "+=0.35",
            );

            return tl;
          },
        });
      });
    },
    { scope: nameRef },
  );

  // Dissolve the hero as About rises over it, scrubbed against the exact window
  // in which it is being covered.
  useGSAP(
    () => {
      // Triggered off About rather than the hero itself. The hero is sticky, so
      // any ScrollTrigger.refresh() at a non-zero scroll — a resize, an image
      // settling — would measure its stuck rect (top: 0) and place the range at
      // the wrong scroll offset. About is in normal flow and always measures true.
      const cover = document.querySelector<HTMLElement>("#about");
      if (!cover) return;

      // lg and up only. Below that the hero is not sticky and About does not
      // ride over it — it simply scrolls past, so fading it out would dissolve
      // a hero that is still half on screen.
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
      gsap.to("[data-hero-fade]", {
        opacity: 0,
        // Linear: the scroll position is the timeline here, and Lenis has
        // already smoothed it. An ease on top would double up.
        ease: "none",
        scrollTrigger: {
          trigger: cover,
          start: "top bottom",
          // Finished a little before full cover, so the hero is gone rather
          // than still visibly fading underneath the ink edge.
          end: "top 20%",
          scrub: true,
        },
      });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      // Below lg every layer below is in normal flow, so the section is a
      // column that grows to fit: stacked, the hero's own content needs about
      // 860px, and forcing it into one 667px phone viewport is what had the
      // copy sitting on top of both the portrait and the stats panel. It also
      // stops being sticky, because there is nothing riding over it down here.
      className="relative isolate overflow-hidden lg:sticky lg:top-0 lg:h-svh"
      style={{ background: "var(--gradient-hero)" }}
    >
      {/* Soft warm bloom for depth — much lighter than the original */}
      <div
        data-hero-fade
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 -z-10 size-[46rem] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(201,153,40,0.22), transparent 70%)",
        }}
      />

      {/* ---------------- Mobile stage: one full screen ----------------
          Below lg this is the whole visual hero — the name, the portrait over
          it and the panel over her — held to exactly one viewport, with the
          copy following underneath in flow.

          At lg it becomes `absolute inset-0`, which spans the section exactly,
          so every child's absolute position resolves against the same box it
          did before and the desktop composition is unchanged. Neither state
          sets a z-index, so this wrapper never becomes a stacking context and
          the children's z-indices still compare against each other. */}
      <div className="relative h-svh lg:absolute lg:inset-0">
        {/* ---------------- Name: line 1 left, line 2 right ---------------- */}
        <div
          ref={nameRef}
          data-hero-fade
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[11%] -z-10 px-5 md:px-8 lg:top-[5%] lg:pr-[12%]"
        >
          <p
            className="font-redound leading-[0.88] tracking-normal text-gold-dark select-none"
            // "Christeen" measures 5.043em in Redound, so the width of this line
            // is 5.043 x the font size — the number that decides whether it fits.
            //
            // The floor used to be 3.5rem, a fixed 56px, which at 320px put the
            // word at 282px inside a 280px box: clipped, and the reason the name
            // looked cut off on a phone. A vw floor scales instead. 16.5vw is the
            // widest value that still fits at every width from 320px up, taking
            // the lg:pr-[12%] gutter into account — 320px is the tightest case,
            // not the widest, because the padding is proportionally largest there.
            style={{ fontSize: "clamp(2rem, 16.5vw, 280px)" }}
          >
            <span
              data-line
              className="block origin-top text-center"
              style={{ opacity: 0 }}
            >
              Christeen
            </span>
            <span
              data-line
              className="block text-right text-[0.46em]"
              style={{ opacity: 0 }}
            >
              YOUSSEF
            </span>
          </p>
        </div>

        {/* ---------------- Portrait: centred, to the very bottom ---------------- */}
        <div
          data-hero-fade
          className="pointer-events-none absolute inset-y-0 left-1/2 z-10 flex -translate-x-1/2 items-end pb-[10vh] lg:inset-y-auto lg:bottom-0 lg:block lg:pb-0"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, ease: EASE, delay: 0.25 }}
            className="h-[75%] lg:h-[82vh]"
          >
            <Image
              src={portrait}
              alt="Dr. Christeen Youssef, aesthetic dermatologist, in a white coat"
              priority
              sizes="(max-width: 640px) 70vw, (max-width: 1024px) 55vw, 45vw"
              className="h-full w-auto max-w-none object-contain drop-shadow-[0_30px_70px_rgba(15,17,23,0.18)]"
            />
          </motion.div>
        </div>

        {/* ---------------- Foot of the stage: one fade for both layers ----
            A layer in the hero's own colour rather than a mask on the image.
            The mask only ever hid the photograph's cropped edge — the giant
            name sits behind it on its own layer and kept its hard bottom. This
            sits above both (name is -z-10, portrait z-10) and below the panel
            (z-30), so it takes them down together.

            #eee0bd is the bottom stop of --gradient-hero, so the fade resolves
            into the section's own background rather than over it. Mobile only:
            at lg the portrait runs off the bottom edge and there is no cut. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[40%] bg-gradient-to-t from-[#eee0bd] via-[#eee0bd]/85 to-transparent lg:hidden"
        />

        {/* ---------------- Stats: glass panel ----------------
            The fade goes on the panel itself, never on a wrapper. Only an
            *ancestor* with opacity<1 or a transform creates a new backdrop root
            — which would leave backdrop-filter sampling nothing and then snap to
            blurred. Fading the same element that owns the backdrop-filter keeps
            the blur sampling the real page, so it comes up with the panel. */}
        <div className="absolute inset-x-0 bottom-5 z-30 px-5 md:px-8 lg:bottom-7">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.85 }}
            className="mx-auto w-full rounded-[1.75rem] px-4 py-6 shadow-[0_10px_44px_rgba(15,17,23,0.10)] lg:w-[60%] lg:px-6 lg:py-7"
            style={{
              background: "rgba(255,255,255,.18)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,.55)",
            }}
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.12, delayChildren: 0.95 },
                },
              }}
              className="grid grid-cols-3 gap-0"
            >
              {stats.map((stat, i) => {
                const Icon = stat.icon;

                return (
                  <motion.div
                    key={stat.label}
                    variants={rise}
                    className={`flex flex-col items-center text-center${
                      i > 0 ? " lg:border-l lg:border-ink/12" : ""
                    }`}
                  >
                    {Icon ? (
                      <span className="flex size-11 items-center justify-center rounded-full border border-gold/35 lg:size-12">
                        <Icon
                          className="size-[22px] text-gold-dark"
                          strokeWidth={2}
                          aria-hidden
                        />
                      </span>
                    ) : null}

                    <p className="mt-4 font-body text-2xl leading-none font-semibold text-ink sm:text-3xl lg:text-[2.1rem]">
                      <CountUp value={stat.value} suffix={stat.suffix} />
                    </p>

                    <p className="mt-2 font-body text-[0.7rem] text-slate sm:text-[0.78rem]">
                      {stat.label}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>

      </div>
      {/* ---------------- Copy: left, mid-height ---------------- */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.12, delayChildren: 0.65 },
          },
        }}
        data-hero-fade
        className="relative z-20 px-5 py-16 md:px-8 lg:absolute lg:top-[47%] lg:left-0 lg:ms-5 lg:py-0"
      >
        <motion.h1
          variants={rise}
          className="font-display text-[2rem]/[1.1] font-semibold tracking-[-0.015em] text-ink sm:max-w-[22rem] sm:text-[2.6rem]/[1.06] lg:max-w-[26rem] lg:text-[3.2rem]/[1.04]"
        >
          Discover Your
          <br />
          Most Radiant Self
        </motion.h1>

        <motion.p
          variants={rise}
          className="mt-5 font-body text-sm/relaxed text-slate sm:max-w-[21rem] sm:text-[0.95rem]/relaxed lg:max-w-[30rem]"
        >
          With over a decade of clinical expertise, Dr. Christeen Youssef
          combines evidence-based aesthetic medicine with regenerative therapies
          and innovative approaches to skin and tissue healing.
        </motion.p>

        <motion.div variants={rise} className="mt-2 lg:mt-4">
          <TransitionLink
            href="/before-and-after"
            className="group relative inline-flex items-center gap-4 overflow-hidden rounded-full border border-ink/20 py-2 pr-2 pl-6 font-body text-[0.8rem] font-medium tracking-[0.06em] text-ink transition-colors duration-500 hover:text-cream sm:pl-7 sm:text-[0.85rem]"
          >
            {/* Ink sweeps in from the left edge */}
            <span
              aria-hidden
              className="absolute inset-0 origin-left scale-x-0 bg-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
            />
            <span className="relative z-10">See Results</span>
            <span className="relative z-10 flex size-9 items-center justify-center rounded-full bg-ink/10 transition-colors duration-500 group-hover:bg-cream/20 sm:size-10">
              <ArrowRight
                className="size-4 transition-transform duration-500 group-hover:translate-x-0.5"
                strokeWidth={2}
              />
            </span>
          </TransitionLink>
        </motion.div>
      </motion.div>

      {/* The upcoming event. A direct child of the section so its thumbnail
          positions against the hero's own box, and carrying data-hero-fade so it
          dissolves with everything else as About rides over.

          Its overlay is portalled to the body from inside — see EventSpotlight
          — because this section is `isolate` and would otherwise stack the
          poster underneath the fixed header. */}
      <EventSpotlight />

      {/* Film grain: ties the type, gradient and photo into one surface
          instead of three stacked layers.

          Desktop only, for a real reason rather than taste. This is an SVG
          feTurbulence filter used as a CSS background-image, and SVG-as-image is
          rendered in a restricted mode that iOS Safari and several Android
          WebViews do not run filters in. When the filter is dropped, what is
          left is the bare <rect> — which is what painted a solid black sheet
          over the whole hero on a phone.

          The rect is also given an explicit white fill now. Under
          mix-blend-multiply white is the identity colour, so anywhere the filter
          silently fails the layer disappears instead of going black. Without a
          fill, SVG defaults to black, which is the worst possible fallback for a
          multiply layer. */}
      <div
        aria-hidden
        data-hero-fade
        className="pointer-events-none absolute inset-0 z-40 hidden opacity-[0.16] mix-blend-multiply lg:block"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' fill='%23ffffff' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
          backgroundSize: "160px 160px",
        }}
      />
    </section>
  );
}
