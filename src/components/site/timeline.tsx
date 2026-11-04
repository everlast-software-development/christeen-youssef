import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { cn } from '@/lib/utils';

export type TimelineItem = { year: string; title: string; place?: string; body: string };

/**
 * A dated row of events on ink with a gold line that draws itself as the
 * section scrolls: four across from lg (the line runs along the dots), one
 * column below it (the line runs down the left). Each item lights up — dot,
 * year, then title and text — the moment the gold reaches its dot, and goes
 * dark again on the way back up.
 *
 * The markup is the finished state — line drawn, every dot gold, all text
 * visible — so without JavaScript or with reduced motion nothing is hidden.
 * The scroll timeline drives only the line's scale; the per-item states are
 * opacity / transform transitions keyed off `data-on`, so they keep their
 * 300 / 500ms timings while the line follows the scroll.
 */
export function Timeline({
  items,
  headingLevel: Heading = 'h4',
  className,
}: {
  items: TimelineItem[];
  headingLevel?: 'h3' | 'h4';
  className?: string;
}) {
  const root = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const list = root.current;
      if (!list) return;
      const track = list.querySelector<HTMLElement>('[data-track]')!;
      const progress = list.querySelector<HTMLElement>('[data-progress]')!;
      const rows = gsap.utils.toArray<HTMLElement>('[data-item]', list);
      const dots = rows.map((row) => row.querySelector<HTMLElement>('[data-dot]')!);

      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: '(min-width: 1024px)',
          mobile: '(max-width: 1023.98px)',
          reduce: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { desktop, reduce } = context.conditions as Record<string, boolean>;
          if (reduce) return;

          const axis = desktop ? 'x' : 'y';
          let stops: number[] = [];

          // Where each dot sits along the track, as a fraction of its length.
          const measure = () => {
            const t = track.getBoundingClientRect();
            stops = dots.map((dot) => {
              const d = dot.getBoundingClientRect();
              const centre = axis === 'x' ? d.left + d.width / 2 - t.left : d.top + d.height / 2 - t.top;
              const length = axis === 'x' ? t.width : t.height;
              return gsap.utils.clamp(0, 1, centre / Math.max(length, 1));
            });
          };

          const light = (amount: number) => {
            rows.forEach((row, i) => {
              row.dataset.on = amount >= stops[i] - 0.001 ? 'true' : 'false';
            });
          };

          measure();
          light(0);

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: list,
              start: 'top 75%',
              end: 'bottom 60%',
              scrub: 0.6,
              invalidateOnRefresh: true,
              onRefresh: measure,
            },
            onUpdate: () => light(tl.progress()),
          });
          tl.fromTo(
            progress,
            axis === 'x' ? { scaleX: 0, scaleY: 1 } : { scaleY: 0, scaleX: 1 },
            { scaleX: 1, scaleY: 1, ease: 'none', duration: 1 },
          );

          return () => {
            rows.forEach((row) => delete row.dataset.on);
          };
        },
      );

      // Webfonts change line heights, and so every position measured above.
      let alive = true;
      document.fonts?.ready.then(() => alive && ScrollTrigger.refresh());

      return () => {
        alive = false;
        mm.revert();
      };
    },
    { scope: root },
  );

  return (
    <ol
      ref={root}
      className={cn('relative m-0 grid list-none gap-10 p-0 lg:grid-cols-4 lg:gap-8', className)}
    >
      {/* Track and progress: down the left from the first dot on phones,
          along the dot row (48px year + half the 24px dot row) from lg. */}
      {(['track', 'progress'] as const).map((layer) => (
        <span
          key={layer}
          aria-hidden
          {...(layer === 'track' ? { 'data-track': '' } : { 'data-progress': '' })}
          className={cn(
            'pointer-events-none absolute top-6 bottom-0 left-[4px] w-px lg:top-[60px] lg:right-0 lg:bottom-auto lg:h-px lg:w-auto',
            layer === 'track' ? 'bg-white/13' : 'origin-top bg-gold lg:origin-left',
          )}
        />
      ))}

      {items.map((item, index) => (
        <li key={`${item.title}-${index}`} data-item className="group relative pl-8 lg:pl-0">
          {/* Year: a dim white layer and a gold one, cross-faded. */}
          <p className="relative m-0 font-display text-[40px] leading-[48px]">
            <span className="text-white/40 opacity-0 transition-opacity duration-500 group-data-[on=false]:opacity-35">
              {item.year}
            </span>
            <span
              aria-hidden
              className="absolute inset-0 text-gold-light transition-opacity duration-500 group-data-[on=false]:opacity-0"
            >
              {item.year}
            </span>
          </p>

          {/* Dot row: a fixed 24px band whose centre is the line. */}
          <span
            aria-hidden
            className="absolute top-[19.5px] left-0 flex size-[9px] items-center justify-center lg:static lg:h-6 lg:w-auto lg:justify-start"
          >
            <span data-dot className="relative block size-[9px]">
              <span className="absolute inset-0 rounded-full border border-white/30 bg-ink" />
              <span className="absolute inset-0 rounded-full bg-gold shadow-[0_0_0_6px_rgba(184,137,42,0.18)] transition-[opacity,scale] duration-300 ease-[cubic-bezier(.2,.7,.2,1.4)] group-data-[on=false]:scale-60 group-data-[on=false]:opacity-0" />
            </span>
          </span>

          <Heading className="mt-3 type-h3 text-white transition-[opacity,translate] duration-500 ease-[var(--ease-brand)] group-data-[on=false]:translate-y-4 group-data-[on=false]:opacity-0 lg:mt-4">
            {item.title}
            {item.place && <span className="text-white/60"> · {item.place}</span>}
          </Heading>
          <p className="mt-2.5 type-small text-[#B9B1A3] transition-[opacity,translate] delay-[80ms] duration-500 ease-[var(--ease-brand)] group-data-[on=false]:translate-y-4 group-data-[on=false]:opacity-0">
            {item.body}
          </p>
        </li>
      ))}
    </ol>
  );
}
