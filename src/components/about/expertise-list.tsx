'use client';

import { useRef, useState, type ReactNode } from 'react';
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '@/lib/gsap';
import type { Discipline } from '@/data/about';
import { cn } from '@/lib/utils';

/**
 * static  — server render / no JS: every row fully visible, numbers gold.
 * live    — desktop with motion: one row active at a time, the rest dimmed.
 * reduced — prefers-reduced-motion: like static, indicator fixed on the last.
 */
type Mode = 'static' | 'live' | 'reduced';

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Areas of expertise. On desktop the heading column sticks while the five
 * rows scroll past; the row crossing the middle of the screen is the active
 * one — its number turns gold, a gold rule draws along its top edge and its
 * title steps right — and the big indicator under the heading follows it.
 * Hovering a row previews it. Below 1024px it is a plain hairline list.
 */
export function ExpertiseList({ items, heading }: { items: Discipline[]; heading: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const rows = useRef<(HTMLLIElement | null)[]>([]);
  const [mode, setMode] = useState<Mode>('static');
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        setMode('reduced');
        return;
      }

      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px)', () => {
        setMode('live');
        rows.current.forEach((row, i) => {
          if (!row) return;
          ScrollTrigger.create({
            trigger: row,
            start: 'top center',
            end: 'bottom center',
            onToggle: (self) => self.isActive && setActive(i),
          });
        });
        return () => setMode('static');
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const live = mode === 'live';
  const shown = mode === 'reduced' ? items.length - 1 : live ? (hovered ?? active) : 0;
  const current = items[shown];

  return (
    <div
      ref={root}
      className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-6"
    >
      <div className="lg:sticky lg:top-[120px] lg:col-span-5 lg:self-start">
        {heading}

        {/* The active-item indicator — desktop only, and a mirror of the list,
            so it is hidden from assistive tech. */}
        <div aria-hidden className="mt-12 hidden lg:block">
          <p className="m-0 flex items-baseline gap-3">
            <span
              key={`n-${shown}`}
              className={cn(
                'inline-block font-display text-[clamp(5rem,9vw,8rem)] leading-[0.9] text-gold italic',
                live && 'animate-swap',
              )}
            >
              {current.index}
            </span>
            <span className="type-small text-caption-strong">/ {pad(items.length)}</span>
          </p>
          <p
            key={`t-${shown}`}
            className={cn('type-eyebrow m-0 mt-3 text-caption-strong', live && 'animate-swap')}
          >
            {current.title}
          </p>
          <div className="mt-6 h-0.5 w-full max-w-[280px] bg-line">
            <div
              className="h-full origin-left bg-gold transition-transform duration-[600ms] ease-[var(--ease-brand)]"
              style={{ transform: `scaleX(${(shown + 1) / items.length})` }}
            />
          </div>
        </div>
      </div>

      <ol
        className="m-0 list-none p-0 lg:col-span-6 lg:col-start-7"
        onMouseLeave={() => setHovered(null)}
      >
        {items.map((item, i) => {
          const on = live && i === shown;
          const dim = live && !on;
          return (
            <li
              key={item.index}
              ref={(el) => {
                rows.current[i] = el;
              }}
              onMouseEnter={() => live && setHovered(i)}
              className="relative grid grid-cols-[64px_minmax(0,1fr)] items-baseline border-t border-line py-8 last:border-b"
            >
              <span
                aria-hidden
                className={cn(
                  'absolute -top-px left-0 hidden h-0.5 w-full origin-left bg-gold transition-transform duration-[600ms] ease-[var(--ease-brand)] lg:block',
                  on ? 'scale-x-100' : 'scale-x-0',
                )}
              />
              <span
                className={cn(
                  'type-h3 transition-colors duration-500',
                  dim ? 'text-caption-strong' : 'text-gold-text',
                )}
              >
                {item.index}
              </span>
              <div>
                <h3
                  className={cn(
                    'm-0 type-h3 text-text transition-[translate,opacity] duration-500 ease-[var(--ease-brand)]',
                    on && 'translate-x-2',
                    dim && 'opacity-70',
                  )}
                >
                  {item.title}
                </h3>
                <p
                  className={cn(
                    'mt-3 max-w-[52ch] type-body text-pretty text-soft transition-opacity duration-500',
                    dim && 'opacity-55',
                  )}
                >
                  {item.body}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
