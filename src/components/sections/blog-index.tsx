'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  clearBlogHashFilter,
  useBlogHashFilter,
} from '@/components/layout/blog-search-store';
import { BlogCard } from '@/components/ui/blog-card';
import { BlogCarousel } from '@/components/sections/blog-carousel';
import { blogPosts } from '@/data/blog';
import { byNewest } from '@/lib/blog-date';

/**
 * The posts the carousel leads with are simply the first few in data/blog.ts.
 * There is no `featured` flag on BlogPost, and rather than invent one, the
 * file's own order is the editorial order — move a post up the array to lead
 * with it. The grid below reads dates, so it stays chronological regardless.
 */
const CAROUSEL_COUNT = 5;

/**
 * Cards revealed per batch — two full rows at the widest grid.
 *
 * Sized to the row rather than to a round number, so a batch always lands as
 * complete rows and the grid never grows by a ragged half-row.
 */
const PAGE_SIZE = 8;

export function BlogIndex() {
  // Only the URL filters this grid. The header field no longer does — it opens
  // a menu of matching articles instead, so nothing a reader types up there can
  // change what is laid out down here.
  const query = useBlogHashFilter();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const chronological = useMemo(() => [...blogPosts].sort(byNewest), []);

  const carousel = useMemo(() => blogPosts.slice(0, CAROUSEL_COUNT), []);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return chronological;

    return chronological.filter((post) =>
      [post.title, post.excerpt, post.category].some((field) =>
        field.toLowerCase().includes(needle),
      ),
    );
  }, [chronological, query]);

  // How far down the list we are, tagged with the search it belongs to.
  //
  // Tagged rather than reset from an effect when `query` changes: an effect
  // would render one frame of the new search at the old scroll depth before
  // correcting itself, and setState in an effect body is a cascading render.
  // Carrying the term in the state means a new search simply does not match and
  // falls back to its own first page, with nothing to undo.
  const [page, setPage] = useState({ query, count: PAGE_SIZE });
  const visible = page.query === query ? page.count : PAGE_SIZE;

  const shown = results.slice(0, visible);
  const more = visible < results.length;

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setPage({ query, count: visible + PAGE_SIZE });
        }
      },
      // Well before the sentinel is on screen, so the next rows are already
      // there by the time the reader arrives at where they go.
      { rootMargin: '800px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
    // `visible` is a dependency on purpose. Observing fires the callback once
    // with the sentinel's current state, so a sentinel still in view after a
    // batch lands triggers the next one. Without it the grid stalls whenever a
    // batch is shorter than the viewport — the sentinel never leaves and
    // re-enters, so no new crossing is ever recorded.
  }, [visible, more, query]);

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

          clip, not hidden: `overflow: hidden` would make this a scroll
          container, and a scroll container clips `position: sticky` to itself
          and breaks IntersectionObserver's default root for anything inside it —
          which is what the grid below loads on. `clip` creates no scroll
          container, so both still resolve against the viewport. Same fix as the
          Principles and About sections on the home page. */}
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
            gutters. It used to give 19rem of that to a sticky sidebar carrying
            a Featured and a Latest list — two more ways to say what the grid
            beside them was already saying, in a column that repeated posts the
            reader could see. The grid has the whole width now. */}
        <div className="relative w-full px-5 pt-20 pb-24 md:px-8 lg:px-12 lg:pt-24 lg:pb-32 xl:px-20">
          <div className="scroll-mt-28">
            <div className="flex items-center gap-6">
              {/* The hash is a category — `/blog#conference` from the About
                  page's Explore buttons — so it is shown as the name of what is
                  being looked at rather than as a search term. */}
              <h2 className="shrink-0 font-display text-display-sm text-ink capitalize">
                {query.trim() ? `${query.trim()} articles` : 'All articles'}
              </h2>
              <span aria-hidden className="h-px flex-1 bg-ink/12" />
              <span className="shrink-0 font-body text-[0.72rem] tracking-[0.18em] text-slate/70 uppercase">
                {results.length} {results.length === 1 ? 'piece' : 'pieces'}
              </span>
            </div>

            {results.length === 0 ? (
              <p className="mt-12 font-body text-[0.95rem]/relaxed text-slate">
                Nothing here under &ldquo;{query.trim()}&rdquo;.{' '}
                <button
                  type="button"
                  onClick={clearBlogHashFilter}
                  className="cursor-pointer font-medium text-gold-dark underline decoration-gold/40 underline-offset-4 transition-colors hover:text-gold"
                >
                  Show every article
                </button>
                .
              </p>
            ) : (
              <>
                <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4">
                  {shown.map((post) => (
                    <BlogCard
                      key={post.slug}
                      post={post}
                      // Four up at xl inside the page gutters, three at lg.
                      sizes="(min-width: 1280px) 23vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                      // No `eager`: the carousel is a full screen tall, so no
                      // card is above the fold, and fetching the first row
                      // immediately only competes with the slide that is.
                    />
                  ))}
                </div>

                {/* Rendered only while there is more to load, so reaching the
                    end disconnects the observer rather than leaving it armed
                    against a sentinel that can no longer do anything. */}
                {more && (
                  <div
                    ref={sentinelRef}
                    className="flex items-center justify-center pt-14"
                  >
                    <span
                      aria-hidden
                      className="size-5 animate-spin rounded-full border-2 border-ink/15 border-t-gold-dark"
                    />
                  </div>
                )}
              </>
            )}

            {/* Screen readers get told what the grid did; the spinner above is
                aria-hidden because "loading" on its own is not the news. */}
            <p aria-live="polite" className="sr-only">
              Showing {shown.length} of {results.length} articles
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
