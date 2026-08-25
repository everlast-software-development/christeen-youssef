'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'motion/react';

/**
 * Counts from zero to `value` the first time it scrolls into view.
 *
 * Uses Motion's imperative animate() with a state setter rather than a
 * MotionValue bound to textContent, so the final number is real text in the
 * DOM — readable by screen readers and present for search engines.
 */
export function CountUp({
  value,
  suffix,
  duration = 2,
  className,
}: {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;

    // Reduced motion runs the same path at zero duration, so the value still
    // arrives through onUpdate rather than a bare setState in the effect body.
    const controls = animate(0, value, {
      duration: reduced ? 0 : duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });

    return () => controls.stop();
  }, [inView, value, duration, reduced]);

  return (
    <span ref={ref} className={className}>
      {display.toLocaleString('en-US')}
      {suffix}
    </span>
  );
}
