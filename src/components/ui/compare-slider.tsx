'use client';

import Image, { type StaticImageData } from 'next/image';
import { useRef, useState } from 'react';
import { ChevronsLeftRight } from 'lucide-react';
import { gsap, useGSAP } from '@/lib/gsap';

type CompareSliderProps = {
  before: StaticImageData;
  after: StaticImageData;
  /** Used to build both alt strings and the control's accessible name. */
  label: string;
  /** Position in the grid — drives the stagger across each row. */
  index: number;
  /** Only the first card or two should fetch eagerly. */
  priority?: boolean;
};

/** Columns in the grid at lg. Only used to stagger a row, never for layout. */
const COLUMNS = 2;

/**
 * Before/after wipe. The after image is the base layer and the before image is
 * clipped over it, so the divider is simply the clip edge — nothing has to be
 * kept in sync and there is no seam to line up.
 *
 * The control is a real `<input type="range">` stretched over the frame and
 * hidden with opacity. That is deliberate: drag, click-to-jump, touch, arrow
 * keys, Home/End and the ARIA slider semantics all come from the platform,
 * where a div with pointer handlers would have to reimplement each one and
 * would still be invisible to assistive tech.
 */
export function CompareSlider({
  before,
  after,
  label,
  index,
  priority = false,
}: CompareSliderProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [reveal, setReveal] = useState(50);

  useGSAP(
    () => {
      // Staggered along the row rather than down the page: the cards arrive two
      // at a time, and a stagger keyed to the flat index would make the second
      // column of the last row wait on every card above it.
      const delay = (index % COLUMNS) * 0.12;

      const arrival = {
        trigger: rootRef.current,
        start: 'top 85%',
        once: true,
      } as const;

      gsap.from(rootRef.current, {
        y: 34,
        opacity: 0,
        scale: 0.97,
        duration: 1.3,
        ease: 'power3.out',
        delay,
        scrollTrigger: arrival,
      });
    },
    { scope: rootRef, dependencies: [index] },
  );

  return (
    <figure ref={rootRef} className="group">
      <div className="relative aspect-9/10 w-full overflow-hidden rounded-2xl bg-cream-dark">
        <Image
          src={after}
          alt={`${label}, after treatment`}
          fill
          sizes="(min-width: 768px) 46vw, 92vw"
          placeholder="blur"
          priority={priority}
          className="object-cover"
        />

        {/* The clip is the wipe. `inset()` trims from the right, so the before
            image survives only up to the divider. */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - reveal}% 0 0)` }}
        >
          <Image
            src={before}
            alt={`${label}, before treatment`}
            fill
            sizes="(min-width: 768px) 46vw, 92vw"
            placeholder="blur"
            priority={priority}
            className="object-cover"
          />
        </div>

        {/* Both stay put rather than fading with the wipe: they label the two
            halves of the frame, not whatever happens to be under them. */}
        <span className="pointer-events-none absolute top-4 left-4 z-10 rounded-full bg-ink/55 px-3 py-1 font-body text-[0.62rem] tracking-[0.18em] text-cream/90 uppercase backdrop-blur-sm">
          Before
        </span>
        <span className="pointer-events-none absolute top-4 right-4 z-10 rounded-full bg-ink/55 px-3 py-1 font-body text-[0.62rem] tracking-[0.18em] text-cream/90 uppercase backdrop-blur-sm">
          After
        </span>

        {/* First in the DOM so the handle below can react to its focus. */}
        <input
          type="range"
          min={0}
          max={100}
          step={0.1}
          value={reveal}
          onChange={(event) => setReveal(Number(event.target.value))}
          aria-label={`${label} — drag to compare before and after`}
          // The thumb is collapsed to 1px so the value maps almost exactly to
          // the pointer's x position. A default thumb reserves half its width
          // at each end, which would stop the divider reaching either edge.
          className="peer absolute inset-0 z-30 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0 [&::-moz-range-thumb]:h-full [&::-moz-range-thumb]:w-px [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-transparent [&::-webkit-slider-thumb]:h-full [&::-webkit-slider-thumb]:w-px [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-transparent"
        />

        {/* Pointer-events-none throughout: the input above owns every gesture,
            and the handle only has to be looked at. */}
        <div
          aria-hidden
          style={{ left: `${reveal}%` }}
          className="pointer-events-none absolute inset-y-0 z-20 w-px -translate-x-1/2 bg-cream/90 shadow-[0_0_12px_rgba(15,17,23,0.35)] peer-focus-visible:bg-gold"
        >
          <span className="absolute top-1/2 left-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cream/70 bg-ink/45 text-cream backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 peer-focus-visible:border-gold">
            <ChevronsLeftRight className="size-4" />
          </span>
        </div>
      </div>

      <figcaption className="mt-4 flex items-baseline justify-between gap-4">
        <span className="font-body text-[0.72rem] tracking-[0.2em] text-gold-dark uppercase">
          {label}
        </span>
        <span className="font-body text-[0.72rem] text-slate/80">
          Drag to compare
        </span>
      </figcaption>
    </figure>
  );
}
