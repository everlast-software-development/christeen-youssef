'use client';

import React, { useMemo, type CSSProperties, type ElementType } from 'react';

export interface TextRevealProps {
  text: string;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  staggerDelay?: number;
  duration?: number;
  easing?: string;
  direction?: 'up' | 'down';
}

/**
 * Per-character cascade reveal.
 *
 * Each glyph carries a copy of itself 1em below via text-shadow, inside a
 * 1em-tall clipping box — so translating up by 1em swaps the character for its
 * duplicate with no extra DOM text.
 *
 * Driven by a `--cascade` custom property rather than internal hover state, so
 * a parent can trigger it with `group-hover:[--cascade:1]`. That matters here:
 * every button using this has non-text areas (an arrow badge, a hamburger) and
 * hovering those should still play the effect.
 */
export const TextReveal = React.memo(function TextReveal({
  text,
  as: Component = 'span',
  className = '',
  style,
  staggerDelay = 26,
  duration = 280,
  easing = 'cubic-bezier(0.22, 1, 0.36, 1)',
  direction = 'up',
}: TextRevealProps) {
  const chars = useMemo(() => {
    // Segmenter keeps grapheme clusters (accents, emoji) intact.
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
      return Array.from(segmenter.segment(text), (s) => s.segment);
    }
    return [...text];
  }, [text]);

  const sign = direction === 'up' ? 1 : -1;

  return (
    <Component
      className={`relative inline-flex overflow-hidden ${className}`.trim()}
      style={{ height: '1em', lineHeight: 1, ...style }}
    >
      <span className="sr-only">{text}</span>

      {chars.map((char, i) => (
        <span
          key={i}
          aria-hidden
          className="inline-block will-change-transform"
          style={{
            textShadow: `0 ${sign}em currentColor`,
            transition: `transform ${duration}ms ${easing}`,
            transitionDelay: `${i * staggerDelay}ms`,
            transform: `translateY(calc(var(--cascade, 0) * ${-sign}em))`,
          }}
        >
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </Component>
  );
});

TextReveal.displayName = 'TextReveal';
