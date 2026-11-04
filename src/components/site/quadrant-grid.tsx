import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type Quadrant = { title: string; body: string; label: string; icon: ReactNode };

/** Stroke settings shared by the icons that sit in the quadrants' circles. */
export const QUADRANT_ICON = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

// Hairline cross between the quadrants; a single column below 640px.
const EDGE = [
  'min-[641px]:border-r min-[641px]:border-b',
  'min-[641px]:border-b',
  'min-[641px]:border-r',
  '',
];

/**
 * The frosted 2×2 panel from the home page's Signature focus: four quadrants
 * on ink, each an icon in a thin gold circle (filled gold on hover), a small
 * gold label, a display title and a line of body text. On hover the circle
 * fills gold-deep and the icon turns white.
 */
export function QuadrantGrid({
  items,
  headingLevel: Heading = 'h3',
  className,
}: {
  items: Quadrant[];
  headingLevel?: 'h3' | 'h4';
  className?: string;
}) {
  return (
    <ul
      className={cn(
        'scroll-stagger m-0 grid list-none grid-cols-1 rounded-[20px] border border-white/12 bg-white/[0.03] p-0 backdrop-blur-[10px] min-[641px]:grid-cols-2',
        className,
      )}
    >
      {items.map((item, i) => (
        <li
          key={item.title}
          className={cn(
            'group relative flex flex-col gap-3 border-white/12 p-[clamp(24px,2.6vw,34px)] transition-colors duration-[350ms] max-[640px]:border-b hover-fine:bg-white/[0.04]',
            EDGE[i],
          )}
        >
          <span className="inline-flex size-[52px] items-center justify-center rounded-full border border-[rgba(217,181,102,0.45)] text-gold-light transition-colors duration-[350ms] group-hover-fine:bg-gold-deep group-hover-fine:text-white">
            {item.icon}
          </span>
          <span className="text-[12.5px] font-semibold text-gold-light">{item.label}</span>
          <Heading className="m-0 font-display text-[23px] leading-[1.2] font-medium text-white">
            {item.title}
          </Heading>
          <p className="m-0 text-[14px]/[1.6] text-[#B9B1A3]">{item.body}</p>
        </li>
      ))}
    </ul>
  );
}
