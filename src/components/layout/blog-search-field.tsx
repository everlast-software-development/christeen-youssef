'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, X, ArrowUpRight } from 'lucide-react';
import { TransitionLink } from '@/components/ui/transition-link';
import { cn } from '@/lib/utils';
import {
  resetBlogSearch,
  setBlogSearchQuery,
  useBlogSearchQuery,
} from '@/components/layout/blog-search-store';
import { blogPosts } from '@/data/blog';
import { byNewest, formatBlogDate } from '@/lib/blog-date';

/**
 * How many articles the menu lists.
 *
 * A panel hanging off the header is a shortcut, not a results page — past about
 * six rows it stops being something you scan and becomes something you scroll,
 * which is what the listing itself is for. The footer says how many more there
 * are and points at it.
 */
const MAX_RESULTS = 6;

/**
 * The blog search.
 *
 * Typing opens a menu of matching articles under the field, and clicking one
 * goes there. It used to filter the listing grid live instead — which meant the
 * control only did anything on the one route that had a grid, that the thing it
 * changed was a full screen below the fold, and that submitting had to scroll
 * you down to show you what had already happened. A menu answers "which article
 * was that" in one step, and answers it the same way wherever it is shown.
 *
 * Rendered once per breakpoint, because the two copies sit at different points
 * in the DOM — inline in the header row at lg, in its own row below it. That is
 * only safe because the term lives in the store rather than in either input:
 * both read and write the same value, and `display: none` takes the inactive one
 * out of the tab order, so only the visible one can open a menu.
 */
