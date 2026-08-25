'use client';

import { useMemo, useRef, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { useLenis } from 'lenis/react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { CtaSubmit } from '@/components/ui/cta-pill';
import { BlogCard } from '@/components/ui/blog-card';
import { TransitionLink } from '@/components/ui/transition-link';
import { blogPosts } from '@/data/blog';
import { byNewest, formatBlogDate } from '@/lib/blog-date';
import type { BlogPost } from '@/types';

/**
 * The three posts the sidebar leads with are simply the first three in
 * data/blog.ts. There is no `featured` flag on BlogPost, and rather than invent
 * one, the file's own order is the editorial order — move a post up the array to
 * feature it. Everything below reads dates, so the main grid and "Latest" stay
 * chronological regardless.
 */
const FEATURED_COUNT = 3;

/** How many chronological entries the Latest column shows. */
const LATEST_COUNT = 4;

/**
 * The location hash, as a subscribed external value.
 *
 * A /blog#conference link — which is how the About page's "Explore" buttons
 * arrive — seeds the search box below, and the existing filter already matches
 * on category, so no separate category UI is needed.
 *
 * useSyncExternalStore rather than an effect or a lazy useState initialiser: an
 * effect means calling setState inside an effect, which the react-hooks rules
 * forbid, and a lazy initialiser would return '' on the server and the real hash
 * on the client, which is a hydration mismatch. This takes a server snapshot for
 * exactly that reason, and picks up back/forward hash changes for free.
 *
 * Not useSearchParams: a client hook reading search params forces this
 * statically prerendered listing behind a Suspense boundary, and the page would
 * ship its fallback as HTML instead of the articles.
 */
const subscribeToHash = (onChange: () => void) => {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
};

const readHash = () => decodeURIComponent(window.location.hash.slice(1)).trim();

const readHashOnServer = () => '';

export function BlogIndex() {
  // Null until someone types, so the hash is in force until then and is then
  // dropped for good — a reader who has started editing the box should not have
  // it overwritten by the URL they arrived on.
  const [typed, setTyped] = useState<string | null>(null);
  const hash = useSyncExternalStore(
    subscribeToHash,
    readHash,
    readHashOnServer,
  );
  const query = typed ?? hash;
  const lenis = useLenis();
  const resultsRef = useRef<HTMLDivElement>(null);

  const chronological = useMemo(() => [...blogPosts].sort(byNewest), []);

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

  // Filtering is live, so the button is not what runs the search — on a phone
  // the results are below the fold, and this is what takes you to them. Through
  // Lenis where it is driving, so the jump is smoothed like every other move on
  // the site rather than fighting it.
  const goToResults = () => {
    const target = resultsRef.current;
    if (!target) return;

    if (lenis) lenis.scrollTo(target, { offset: -96 });
    else target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="relative bg-cream text-ink">
      {/* Warm bloom, the same device every cream section on the site uses. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 size-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(201,153,40,0.12), transparent 70%)',
        }}
      />

      {/* ---------------- Hero ---------------- */}
      <header className="relative mx-auto max-w-3xl px-5 pt-32 pb-16 text-center md:px-8 lg:pt-40 lg:pb-20">
        <span className="inline-flex rounded-full border border-ink/10 bg-white/60 px-4 py-1.5 font-body text-[0.7rem] tracking-[0.2em] text-gold-dark uppercase backdrop-blur-sm">
          Blog
        </span>

        <h1 className="mt-8 font-display text-display-lg text-ink">
          Insight, research &amp; results
        </h1>

        <p className="mx-auto mt-6 max-w-xl font-body text-[0.95rem]/relaxed text-slate lg:text-base/relaxed">
          Conference papers, published research, clinical cases and press from
          Dr. Christeen Youssef&apos;s practice in Abu Dhabi.
        </p>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            goToResults();
          }}
          className="mx-auto mt-10 flex max-w-xl flex-col items-stretch gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate/60"
            />
            <Input
              type="search"
              value={query}
              onChange={(event) => setTyped(event.target.value)}
              placeholder="Search articles"
              aria-label="Search articles"
              className="h-12 rounded-full border-ink/12 bg-white/70 pr-4 pl-11 text-base text-ink backdrop-blur-sm placeholder:text-slate/60 focus-visible:border-gold focus-visible:ring-gold/20 md:text-sm"
            />
          </div>

          <CtaSubmit
            label="Find now"
            pendingLabel="Find now"
            className="border-ink/15 text-ink hover:text-ink sm:w-auto sm:px-8"
          />
        </form>
      </header>

      {/* Fluid: no max width, so the grid takes the full screen less the page
          gutters. The hero above keeps its measure — centred prose gets unreadable
          long before a card grid does. */}
      <div className="relative grid w-full gap-14 px-5 pb-24 md:px-8 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-16 lg:px-12 lg:pb-32 xl:px-20">
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
              {results.map((post, index) => (
                <BlogCard
                  key={post.slug}
                  post={post}
                  sizes="(min-width: 1280px) 24vw, (min-width: 640px) 44vw, 90vw"
                  // The first row is the only part above the fold.
                  eager={index < 3}
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
