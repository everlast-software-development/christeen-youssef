import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TocItem = { id: string; label: string };

/** The scrolled header (64px) plus 24px: where a sticky rail and a jump land. */
export const STICKY_TOP = 88;

/** Whichever heading is highest in the band below the header is the one being read. */
function useActiveSection(items: TocItem[]) {
  const [active, setActive] = useState(items[0]?.id ?? '');

  useEffect(() => {
    const nodes = items
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));
    if (!nodes.length) return;

    // The band runs from just under the header to a third of the way down.
    // Taking the highest intersecting heading (not the latest to cross) is
    // what keeps the highlight from flickering between two.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: `-${STICKY_TOP}px 0px -66% 0px` },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [items]);

  return active;
}

/**
 * A native, instant jump. It lands STICKY_TOP below the top of the window
 * because <html> carries that as scroll-padding-top (globals.css).
 */
function useJump() {
  return (id: string) => document.getElementById(id)?.scrollIntoView({ block: 'start' });
}

function TocList({
  items,
  active,
  onPick,
}: {
  items: TocItem[];
  active: string;
  onPick: (id: string) => void;
}) {
  return (
    <ul className="m-0 list-none space-y-1 border-l border-line p-0">
      {items.map((item) => {
        const current = item.id === active;
        return (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onPick(item.id)}
              aria-current={current ? 'true' : undefined}
              className={cn(
                'tap-target relative -ml-px block w-full cursor-pointer border-l-2 py-2 pr-2 pl-4 text-left font-body text-[14px] leading-snug transition-colors duration-300',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
                current
                  ? 'border-gold font-medium text-ink'
                  : 'border-transparent text-soft hover-fine:border-ink/20 hover-fine:text-ink',
              )}
            >
              {item.label}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/** Desktop: sticky in the left three columns, the section being read in gold. */
export function ArticleToc({ items }: { items: TocItem[] }) {
  const active = useActiveSection(items);
  const jump = useJump();

  return (
    <nav aria-label="On this page" className="sticky" style={{ top: STICKY_TOP }}>
      <p className="m-0 mb-5 type-eyebrow text-caption-strong">On this page</p>
      <TocList items={items} active={active} onPick={jump} />
    </nav>
  );
}

/** Below lg: the same list folded behind an "On this page" button. */
export function ArticleTocToggle({ items }: { items: TocItem[] }) {
  const [open, setOpen] = useState(false);
  const active = useActiveSection(items);
  const jump = useJump();

  return (
    <nav aria-label="On this page" className="border-y border-line">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="article-toc-list"
        onClick={() => setOpen((value) => !value)}
        className="flex h-12 w-full cursor-pointer items-center justify-between type-eyebrow text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        On this page
        <ChevronDown aria-hidden className={cn('size-4 transition-transform duration-300', open && 'rotate-180')} />
      </button>
      <div id="article-toc-list" hidden={!open} className="pb-4">
        <TocList
          items={items}
          active={active}
          onPick={(id) => {
            setOpen(false);
            jump(id);
          }}
        />
      </div>
    </nav>
  );
}
