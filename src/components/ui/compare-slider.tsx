'use client';

import Image, { type StaticImageData } from 'next/image';
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const CHIP =
  'pointer-events-none absolute top-3 z-20 rounded-full bg-cream px-3 py-1 type-eyebrow text-ink';

const clamp = (n: number) => Math.min(100, Math.max(0, n));

/**
 * Before/after wipe: the after photo is the base, the before photo is clipped
 * over it up to the divider. The divider's grip is a real slider — drag it
 * with a mouse or a finger, or focus it and use the arrow keys (5% a press,
 * Home/End to the edges).
 *
 * `dragAnywhere` (the lightbox) lets a drag start anywhere on the frame. On a
 * grid card only the grip drags, so a tap elsewhere is free to open the card.
 * `hint` nudges the divider 45% → 55% → 50% once the first time the frame
 * scrolls into view, to show that it moves.
 */
export function CompareSlider({
  before,
  after,
  label,
  objectPosition,
  sizes,
  preload = false,
  dragAnywhere = false,
  hint = false,
  className,
  children,
}: {
  before: StaticImageData;
  after: StaticImageData;
  /** The treatment — used in the slider's name and the images' alt text. */
  label: string;
  objectPosition?: string;
  sizes: string;
  preload?: boolean;
  dragAnywhere?: boolean;
  hint?: boolean;
  className?: string;
  /** Rendered over the photos, under the grip (e.g. the card's open button). */
  children?: React.ReactNode;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [easing, setEasing] = useState(false);
  const dragging = useRef(false);
  // The hint's pending steps — cancelled the moment anyone touches the slider.
  const hintTimers = useRef<number[]>([]);
  const stopHint = () => {
    hintTimers.current.forEach((id) => window.clearTimeout(id));
    hintTimers.current = [];
  };

  const fromPointer = (clientX: number) => {
    const box = frame.current?.getBoundingClientRect();
    if (!box) return;
    stopHint();
    setEasing(false);
    setPosition(clamp(((clientX - box.left) / box.width) * 100));
  };

  const start = (event: ReactPointerEvent<HTMLElement>) => {
    dragging.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    fromPointer(event.clientX);
  };
  const move = (event: ReactPointerEvent<HTMLElement>) => {
    if (dragging.current) fromPointer(event.clientX);
  };
  const end = () => {
    dragging.current = false;
  };

  // The one-time nudge, when the frame first comes into view.
  useEffect(() => {
    if (!hint || !frame.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timers = hintTimers.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        setEasing(true);
        [45, 55, 50].forEach((value, i) => timers.push(window.setTimeout(() => setPosition(value), 400 + i * 450)));
        timers.push(window.setTimeout(() => setEasing(false), 400 + 3 * 450));
      },
      { threshold: 0.6 },
    );
    observer.observe(frame.current);
    return () => {
      observer.disconnect();
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [hint]);

  const ease = easing ? 'transition-[clip-path,left] duration-[420ms] ease-[cubic-bezier(.45,0,.2,1)]' : '';
  const fit = { objectPosition };

  return (
    <div
      ref={frame}
      className={cn('relative aspect-[4/3] w-full touch-pan-y overflow-hidden rounded-[16px] bg-cream select-none', className)}
      {...(dragAnywhere ? { onPointerDown: start, onPointerMove: move, onPointerUp: end, onPointerCancel: end } : {})}
    >
      <Image src={after} alt={`${label}, after treatment`} fill sizes={sizes} preload={preload} placeholder="blur" style={fit} className="object-cover" draggable={false} />
      <div className={cn('absolute inset-0', ease)} style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <Image src={before} alt={`${label}, before treatment`} fill sizes={sizes} preload={preload} placeholder="blur" style={fit} className="object-cover" draggable={false} />
      </div>

      {children}

      <span aria-hidden className={cn(CHIP, 'left-3')}>Before</span>
      <span aria-hidden className={cn(CHIP, 'right-3')}>After</span>

      {/* The divider: a 2px white line and a 40px grip, which is the slider. */}
      <div className={cn('pointer-events-none absolute inset-y-0 z-30 w-0.5 -translate-x-1/2 bg-white', ease)} style={{ left: `${position}%` }}>
        <div
          role="slider"
          tabIndex={0}
          aria-label={`Before and after comparison for ${label}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          aria-valuetext={`${Math.round(position)}% before`}
          onPointerDown={(event) => {
            event.stopPropagation();
            start(event);
          }}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => {
            const step = { ArrowLeft: -5, ArrowDown: -5, ArrowRight: 5, ArrowUp: 5 }[event.key];
            if (step !== undefined) setPosition((p) => clamp(p + step));
            else if (event.key === 'Home') setPosition(0);
            else if (event.key === 'End') setPosition(100);
            else return;
            event.preventDefault();
            event.stopPropagation();
            stopHint();
            setEasing(false);
          }}
          className="pointer-events-auto absolute top-1/2 left-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize touch-none items-center justify-center rounded-full bg-white text-ink shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        >
          <ChevronLeft aria-hidden strokeWidth={2} className="-mr-1 size-4" />
          <ChevronRight aria-hidden strokeWidth={2} className="-ml-1 size-4" />
        </div>
      </div>
    </div>
  );
}
