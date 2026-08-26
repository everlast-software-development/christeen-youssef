'use client';

import { useId, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  setBlogSearchQuery,
  submitBlogSearch,
  useBlogSearchQuery,
} from '@/components/layout/blog-search-store';

/**
 * The blog search.
 *
 * Only on the listing itself — on an article or any other route there is no grid
 * for it to filter, and a search box that navigates somewhere to do its work is a
 * different feature from this one.
 *
 * Always a field, never a button that turns into one. It used to be a 48px
 * circle that expanded on tap, and that one decision cost: a toggle flag in the
 * store, a width measured against the viewport, and the logo having to collapse
 * out of the way to make room — three moving parts competing for a phone header
 * row that also carries a fixed menu pill. Every mobile bug in this header came
 * from that. The header gives it a row of its own below lg now, where it fits
 * without anything having to move.
 *
 * Rendered once per breakpoint, because the two copies sit at different points
 * in the DOM — inline in the header row at lg, in its own row below it. That is
 * only safe because the term lives in the store rather than in either input:
 * both read and write the same value, and `display: none` takes the inactive one
 * out of the tab order for nothing.
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
  const inputId = useId();

  if (pathname !== '/blog') return null;

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();

        // Filtering is live, so submitting is not what runs the search. The
        // carousel is a full screen tall, so this is what takes you down to the
        // results that a term typed up here has already changed.
        submitBlogSearch();
        inputRef.current?.blur();
      }}
      className={cn(
        // Gold on the border and in the shadow at rest, not only on focus. This
        // is the one control on the page and it sits over a full-height
        // photograph, where the neutral glass the other pills use disappeared
        // into it. The ring sits outside the border box, so the overflow-hidden
        // here does not clip it.
        'relative flex h-12 items-center overflow-hidden rounded-full border transition-[background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-within:ring-4',
        onDark
          ? 'border-gold/45 bg-ink/45 shadow-[0_10px_30px_-18px_rgba(201,153,40,0.85)] backdrop-blur-xl focus-within:border-gold focus-within:bg-ink/60 focus-within:ring-gold/20'
          : 'border-gold/50 bg-white/75 shadow-[0_10px_28px_-20px_rgba(201,153,40,0.9)] backdrop-blur-xl focus-within:border-gold focus-within:bg-white focus-within:ring-gold/15',
        hidden && 'pointer-events-none opacity-0',
        className,
      )}
    >
      <label htmlFor={inputId} className="sr-only">
        Search articles
      </label>

      {/* Not a toggle any more — the field is already open. It stays a button so
          the magnifier is a target as well as a mark: a 48px square is easier to
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
        onChange={(event) => setBlogSearchQuery(event.target.value)}
        placeholder="Search articles"
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
  );
}
