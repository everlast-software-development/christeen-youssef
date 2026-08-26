'use client';

import { useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { useLenis } from 'lenis/react';
import { BlogCard } from '@/components/ui/blog-card';
import { BlogCarousel } from '@/components/sections/blog-carousel';
import { TransitionLink } from '@/components/ui/transition-link';
import {
  resetBlogSearch,
  useBlogSearchQuery,
  useBlogSearchSubmit,
} from '@/components/layout/blog-search-store';
import { blogPosts } from '@/data/blog';
import { byNewest, formatBlogDate } from '@/lib/blog-date';
import type { BlogPost } from '@/types';

/**
 * The posts the carousel and the sidebar lead with are simply the first few in
 * data/blog.ts. There is no `featured` flag on BlogPost, and rather than invent
 * one, the file's own order is the editorial order — move a post up the array to
 * feature it. Everything below reads dates, so the main grid and "Latest" stay
 * chronological regardless.
 */
const FEATURED_COUNT = 3;

/** How many slides the opening carousel runs. */
const CAROUSEL_COUNT = 5;

/** How many chronological entries the Latest column shows. */
const LATEST_COUNT = 4;

export function BlogIndex() {
  // The field itself is in the header now — see layout/blog-search-store.ts for
  // why the term lives outside React rather than in a context.
  const query = useBlogSearchQuery();
  const submitCount = useBlogSearchSubmit();
  const lenis = useLenis();
  const resultsRef = useRef<HTMLDivElement>(null);

  // Anything typed here belongs to this page only. Left behind, it would still
  // be filtering the grid on the way back, and — because a typed term outranks
  // the hash — a later /blog#research link would silently do nothing.
  useEffect(() => resetBlogSearch, []);

  const chronological = useMemo(() => [...blogPosts].sort(byNewest), []);

  const carousel = useMemo(() => blogPosts.slice(0, CAROUSEL_COUNT), []);

  const featured = useMemo(() => blogPosts.slice(0, FEATURED_COUNT), []);

  // Whatever the featured column is already showing is skipped here, so the two
  // lists never repeat a post between them.
  const latest = useMemo(() => {
    const shown = new Set(featured.map((post) => post.slug));
    return chronological
      .filter((post) => !shown.has(post.slug))
      .slice(0, LATEST_COUNT);
  }, [chronological, featured]);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return chronological;

    return chronological.filter((post) =>
      [post.title, post.excerpt, post.category].some((field) =>
        field.toLowerCase().includes(needle),
      ),
    );
  }, [chronological, query]);

  // Submitting the header field takes you to the results. Filtering is live, so
  // this is not what runs the search — the carousel is a full screen tall, so
  // without it a term typed up in the header changes something you cannot see.
  // Through Lenis where it is driving, so the jump is smoothed like every other
  // move on the site rather than fighting it.
  useEffect(() => {
    if (!submitCount) return;

    const target = resultsRef.current;
    if (!target) return;

    if (lenis) lenis.scrollTo(target, { offset: -96 });
    else target.scrollIntoView({ behavior: 'smooth' });
  }, [submitCount, lenis]);

  return (
    <main className="bg-cream text-ink">
      {/* The opening frame, full-bleed under the fixed header. It replaces the
          centred title-and-standfirst that used to sit here: the articles have
          their own photography and their own titles, so a page-level heading
          restating what a blog is was the least interesting thing on screen.
          What the page is is now said by the work itself. */}
      <BlogCarousel posts={carousel} />

      {/* overflow-x-clip because of the bloom below. It is 46rem across, pinned
          to `left-1/2` and pulled back by half itself, so on a 390px phone its
          right edge lands at 563px — and with nothing clipping it, that became
          the width of the whole layout: the viewport laid out at 563 behind a
          390 window, which is the horizontal scroll.
      
          clip, not hidden: the sidebar below is `lg:sticky`, and `overflow:
          hidden` would make this a scroll container and strand it. `clip`
          creates no scroll container, so sticky still resolves against the
          viewport. Same fix as the Principles and About sections on the home
          page, for the same reason. */}
      <div className="relative overflow-x-clip">
        {/* Warm bloom, the same device every cream section on the site uses.
            Inside this wrapper rather than on <main>, so it blooms at the seam
            below the carousel instead of behind it. */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-1/2 size-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(201,153,40,0.12), transparent 70%)',
          }}
        />

        {/* Fluid: no max width, so the grid takes the full screen less the page
            gutters. Its own top padding now — the carousel above runs to the
            edge of its frame and there is no header block left to space it. */}
        <div className="relative grid w-full gap-14 px-5 pt-20 pb-24 md:px-8 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-16 lg:px-12 lg:pt-24 lg:pb-32 xl:px-20">
          {/* ---------------- Main column ---------------- */}
          <div ref={resultsRef} className="scroll-mt-28">
            <div className="flex items-center gap-6">
              <h2 className="shrink-0 font-display text-display-sm text-ink">
                {query.trim() ? 'Search results' : 'All articles'}
              </h2>
              <span aria-hidden className="h-px flex-1 bg-ink/12" />
              <span className="shrink-0 font-body text-[0.72rem] tracking-[0.18em] text-slate/70 uppercase">
                {results.length} {results.length === 1 ? 'piece' : 'pieces'}
              </span>
            </div>

            {results.length === 0 ? (
              <p className="mt-12 font-body text-[0.95rem]/relaxed text-slate">
                Nothing matches &ldquo;{query.trim()}&rdquo;. Try a broader term —
                a treatment, a conference, or a year.
              </p>
            ) : (
              <div className="mt-10 grid gap-7 sm:grid-cols-2 xl:grid-cols-3 lg:gap-8">
                {results.map((post) => (
                  <BlogCard
                    key={post.slug}
                    post={post}
                    sizes="(min-width: 1280px) 24vw, (min-width: 640px) 44vw, 90vw"
                    // No `eager` any more: the carousel is a full screen tall,
                    // so no card is above the fold, and fetching the first row
                    // immediately only competes with the slide that is.
                  />
                ))}
              </div>
            )}
          </div>

          {/* ---------------- Sidebar ---------------- */}
          <aside className="space-y-12 lg:sticky lg:top-28 lg:self-start">
            <SidebarList title="Featured" posts={featured} />
            <SidebarList title="Latest" posts={latest} />
          </aside>
        </div>
      </div>
    </main>
  );
}

function SidebarList({ title, posts }: { title: string; posts: BlogPost[] }) {
  return (
    <section>
      <div className="flex items-center gap-4">
        <h2 className="shrink-0 font-display text-2xl text-ink">{title}</h2>
        <span aria-hidden className="h-px flex-1 bg-ink/12" />
      </div>

      <ul className="mt-6 space-y-6">
        {posts.map((post) => (
          <li key={post.slug}>
            <TransitionLink
              href={`/blog/${post.slug}`}
              className="group flex gap-4"
            >
              <span className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-cream-dark">
                <Image
                  src={post.image}
                  alt=""
                  fill
                  sizes="64px"
                  placeholder="blur"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                />
              </span>

              <span className="min-w-0">
                <span className="block font-body text-[0.72rem] tracking-[0.1em] text-slate/70">
                  {formatBlogDate(post.date)}
                </span>

                {/* Clamped rather than truncated at a character count: these
                    titles run to conference-paper length and a hard cut lands
                    mid-word. */}
                <span className="mt-1 line-clamp-3 block font-body text-[0.9rem]/snug font-medium text-ink transition-colors duration-300 group-hover:text-gold-dark">
                  {post.title}
                </span>
              </span>
            </TransitionLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