export function BlogSearchField({
  onDark,
  hidden = false,
  className,
}: {
  /** Over a dark surface — the glass shell inverts, as on CtaPill. */
  onDark: boolean;
  /** The open menu panel covers this, so it goes out of the tab order. */
  hidden?: boolean;
  /** Width, and which breakpoint this copy belongs to. */
  className?: string;
}) {
  const pathname = usePathname();
  const query = useBlogSearchQuery();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const inputId = useId();

  // Focus anywhere inside the wrapper, not just in the input — otherwise
  // tabbing from the field into the first result closes the menu out from
  // under the focus that is moving into it.
  const [focused, setFocused] = useState(false);

  // Escape shuts the menu without clearing the box, so the term can be edited
  // rather than retyped. Any further typing brings it back.
  const [dismissed, setDismissed] = useState(false);

  // A term left in the box would still be there on the way back, with its menu
  // ready to open over a page the reader has just arrived at.
  useEffect(() => resetBlogSearch, []);

  const needle = query.trim().toLowerCase();

  const matches = useMemo(() => {
    if (!needle) return [];

    return [...blogPosts]
      .sort(byNewest)
      .filter((post) =>
        [post.title, post.excerpt, post.category].some((field) =>
          field.toLowerCase().includes(needle),
        ),
      );
  }, [needle]);

  const shown = matches.slice(0, MAX_RESULTS);
  const open = focused && !dismissed && !hidden && needle.length > 0;

  // The arrow-key cursor, tagged with the term it was moved through. Tagged
  // rather than reset from an effect: an effect would leave the old row
  // highlighted for a frame after the results underneath it had changed, and
  // setState in an effect body is a cascading render.
  const [cursor, setCursor] = useState({ needle, index: -1 });
  const active = cursor.needle === needle ? cursor.index : -1;

  const go = (index: number) => {
    // Clicked rather than routed by hand, so the anchor's own TransitionLink
    // handler runs and the move is the same page transition every other link on
    // the site makes.
    listRef.current
      ?.querySelector<HTMLAnchorElement>(`[data-index="${index}"]`)
      ?.click();
  };

  if (pathname !== '/blog') return null;

  return (
    <div
      className={cn('relative', className)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setFocused(false);
        }
      }}
    >
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          // Enter takes the highlighted row, or the top one if the reader never
          // touched the arrows — which is the common case, because the first
          // result is usually the one they were typing towards.
          if (shown.length > 0) go(active >= 0 ? active : 0);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            setDismissed(true);
            return;
          }

          if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;

          event.preventDefault();
          const last = shown.length - 1;
          setCursor({
            needle,
            index:
              event.key === 'ArrowDown'
                ? Math.min(active + 1, last)
                : Math.max(active - 1, -1),
          });
        }}
        className={cn(
          // Gold on the border and in the shadow at rest, not only on focus.
          // This is the one control on the page and it sits over a full-height
          // photograph, where the neutral glass the other pills use disappeared
          // into it. The ring sits outside the border box, so the
          // overflow-hidden here does not clip it.
          //
          // The menu is a sibling of this form, not a child, because this clips
          // to a pill and a panel hanging below it would be cut off at the
          // border radius.
          'relative flex h-12 w-full items-center overflow-hidden rounded-full border transition-[background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-within:ring-4',
          onDark
            ? 'border-gold/45 bg-ink/45 shadow-[0_10px_30px_-18px_rgba(201,153,40,0.85)] backdrop-blur-xl focus-within:border-gold focus-within:bg-ink/60 focus-within:ring-gold/20'
            : 'border-gold/50 bg-white/75 shadow-[0_10px_28px_-20px_rgba(201,153,40,0.9)] backdrop-blur-xl focus-within:border-gold focus-within:bg-white focus-within:ring-gold/15',
          hidden && 'pointer-events-none opacity-0',
        )}
      >
        <label htmlFor={inputId} className="sr-only">
          Search articles
        </label>

        {/* Not a toggle — the field is already open. It stays a button so the
            magnifier is a target as well as a mark: a 48px square is easier to
            hit than the text baseline beside it. Out of the tab order and hidden
            from assistive tech, because it does nothing the input does not. */}
        <button
          type="button"
          onClick={() => inputRef.current?.focus()}
          tabIndex={-1}
          aria-hidden
          className={cn(
            'grid size-12 shrink-0 cursor-text place-items-center rounded-full',
            onDark ? 'text-gold' : 'text-gold-dark',
          )}
        >
          <Search className="size-[1.05rem]" />
        </button>

        <input
          id={inputId}
          ref={inputRef}
          // `search` gives iOS the magnifier key on the software keyboard.
          type="search"
          value={query}
          onChange={(event) => {
            setBlogSearchQuery(event.target.value);
            setDismissed(false);
          }}
          placeholder="Search articles"
          autoComplete="off"
          tabIndex={hidden ? -1 : 0}
          className={cn(
            // min-w-0 so the input yields to the shell rather than forcing it
            // wider at its own intrinsic width.
            'min-w-0 flex-1 bg-transparent pr-2 font-body text-base tracking-[0.02em] outline-none lg:text-sm',
            // The native clear cross is a fixed grey that reads as a smudge on
            // ink; the button below replaces it.
            '[&::-webkit-search-cancel-button]:hidden',
            onDark
              ? 'text-cream placeholder:text-cream/60'
              : 'text-ink placeholder:text-slate/75',
          )}
        />

        {query.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setBlogSearchQuery('');
              inputRef.current?.focus();
            }}
            tabIndex={hidden ? -1 : 0}
            aria-label="Clear search"
            className={cn(
              'mr-2 grid size-7 shrink-0 cursor-pointer place-items-center rounded-full transition-colors duration-300',
              onDark
                ? 'bg-cream/10 text-cream/70 hover:bg-gold hover:text-ink'
                : 'bg-ink/5 text-slate hover:bg-gold hover:text-ink',
            )}
          >
            <X aria-hidden className="size-3.5" />
          </button>
        )}
      </form>

      {open && (
        // Full width of the row below lg, where the field has a line to itself.
        // At lg the field is only 16–20rem in the header's right cluster, which
        // is too narrow to read a conference-paper title in, so the panel widens
        // and hangs back from the right edge instead.
        <div
          className={cn(
            'absolute top-full z-50 mt-2 overflow-hidden rounded-2xl border border-ink/10 bg-cream shadow-[0_24px_60px_-24px_rgba(26,26,26,0.45)]',
            'right-0 left-0 lg:left-auto lg:w-[26rem]',
          )}
        >
          {shown.length === 0 ? (
            <p className="px-5 py-6 font-body text-[0.9rem]/relaxed text-slate">
              Nothing matches &ldquo;{query.trim()}&rdquo;. Try a treatment, a
              conference, or a year.
            </p>
          ) : (
            <>
              <ul ref={listRef} className="max-h-[26rem] overflow-y-auto p-2">
                {shown.map((post, index) => (
                  <li key={post.slug}>
                    <TransitionLink
                      href={`/blog/${post.slug}`}
                      data-index={index}
                      onPointerEnter={() => setCursor({ needle, index })}
                      className={cn(
                        'flex items-center gap-3.5 rounded-xl p-2.5 transition-colors duration-200',
                        index === active ? 'bg-gold/12' : 'hover:bg-ink/4',
                      )}
                    >
                      <span className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-cream-dark">
                        <Image
                          src={post.image}
                          alt=""
                          fill
                          sizes="48px"
                          placeholder="blur"
                          className="object-cover"
                        />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block font-body text-[0.62rem] tracking-[0.16em] text-gold-dark uppercase">
                          {post.category}
                          <span aria-hidden className="mx-1.5 text-ink/20">
                            &middot;
                          </span>
                          <span className="tracking-[0.1em] text-slate/70">
                            {formatBlogDate(post.date)}
                          </span>
                        </span>

                        {/* Clamped rather than cut at a character count: these
                            titles run to conference-paper length and a hard cut
                            lands mid-word. */}
                        <span className="mt-1 line-clamp-2 block font-body text-[0.88rem]/snug font-medium text-ink">
                          {post.title}
                        </span>
                      </span>

                      <ArrowUpRight
                        aria-hidden
                        className="size-4 shrink-0 text-slate/40"
                      />
                    </TransitionLink>
                  </li>
                ))}
              </ul>

              {matches.length > shown.length && (
                <p className="border-t border-ink/8 px-5 py-3 font-body text-[0.75rem] tracking-[0.08em] text-slate/70">
                  {matches.length - shown.length} more below
                </p>
              )}
            </>
          )}

          {/* The count, not the rows — a screen reader gets the rows by tabbing
              into them, and having each keystroke read out six titles is worse
              than useless. */}
          <p aria-live="polite" className="sr-only">
            {matches.length} {matches.length === 1 ? 'article' : 'articles'}{' '}
            match {query.trim()}
          </p>
        </div>
      )}
    </div>
  );
}
