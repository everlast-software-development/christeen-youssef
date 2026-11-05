import { BUTTON_RADIUS } from '@/components/site/button';
import { cn } from '@/lib/utils';

export type FilterOption = { value: string; label: string };

/**
 * A chip on ink. Also used outside the filters as a plain label (an article's
 * category), so the two always look alike.
 */
export const filterChip = (selected: boolean) =>
  cn(
    'tap-target relative inline-flex h-9 shrink-0 items-center border px-4 type-small font-medium whitespace-nowrap transition-colors duration-200',
    BUTTON_RADIUS,
    selected ? 'border-transparent bg-gold-deep text-white' : 'border-white/13 text-white/72',
  );

/**
 * A row of filter chips on ink: "All" first, then one per option, the active
 * one gold-deep. One row always — it scrolls sideways on phones with soft
 * edges and centres once it fits. Used by the Blog and Before & After heroes.
 */
export function FilterChips({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: FilterOption[];
  /** The active option's value; '' is "All". */
  value: string;
  onChange: (value: string) => void;
  /** The nav's accessible name, e.g. "Filter by category". */
  label: string;
  className?: string;
}) {
  const chip = (selected: boolean) =>
    cn(
      filterChip(selected),
      'cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
      !selected && 'hover-fine:border-white/30 hover-fine:text-white',
    );

  return (
    <nav
      aria-label={label}
      className={cn(
        'no-scrollbar -mx-[var(--gutter)] w-[calc(100%+2*var(--gutter))] overflow-x-auto [mask-image:linear-gradient(90deg,transparent,#000_24px,#000_calc(100%-24px),transparent)] md:[mask-image:none]',
        className,
      )}
    >
      <ul className="mx-auto flex w-max list-none gap-2 p-0 px-[var(--gutter)]">
        <li>
          <button type="button" aria-pressed={!value} onClick={() => onChange('')} className={chip(!value)}>
            All
          </button>
        </li>
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <li key={option.value}>
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => onChange(selected ? '' : option.value)}
                className={chip(selected)}
              >
                {option.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
