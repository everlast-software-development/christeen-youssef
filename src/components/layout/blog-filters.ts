'use client';

import { useMemo, useSyncExternalStore } from 'react';

/**
 * The blog listing's search term and category, held in the URL
 * (`/blog?q=svf&category=research`) so any filtered view can be shared.
 *
 * Read with useSyncExternalStore over `location.search` rather than
 * useSearchParams: that hook would push this statically prerendered page
 * behind a Suspense boundary and ship its fallback as HTML instead of the
 * articles. The server snapshot is empty, so the first render is the full
 * list and the client then applies whatever the URL asks for.
 *
 * Written with history.replaceState: typing into the search should not stack
 * a history entry per keystroke.
 */

export type BlogFilters = { q: string; category: string };

const CHANGE = 'blog-filters-change';

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE, onChange);
  window.addEventListener('popstate', onChange);
  window.addEventListener('hashchange', onChange);
  return () => {
    window.removeEventListener(CHANGE, onChange);
    window.removeEventListener('popstate', onChange);
    window.removeEventListener('hashchange', onChange);
  };
}

// Strings compare by value, so useSyncExternalStore will not loop on these.
const getSearch = () => window.location.search + window.location.hash;
const getEmpty = () => '';

function parse(raw: string, categories: string[]): BlogFilters {
  const [search, hash = ''] = raw.split('#');
  const params = new URLSearchParams(search);
  // Untrimmed: this is also the input's value, and trimming would swallow the
  // space being typed between two words. Matching trims it.
  const q = params.get('q') ?? '';
  let category = (params.get('category') ?? '').toLowerCase();

  // Older links (the About page used `/blog#conference`) still land on the
  // right category.
  if (!category && hash) {
    try {
      const fromHash = decodeURIComponent(hash).toLowerCase();
      if (categories.includes(fromHash)) category = fromHash;
    } catch {
      // A malformed escape in a hand-edited hash: ignore it.
    }
  }

  return { q, category: categories.includes(category) ? category : '' };
}

/** The current filters. `categories` are the lower-cased valid values. */
export function useBlogFilters(categories: string[]): BlogFilters {
  const raw = useSyncExternalStore(subscribe, getSearch, getEmpty);
  return useMemo(() => parse(raw, categories), [raw, categories]);
}

/** Update one or both filters in the URL (empty values are dropped). */
export function setBlogFilters(next: Partial<BlogFilters>, current: BlogFilters) {
  const merged = { ...current, ...next };
  const params = new URLSearchParams();
  if (merged.q.trim()) params.set('q', merged.q);
  if (merged.category) params.set('category', merged.category);
  const query = params.toString();
  window.history.replaceState(window.history.state, '', `${window.location.pathname}${query ? `?${query}` : ''}`);
  window.dispatchEvent(new Event(CHANGE));
}
