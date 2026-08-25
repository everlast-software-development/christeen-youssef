'use client';

import { useMemo, useRef } from 'react';
import { gsap, SplitText, useGSAP } from '@/lib/gsap';
import { BlogCard } from '@/components/ui/blog-card';
import { CtaPill } from '@/components/ui/cta-pill';
import { blogPosts } from '@/data/blog';
import { byNewest } from '@/lib/blog-date';

/** Three across on desktop, so the row is always full. */
const TEASER_COUNT = 3;

export function BlogSection() {
  const rootRef = useRef<HTMLElement>(null);

  // The newest three, not the first three in the file: the index leads with a
  // curated order, but a teaser on the home page is only interesting if it is
  // genuinely the most recent thing.
  const posts = useMemo(
    () => [...blogPosts].sort(byNewest).slice(0, TEASER_COUNT),
    [],
  );

  useGSAP(
    () => {
      const title = rootRef.current?.querySelector<HTMLElement>('[data-title]');
      const rule = rootRef.current?.querySelector<HTMLElement>('[data-rule]');
      const cards = gsap.utils.toArray<HTMLElement>(
        '[data-card]',
        rootRef.current,
      );

      const arrival = {
        trigger: rootRef.current,
        start: 'top 75%',
        once: true,
      } as const;

      // Per-line mask reveal, the same device the other sections use.
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

      if (rule) {
        gsap.from(rule, {
          scaleX: 0,
          duration: 1.2,
          delay: 0.35,
          ease: 'power3.inOut',
          scrollTrigger: arrival,
        });
      }

      // The animation lives here rather than in BlogCard because the card is
      // shared with the blog index, where the list filters as you type — a
      // per-card entrance there would strand re-mounted cards at opacity 0.
      gsap.from(cards, {
        y: 34,
        opacity: 0,
        scale: 0.97,
        duration: 1.3,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.2,
        scrollTrigger: arrival,
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="journal"
      // Opaque and above everything before it: the hero is sticky for the whole
      // page, and Expertise pins over it directly above this.
      className="relative z-20 overflow-hidden border-t border-ink/10 bg-cream py-24 text-ink lg:py-32"
    >
      {/* Warm bloom, the same device every other section uses. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 size-[38rem] translate-x-1/3 -translate-y-1/3 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(201,153,40,0.12), transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8 lg:px-12 xl:px-20">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="font-body text-[0.72rem] tracking-[0.24em] text-gold-dark uppercase sm:text-[0.78rem]">
              Journal
            </p>

            <h2
              data-title
              className="mt-5 max-w-[24ch] font-display text-display-md text-ink"
            >
              Insight, research &amp; results
            </h2>

            <div
              data-rule
              aria-hidden
              className="mt-7 h-px w-24 origin-left bg-gradient-gold"
            />
          </div>

          {/* Beside the heading on wide screens, under it when the row wraps —
              either way it is the section's way out, not a third card. */}
          <CtaPill href="/blog" label="All articles" />
        </div>

        <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-8">
          {posts.map((post) => (
            <div key={post.slug} data-card>
              <BlogCard
                post={post}
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 90vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
