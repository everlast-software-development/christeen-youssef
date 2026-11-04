'use client';

import { useEffect, useId, useRef, useSyncExternalStore } from 'react';
import { Search, X } from 'lucide-react';
import { PageHero } from '@/components/site/page-hero';
import { BUTTON_RADIUS } from '@/components/site/button';
import { FilterChips } from '@/components/site/filter-chips';
import { categoryLabel } from '@/components/site/article-card';
import { setBlogFilters, type BlogFilters } from '@/components/layout/blog-filters';
import { cn } from '@/lib/utils';

// "⌘K" on Apple platforms, "Ctrl K" elsewhere. The server cannot know, so it
// renders "Ctrl K" and the client corrects it without a hydration mismatch.
const subscribeNever = () => () => {};
const isApple = () => /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);
const notApple = () => false;

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

/**
 * The blog's opening: the shared inner-page hero, with the search and the
 * category chips in its slot. Both
 * filter the listing below in place and live in the URL, so a filtered view
 * can be shared. ⌘K / Ctrl K focuses the search from anywhere on the page.
 */
export function BlogHero({
  filters,
  categories,
  count,
}: {
  filters: BlogFilters;
  /** The categories that exist in the data, upper-case as stored. */
  categories: string[];
  /** How many articles the current filters leave. */
  count: number;
}) {
  const input = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const apple = useSyncExternalStore(subscribeNever, isApple, notApple);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        input.current?.focus();
        input.current?.select();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const term = filters.q.trim();
  const active = categories.find((category) => category.toLowerCase() === filters.category);
  const summary = term
    ? `${plural(count, 'result')} for ‘${term}’${active ? ` in ${categoryLabel(active)}` : ''}`
    : active
      ? `${plural(count, 'article')} in ${categoryLabel(active)}`
      : plural(count, 'article');

  return (
    <PageHero
      section="/blog"
      title="Insight, research & {results}"
      intro="Articles, conference highlights and research updates from Dr. Christeen Youssef on aesthetic dermatology and regenerative medicine."
    >
        {/* ---------------- Search ---------------- */}
        <form
          role="search"
          onSubmit={(event) => event.preventDefault()}
          className={cn(
            'relative flex h-14 w-full max-w-[560px] items-center border border-white/13 bg-white/5 transition-[background-color,border-color,box-shadow] duration-300',
            'focus-within:border-gold focus-within:bg-white/7 focus-within:ring-4 focus-within:ring-gold/20',
            BUTTON_RADIUS,
          )}
        >
          <label htmlFor={inputId} className="sr-only">
            Search articles
          </label>
          <Search aria-hidden strokeWidth={1.8} className="ml-5 size-[18px] shrink-0 text-gold" />
          <input
            ref={input}
            id={inputId}
            type="search"
            value={filters.q}
            onChange={(event) => setBlogFilters({ q: event.target.value }, filters)}
            onKeyDown={(event) => {
              if (event.key === 'Escape' && filters.q) setBlogFilters({ q: '' }, filters);
            }}
            placeholder="Search articles, treatments, conferences…"
            autoComplete="off"
            className="h-full min-w-0 flex-1 bg-transparent px-3.5 type-body text-white outline-none placeholder:text-white/50 max-md:text-base [&::-webkit-search-cancel-button]:hidden"
          />
          {filters.q ? (
            <button
              type="button"
              onClick={() => {
                setBlogFilters({ q: '' }, filters);
                input.current?.focus();
              }}
              aria-label="Clear search"
              className="mr-3 grid size-8 shrink-0 cursor-pointer place-items-center rounded-full text-white/60 transition-colors duration-200 hover-fine:bg-white/10 hover-fine:text-white focus-visible:outline-2 focus-visible:outline-gold"
            >
              <X aria-hidden className="size-4" />
            </button>
          ) : (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => input.current?.focus()}
              aria-hidden
              className="mr-3 hidden shrink-0 cursor-pointer rounded-[6px] border border-white/13 px-2 py-1 font-body text-[11px] font-medium tracking-[0.04em] text-white/40 sm:inline-block"
            >
              {apple ? '⌘K' : 'Ctrl K'}
            </button>
          )}
        </form>

        <p aria-live="polite" className="m-0 mt-3 type-small text-white/55">
          {summary}
        </p>

        <FilterChips
          label="Filter by category"
          className="mt-6"
          value={filters.category}
          onChange={(category) => setBlogFilters({ category }, filters)}
          options={categories.map((category) => ({ value: category.toLowerCase(), label: categoryLabel(category) }))}
        />
    </PageHero>
  );
}
