'use client';

import { useSyncExternalStore } from 'react';

/**
 * The blog listing's search term, held outside React.
 *
 * It lives here because the field and the results are no longer in the same
 * tree: the input is in the fixed header, which is mounted once in the root
 * layout, and the grid it filters is inside the page. A context provider would
 * mean wrapping the layout in a client component just to carry one string, and
 * lifting the state into the layout would re-render the whole app on every
 * keystroke. A module-level store with useSyncExternalStore re-renders exactly
 * the two components that read it.
 *
 * The hash is folded into the same snapshot rather than read separately. A
 * `/blog#conference` link — which is how the About page's "Explore" buttons
 * arrive — seeds the term, and the filter already matches on category, so no
 * separate category UI is needed. Doing it here means the header's input shows
 * the seeded term too, which it could not if the hash were only read inside the
 * page.
 *
 * No effects anywhere in this file, deliberately. Reading the hash with an
 * effect means calling setState inside an effect, which the react-hooks rules
 * forbid; reading it in a lazy useState initialiser returns '' on the server and
 * the real hash on the client, which is a hydration mismatch. A server snapshot
 * of '' avoids both, and hashchange subscription comes free.
 *
 * Not useSearchParams: a client hook reading search params forces this
 * statically prerendered listing behind a Suspense boundary, and the page would
 * ship its fallback as HTML instead of the articles.
 */

/**
 * Null until someone types, so the hash is in force until then and is then
 * dropped for good — a reader who has started editing the box should not have it
 * overwritten by the URL they arrived on.
 */
let typed: string | null = null;

/** Bumped by the field's submit. See `useBlogSearchSubmit`. */
let submitCount = 0;


const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // Covers back/forward between two hashes, which changes the term without any
  // component doing anything.
  window.addEventListener('hashchange', onChange);

  return () => {
    listeners.delete(onChange);
    window.removeEventListener('hashchange', onChange);
  };
}

function hashQuery() {
  try {
    return decodeURIComponent(window.location.hash.slice(1)).trim();
  } catch {
    // A hand-edited hash can be a malformed escape sequence, which throws.
    return '';
  }
}

/**
 * Strings compare by value, so returning a fresh one each call is safe here —
 * useSyncExternalStore's Object.is check only loops if the snapshot is a new
 * object every time.
 */
const getQuery = () => typed ?? hashQuery();
const getQueryOnServer = () => '';

const getSubmitCount = () => submitCount;
const getSubmitCountOnServer = () => 0;


/** The term in force: what was typed, or the hash it was seeded from. */
export function useBlogSearchQuery() {
  return useSyncExternalStore(subscribe, getQuery, getQueryOnServer);
}

/**
 * A counter, not a boolean, so a second submit of the same term is still a
 * distinct value for the listing's effect to react to.
 */
export function useBlogSearchSubmit() {
  return useSyncExternalStore(
    subscribe,
    getSubmitCount,
    getSubmitCountOnServer,
  );
}

export function setBlogSearchQuery(value: string) {
  typed = value;
  emit();
}

/**
 * Called when the listing unmounts. Without it a term typed before navigating
 * away is still filtering the grid on the way back, and — because `typed` being
 * non-null outranks the hash — a later `/blog#research` link would silently do
 * nothing.
 */
export function resetBlogSearch() {
  if (typed === null && submitCount === 0) return;
  typed = null;
  submitCount = 0;
  emit();
}

export function submitBlogSearch() {
  submitCount += 1;
  emit();
}
