'use client';

import { useEffect, useState } from 'react';
import { useLenis } from 'lenis/react';

type TocItem = { id: string; label: string };

/**
 * Sticky contents for the long pieces. The ISDS talk runs to ten sections and
 * the consensus paper carries thirty-six references — at that length a reader
 * needs to see the shape of the thing before committing to it.
 *
 * Rendered only from xl up, and only when there is enough to justify it (see
 * TOC_MIN_ITEMS at the call site): three links in a sidebar is furniture.
 */
export function ArticleToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? '');
  const lenis = useLenis();

  useEffect(() => {
    const nodes = items
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));

    if (!nodes.length) return;

    // The band is the top of the viewport below the header down to a third of
    // the way in. Whatever heading is highest inside it is the one being read —
    // taking the first intersecting entry avoids the flicker you get from
    // tracking whichever heading crossed the line most recently.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          );

        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-96px 0px -66% 0px' },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [items]);

  const jump = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;

    // Through Lenis where it is driving, so the jump is smoothed like every
    // other move on the site instead of fighting it.
    if (lenis) lenis.scrollTo(target, { offset: -96 });
    else target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      aria-label="On this page"
      className="sticky top-28 hidden self-start xl:block"
    >
      <p className="font-body text-[0.68rem] tracking-[0.2em] text-slate/70 uppercase">
        On this page
      </p>

      <ul className="mt-6 space-y-1 border-l border-ink/10">
        {items.map((item) => {
          const current = item.id === active;

          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => jump(item.id)}
                aria-current={current ? 'true' : undefined}
                className={`-ml-px block w-full cursor-pointer border-l-2 py-2 pr-2 pl-4 text-left font-body text-[0.82rem]/snug transition-colors duration-300 ${
                  current
                    ? 'border-gold text-ink'
                    : 'border-transparent text-slate hover:border-ink/20 hover:text-ink'
                }`}
              >
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
