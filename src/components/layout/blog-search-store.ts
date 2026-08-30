'use client';

import { useSyncExternalStore } from 'react';

/**
 * Two separate things that used to be one string.
 *
 * **The typed term** belongs to the header field, which now opens a menu of
 * matching articles rather than filtering the page underneath it. It is held
 * outside React because the field is rendered twice — once inline in the header
 * row at lg, once in its own row below that — and the two copies have to agree.
 * A context provider would mean wrapping the layout in a client component just
 * to carry one string; lifting it into the layout would re-render the whole app
 * on every keystroke. A module-level store with useSyncExternalStore re-renders
 * exactly the components that read it.
 *
 * **The hash** belongs to the listing. A `/blog#conference` link — which is how
 * the About page's three Explore buttons arrive — filters the grid by category.
 * That is a deep link into the page, and it survived the header field becoming a
 * menu: the two were only ever folded into one snapshot because the field used
 * to filter the same grid the hash does. Now that it does not, a term typed in
 * the header no longer silently outranks the URL the reader arrived on.
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

let typed = '';

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // Covers back/forward between two hashes, which changes the filter without
  // any component doing anything.
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
const getTyped = () => typed;
const getHash = () => hashQuery();
const getEmpty = () => '';

/** What is in the header field. Drives its menu, and nothing else. */
export function useBlogSearchQuery() {
  return useSyncExternalStore(subscribe, getTyped, getEmpty);
}

/** The category deep-link in the URL. Drives the listing grid, and nothing else. */
export function useBlogHashFilter() {
  return useSyncExternalStore(subscribe, getHash, getEmpty);
}

/**
 * Drops the category deep-link and shows the whole listing again.
 *
 * Not a `<Link href="/blog">`: Next routes with `history.pushState`, which does
 * not fire `hashchange`, so the store would never hear that the filter had gone
 * and the grid would stay filtered under a clean URL. Rewriting the URL here and
 * emitting by hand keeps the two in step — which is also why this lives in the
 * store rather than at the call site.
 */
export function clearBlogHashFilter() {
  window.history.replaceState(null, '', window.location.pathname);
  emit();
}

export function setBlogSearchQuery(value: string) {
  typed = value;
  emit();
}

/**
 * Called when the field unmounts. A term left behind would still be in the box
 * on the way back, with its menu ready to open over a page the reader has just
 * arrived at.
 */
export function resetBlogSearch() {
  if (!typed) return;
  typed = '';
  emit();
}
