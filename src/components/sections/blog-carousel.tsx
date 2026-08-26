'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from 'motion/react';
import { CtaPill } from '@/components/ui/cta-pill';
import { TransitionLink } from '@/components/ui/transition-link';
import { formatBlogDate } from '@/lib/blog-date';
import { carouselFocus } from '@/lib/blog-image';
import { cn } from '@/lib/utils';
import type { BlogPost } from '@/types';

const EASE = [0.22, 1, 0.36, 1] as const;

/** How long a slide holds before advancing, in milliseconds. */
const HOLD = 6500;

/**
 * The listing's opening: the featured articles, full-bleed and at height.
 *
 * The photograph is the whole frame and it never sits still — each slide arrives
 * scaled up and settles as it plays, so the image is drifting for the entire
 * time it is on screen rather than being a static plate with a caption. That
 * drift is also what makes the crossfade read as one image becoming another
 * instead of two stills swapping.
 *
 * Auto-advance is driven from a motion value rather than component state: at 60
 * frames a second a `progress` in state would re-render this whole subtree, and
 * with it the AnimatePresence pair, sixty times a second. A motion value writes
 * straight to the transform, so the only render in a full cycle is the one that
 * changes the slide.
 */
export function BlogCarousel({ posts }: { posts: BlogPost[] }) {
  const [index, setIndex] = useState(0);

  // Held while the pointer is on the slide or focus is inside it. A carousel
  // that keeps moving while you are reading the title — or reaching for the
  // link — is the one thing everybody hates about carousels.
  const [paused, setPaused] = useState(false);

  const progress = useMotionValue(0);
  const shouldReduceMotion = useReducedMotion();

  const go = useCallback(
    (next: number) => {
      // Wraps in both directions, so `prev` from the first slide is the last
      // one rather than a dead button.
      setIndex(((next % posts.length) + posts.length) % posts.length);
      progress.set(0);
    },
    [posts.length, progress],
  );

  useAnimationFrame((_, delta) => {
    if (paused || shouldReduceMotion || posts.length < 2) return;

    const next = progress.get() + delta / HOLD;

    if (next >= 1) {
      progress.set(0);
      setIndex((current) => (current + 1) % posts.length);
      return;
    }

    progress.set(next);
  });

  const active = posts[index];

  if (!active) return null;

  return (
    <section
      // Inverts the fixed header for as long as this dark frame is under it.
      data-header-surface="dark"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured articles"
      className="relative isolate h-[80svh] min-h-[34rem] w-full overflow-hidden bg-ink lg:h-[90svh]"
    >
      {/* ---------------- The photograph ---------------- */}
      {/* Both slides stay mounted through the crossfade, which is why this is
          the default `sync` mode rather than `wait` — waiting would blank the
          frame to ink between the two. */}
      <AnimatePresence>
        <motion.div
          key={active.slug}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: EASE }}
          className="absolute inset-0"
        >
          {/* The scale lives on its own element so the fade above cannot
              interrupt it: an exiting slide keeps drifting while it goes, which
              is what stops the handover from looking like a cut. Duration runs
              past HOLD on purpose — the motion should still be underway when the
              next slide takes over, never finish early and freeze. */}
          <motion.div
            initial={shouldReduceMotion ? undefined : { scale: 1.16 }}
            animate={shouldReduceMotion ? undefined : { scale: 1 }}
            transition={{ duration: HOLD / 1000 + 2.4, ease: 'linear' }}
            className="absolute inset-0"
          >
            <Image
              src={active.image}
              alt=""
              fill
              // Only the first slide is above the fold on arrival; the rest are
              // fetched as they come up.
              priority={index === 0}
              sizes="100vw"
              placeholder="blur"
              // Per post — see heroFocus. Usually the same value the article
              // hero reads, so the crop survives the click; a post may set the
              // two apart where this frame's height and zoom need it to.
              style={{ objectPosition: carouselFocus(active) }}
              className="object-cover"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* ---------------- Scrims ---------------- */}
      {/* Outside the AnimatePresence above: these are constant, and fading them
          with each slide would pulse the whole frame. Two of them — one up from
          the base to carry the type, one in from the left so the title has
          contrast even against a bright edge. */}
      <div
        aria-hidden
        className="absolute inset-0 z-10 bg-gradient-to-t from-ink via-ink/50 to-ink/25"
      />
      <div
        aria-hidden
        className="absolute inset-0 z-10 bg-gradient-to-r from-ink/75 via-ink/25 to-transparent"
      />

      {/* ---------------- Copy ---------------- */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end px-5 pt-20 pb-16 md:px-8 sm:pb-20 lg:px-12 lg:pb-24 xl:px-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.slug}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="max-w-4xl"
          >
            <motion.span
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}
              className="inline-flex rounded-full border border-cream/20 bg-cream/10 px-3.5 py-1.5 font-body text-[0.62rem] tracking-[0.18em] text-cream uppercase backdrop-blur-sm"
            >
              {active.category}
            </motion.span>

            {/* The title carries the scale as well as the rise, at a fraction
                the image gets — enough to feel like it is settling with the
                photograph rather than sliding in over it. */}
            <motion.h2
              initial={{ opacity: 0, y: 26, scale: 1.03 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.12 }}
              // line-clamp is what makes this safe rather than merely tuned.
              // The copy is absolutely positioned inside a fixed-height frame,
              // and `justify-end` overflows out of the *top*, where the
              // section's overflow-hidden clips it — so a title long enough to
              // need six lines on a phone lost its category chip and its first
              // line off the top of the screen. Three lines is a hard ceiling
              // whatever gets published later; the full title is one tap away.
              className="mt-5 line-clamp-3 origin-bottom-left font-display text-[1.6rem]/tight text-cream sm:mt-6 sm:text-4xl/tight lg:text-5xl/[1.1] xl:text-[3.5rem]/[1.08]"
            >
              <TransitionLink
                href={`/blog/${active.slug}`}
                className="transition-colors duration-500 hover:text-gold-light"
              >
                {active.title}
              </TransitionLink>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
              className="mt-4 font-body text-[0.72rem] tracking-[0.14em] text-cream/65 uppercase sm:mt-6 sm:text-[0.78rem]"
            >
              {formatBlogDate(active.date)}
              <span aria-hidden className="mx-3 text-cream/30">
                &mdash;
              </span>
              {active.readTime} read
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.28 }}
              className="mt-7 sm:mt-9"
            >
              <CtaPill
                href={`/blog/${active.slug}`}
                label="Read article"
                onDark
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* In the copy's flow below sm, absolute from sm up.
        
            This used to be a sibling of the copy block, positioned absolutely
            at z-30 over it at every width — which put it on the CTA pill's line
            with nothing to stop the two meeting. Widths can be tuned until they
            clear on the phone you are holding; being a flex sibling of the row
            above makes the overlap impossible on any width. From sm there is
            room to spare, so it goes back to the corner. */}
        {posts.length > 1 && (
          <div className="mt-6 flex items-center justify-end gap-4 sm:absolute sm:right-5 sm:bottom-20 sm:mt-0 md:right-8 lg:bottom-24 xl:right-20">
            {/* Hidden below sm: the segments along the bottom edge already say
                which slide this is, and on a phone the two arrows are the half
                worth keeping. */}
            <span className="hidden font-body text-[0.72rem] tracking-[0.18em] text-cream/55 tabular-nums sm:inline">
              {String(index + 1).padStart(2, '0')}
              <span className="mx-1.5 text-cream/25">/</span>
              {String(posts.length).padStart(2, '0')}
            </span>

            <div className="flex items-center gap-2">
              <ControlButton
                label="Previous article"
                onClick={() => go(index - 1)}
              >
                <ArrowLeft aria-hidden className="size-4" />
              </ControlButton>
              <ControlButton label="Next article" onClick={() => go(index + 1)}>
                <ArrowRight aria-hidden className="size-4" />
              </ControlButton>
            </div>
          </div>
        )}
      </div>

      {/* ---------------- Controls ---------------- */}
      {posts.length > 1 && (
        <>
          {/* One segment per slide, flush to the bottom edge: the pagination and
              the auto-advance timer are the same object, so there is nothing to
              keep in step. */}
          <div className="absolute inset-x-0 bottom-0 z-30 flex gap-px">
            {posts.map((post, slide) => (
              <button
                key={post.slug}
                type="button"
                onClick={() => go(slide)}
                aria-label={`Show article ${slide + 1}: ${post.title}`}
                aria-current={slide === index ? 'true' : undefined}
                className="group relative h-8 flex-1 cursor-pointer"
              >
                {/* The rail is thin; the button is not. The hit area is a full
                    32px tall so this is reachable on a phone, with only the
                    bottom 3px drawn. */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-[3px] overflow-hidden bg-cream/15 transition-colors duration-300 group-hover:bg-cream/30"
                >
                  {slide === index ? (
                    <motion.span
                      // scaleX from the motion value, so this is the actual
                      // countdown rather than an animation timed to match one.
                      style={
                        shouldReduceMotion ? undefined : { scaleX: progress }
                      }
                      className={cn(
                        'block h-full origin-left bg-gradient-gold',
                        // With reduced motion there is no countdown to draw, so
                        // the active segment is simply filled.
                        shouldReduceMotion && 'w-full',
                      )}
                    />
                  ) : (
                    slide < index && (
                      <span className="block h-full bg-cream/35" />
                    )
                  )}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function ControlButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-11 cursor-pointer place-items-center rounded-full border border-cream/25 bg-cream/10 text-cream backdrop-blur-md transition-colors duration-300 hover:border-gold/50 hover:bg-cream/20 hover:text-gold-light"
    >
      {children}
    </button>
  );
}
