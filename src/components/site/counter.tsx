import { useEffect, useRef } from 'react';
import { animate } from 'motion/react';
import { prefersReducedMotion } from '@/lib/gsap';

const format = (value: number, suffix = '') =>
  `${Math.round(value).toLocaleString('en-US')}${suffix}`;

/**
 * A number that counts up from zero.
 *
 * The server renders the final figure, so it is correct without JavaScript
 * and for search engines; the count is layered on after hydration by writing
 * to an aria-hidden copy, while screen readers get the final value once.
 *
 * `trigger="load"` starts after `delay` ms — for the hero, whose stats arrive
 * inside a CSS fade that hides the swap to zero. `trigger="view"` waits until
 * the number scrolls into view.
 */
export function Counter({
  value,
  suffix,
  trigger = 'view',
  delay = 0,
  duration = 2,
  className,
}: {
  value: number;
  suffix?: string;
  trigger?: 'load' | 'view';
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) return;

    let stop: (() => void) | undefined;

    const run = () => {
      const controls = animate(0, value, {
        duration,
        delay: trigger === 'load' ? delay / 1000 : 0,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (latest) => {
          node.textContent = format(latest, suffix);
        },
      });
      stop = () => controls.stop();
    };

    if (trigger === 'load') {
      node.textContent = format(0, suffix);
      run();
      return () => {
        stop?.();
        node.textContent = format(value, suffix);
      };
    }

    // Only reset to zero if the number is still below the fold — one already
    // on screen at mount keeps its value rather than visibly blanking.
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight) return;

    node.textContent = format(0, suffix);
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        run();
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      stop?.();
      node.textContent = format(value, suffix);
    };
  }, [value, suffix, trigger, delay, duration]);

  return (
    <span className={className}>
      <span ref={ref} aria-hidden>
        {format(value, suffix)}
      </span>
      <span className="sr-only">{format(value, suffix)}</span>
    </span>
  );
}
