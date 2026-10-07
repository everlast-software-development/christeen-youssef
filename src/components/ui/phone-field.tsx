'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from 'react';
import Image from 'next/image';
import { Check, ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { countries, getFlagImageUrl, type Country } from '@/data/countries';

/**
 * A phone number with the country picked separately.
 *
 * Two controls in one shell rather than one box the reader has to type `+971`
 * into. The dial code is a choice from a known list, so it is offered as one —
 * which also means the number that reaches the inbox is unambiguous. A bare
 * "050 123 4567" from a form with an international audience could be half a
 * dozen countries.
 *
 * The number input is left uncontrolled and simply takes whatever props it is
 * handed, so react-hook-form can `register()` straight into it. Only the country
 * is state, and it lives in the parent — the form has to compose the two halves
 * when it submits, so it is the one that needs to hold the country anyway.
 */
export function PhoneField({
  country,
  onCountryChange,
  invalid = false,
  inputProps,
  id,
}: {
  country: Country;
  onCountryChange: (country: Country) => void;
  invalid?: boolean;
  /** Spread onto the number input — typically `register('phone')`. */
  inputProps?: ComponentPropsWithoutRef<'input'>;
  id?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return countries;

    // The dial code is searched with and without its `+`, because people type
    // it both ways and "971" finding nothing would look broken.
    return countries.filter(
      (entry) =>
        entry.name.toLowerCase().includes(needle) ||
        entry.dialCode.includes(needle) ||
        entry.dialCode.slice(1).startsWith(needle.replace(/^\+/, '')) ||
        entry.code.toLowerCase() === needle,
    );
  }, [query]);

  // The keyboard cursor, tagged with the term it was moved through — so a new
  // search starts at the top without an effect having to reset it.
  const [cursor, setCursor] = useState({ query, index: 0 });
  const active = cursor.query === query ? cursor.index : 0;

  useEffect(() => {
    if (!open) return;
    searchRef.current?.focus();
  }, [open]);

  // Keep the highlighted row in view as the arrows walk past the fold.
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [open, active]);

  const choose = (entry: Country) => {
    onCountryChange(entry);
    setOpen(false);
    setQuery('');
  };

  return (
    // Focus is tracked on the wrapper rather than on either control, so moving
    // between the trigger, the search box and the list does not close the menu
    // out from under the focus that is moving into it.
    <div
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false);
          setQuery('');
        }
      }}
    >
      {/* One shell around both controls, so the pair reads as a single field
          and the focus ring belongs to the whole of it rather than to whichever
          half happens to be focused. */}
      <div
        className={cn(
          'flex h-11 items-center rounded-xl border bg-cream/5 transition-colors focus-within:border-gold focus-within:ring-[3px] focus-within:ring-gold/25',
          invalid ? 'border-red-400/60' : 'border-cream/15',
        )}
      >
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={`Country code: ${country.name} ${country.dialCode}`}
          className="flex h-full shrink-0 cursor-pointer items-center gap-2 rounded-l-xl pr-2.5 pl-3.5 text-cream transition-colors hover:bg-cream/5 focus-visible:outline-none"
        >
          <Image
            src={getFlagImageUrl(country.code)}
            alt=""
            width={20}
            height={14}
            className="h-[0.875rem] w-5 shrink-0 rounded-[2px] object-cover"
          />
          <span className="font-body text-sm text-cream/90 tabular-nums">
            {country.dialCode}
          </span>
          <ChevronDown
            aria-hidden
            className={cn(
              'size-3.5 text-cream/45 transition-transform duration-300',
              open && 'rotate-180',
            )}
          />
        </button>

        <span aria-hidden className="h-5 w-px shrink-0 bg-cream/15" />

        <input
          id={id}
          type="tel"
          inputMode="tel"
          // `tel-national`, not `tel`: the country is its own control, so the
          // browser should fill this with the national part only.
          autoComplete="tel-national"
          aria-invalid={invalid}
          placeholder="50 123 4567"
          {...inputProps}
          className="h-full min-w-0 flex-1 rounded-r-xl bg-transparent px-3.5 font-body text-base text-cream outline-none placeholder:text-cream/35 md:text-sm"
        />
      </div>

      {open && (
        <div className="absolute top-full left-0 z-50 mt-2 w-[min(22rem,calc(100vw-3rem))] overflow-hidden rounded-xl border border-cream/15 bg-ink shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)]">
          <div className="flex items-center gap-2.5 border-b border-cream/10 px-3.5 py-2.5">
            <Search aria-hidden className="size-4 shrink-0 text-cream/40" />
            <input
              ref={searchRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  setOpen(false);
                  setQuery('');
                  return;
                }

                if (event.key === 'Enter') {
                  event.preventDefault();
                  if (matches[active]) choose(matches[active]);
                  return;
                }

                if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;

                event.preventDefault();
                setCursor({
                  query,
                  index:
                    event.key === 'ArrowDown'
                      ? Math.min(active + 1, matches.length - 1)
                      : Math.max(active - 1, 0),
                });
              }}
              placeholder="Search country or code"
              aria-label="Search country or code"
              className="min-w-0 flex-1 bg-transparent font-body text-sm text-cream outline-none placeholder:text-cream/35"
            />
          </div>

          <div
            ref={listRef}
            role="listbox"
            aria-label="Country"
            // Lenis owns the page's wheel and touch events and cancels the
            // native scroll, so a nested scroller gets nothing and sits there
            // frozen while the page moves behind it. This is Lenis's own
            // opt-out: events inside are left alone and the browser scrolls
            // this element normally.
            data-lenis-prevent
            className="max-h-64 overflow-y-auto overscroll-contain py-1"
          >
            {matches.length === 0 ? (
              <p className="px-4 py-6 text-center font-body text-sm text-cream/50">
                No country matches &ldquo;{query.trim()}&rdquo;.
              </p>
            ) : (
              matches.map((entry, index) => {
                const selected = entry.code === country.code;

                return (
                  <button
                    key={entry.code}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    data-index={index}
                    onClick={() => choose(entry)}
                    onPointerEnter={() => setCursor({ query, index })}
                    className={cn(
                      'flex w-full cursor-pointer items-center gap-3 px-3.5 py-2 text-left transition-colors',
                      index === active ? 'bg-cream/10' : 'bg-transparent',
                    )}
                  >
                    <Image
                      src={getFlagImageUrl(entry.code)}
                      alt=""
                      width={20}
                      height={14}
                      loading="lazy"
                      className="h-[0.875rem] w-5 shrink-0 rounded-[2px] object-cover"
                    />

                    <span className="min-w-0 flex-1 truncate font-body text-sm text-cream/85">
                      {entry.name}
                    </span>

                    <span className="shrink-0 font-body text-xs text-cream/45 tabular-nums">
                      {entry.dialCode}
                    </span>

                    {selected && (
                      <Check aria-hidden className="size-3.5 shrink-0 text-gold" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
