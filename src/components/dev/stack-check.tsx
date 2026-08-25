'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useSpring } from 'motion/react';
import {
  Sparkles,
  MousePointer2,
  Palette,
  Component,
  Clapperboard,
  Feather,
} from 'lucide-react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const LIBRARIES = [
  {
    icon: Palette,
    name: 'Tailwind CSS v4',
    detail:
      'CSS-first config. Brand tokens live in globals.css, so text-gold and bg-cream are real utilities.',
  },
  {
    icon: Component,
    name: 'shadcn/ui',
    detail:
      'Components are copied into the repo, not imported from a package. Restyle them freely.',
  },
  {
    icon: Sparkles,
    name: 'Motion',
    detail:
      'Declarative component animation: entrances, layout transitions, scroll-linked springs.',
  },
  {
    icon: Clapperboard,
    name: 'GSAP + ScrollTrigger',
    detail:
      'Timeline-based, frame-accurate choreography. Pinning, scrubbing, cinematic sequences.',
  },
  {
    icon: MousePointer2,
    name: 'Lenis',
    detail:
      'Smooth scroll sharing one RAF loop with GSAP, so pinned sections never jitter.',
  },
  {
    icon: Feather,
    name: 'Lucide',
    detail:
      'Consistent stroke-based icon set that inherits currentColor and scales cleanly.',
  },
];

const EASE_BRAND = [0.16, 1, 0.3, 1] as const;

function LibraryCard({
  library,
  index,
}: {
  library: (typeof LIBRARIES)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const Icon = library.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, delay: index * 0.08, ease: EASE_BRAND }}
    >
      <Card className="h-full">
        <CardContent className="p-7">
          <Icon className="size-6 text-gold" strokeWidth={1.5} />
          <h3 className="mt-5 font-display text-xl text-ink">{library.name}</h3>
          <p className="mt-2 font-body text-sm/7 text-slate">{library.detail}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function StackCheck() {
  // Motion: scroll-linked progress bar, smoothed with a spring.
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  // GSAP: pin a panel and scrub a timeline across it as the user scrolls.
  const pinRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: 'top top',
          end: '+=1400',
          pin: true,
          scrub: 1,
        },
      });

      timeline
        .fromTo(
          '[data-gsap="rule"]',
          { scaleX: 0, transformOrigin: 'left center' },
          { scaleX: 1, duration: 1 },
        )
        .fromTo(
          '[data-gsap="word"]',
          { yPercent: 120, opacity: 0 },
          { yPercent: 0, opacity: 1, stagger: 0.18, duration: 1 },
          '-=0.6',
        );

      // useGSAP reverts tweens on unmount; kill the ScrollTrigger too so the
      // pin spacer is removed on navigation.
      return () => {
        timeline.scrollTrigger?.kill();
      };
    },
    { scope: pinRef },
  );

  return (
    <>
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-gradient-gold"
      />

      {/* ---------------- Hero: Motion staggered entrance ---------------- */}
      <section className="relative flex min-h-svh items-center overflow-hidden bg-ink">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 size-[42rem] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(232,200,106,0.55), transparent 65%)',
          }}
        />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
          className="container-brand relative"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: EASE_BRAND },
              },
            }}
          >
            <Badge
              variant="outline"
              className="border-gold/40 font-body text-[0.7rem] tracking-[0.22em] text-gold uppercase"
            >
              Premium stack installed
            </Badge>
          </motion.div>

          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: EASE_BRAND },
              },
            }}
            className="mt-8 max-w-3xl font-display text-display-lg text-cream"
          >
            Every library is{' '}
            <span className="text-gradient-gold">wired and verified</span>.
          </motion.h1>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: EASE_BRAND },
              },
            }}
            className="mt-6 max-w-xl font-body text-lg/8 text-cream/70"
          >
            Next.js, Tailwind v4, shadcn/ui, Motion, GSAP with ScrollTrigger,
            Lenis and Lucide are all running together. Scroll to see each one
            prove itself.
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: EASE_BRAND },
              },
            }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Button size="lg" className="font-body">
              Primary action
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-cream/25 bg-transparent font-body text-cream hover:bg-cream/10 hover:text-cream"
            >
              Secondary
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* ------------- GSAP ScrollTrigger: pinned and scrubbed ------------- */}
      <section
        ref={pinRef}
        className="flex min-h-svh items-center overflow-hidden bg-cream"
      >
        <div className="container-brand">
          <p className="font-body text-xs tracking-[0.25em] text-gold uppercase">
            GSAP ScrollTrigger &mdash; pinned and scrubbed
          </p>

          <div data-gsap="rule" className="mt-8 h-px w-full bg-gradient-gold" />

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 overflow-hidden">
            {['Cinematic', 'Scroll', 'Choreography'].map((word) => (
              <span
                key={word}
                data-gsap="word"
                className="inline-block font-display text-display-md text-ink"
              >
                {word}
              </span>
            ))}
          </div>

          <p className="mt-10 max-w-md font-body text-sm/7 text-slate">
            This panel is pinned while a GSAP timeline scrubs against scroll
            progress. Lenis drives the scroll and both share GSAP&apos;s ticker,
            which is why it stays locked to the frame.
          </p>
        </div>
      </section>

      {/* ---------------- Motion: viewport reveals ---------------- */}
      <section className="bg-background py-32">
        <div className="container-brand">
          <p className="font-body text-xs tracking-[0.25em] text-gold uppercase">
            Motion &mdash; viewport reveals
          </p>
          <h2 className="mt-5 max-w-2xl font-display text-display-sm text-ink">
            Six libraries, one system
          </h2>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {LIBRARIES.map((library, i) => (
              <LibraryCard key={library.name} library={library} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink py-28">
        <div className="container-brand text-center">
          <h2 className="font-display text-display-sm text-cream">
            Setup complete
          </h2>
          <p className="mx-auto mt-4 max-w-lg font-body text-cream/60">
            This page is scaffolding that exists to prove the stack. The real
            rebuild replaces it one section at a time.
          </p>
        </div>
      </section>
    </>
  );
}
