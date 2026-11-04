import { Fragment } from 'react';

/**
 * A heading whose words blur-fade in one after another on load.
 *
 * Pure CSS (`animate-word`, staggered by inline delay), so it is rendered on
 * the server, ends visible without JavaScript, and is cut to nothing by the
 * reduced-motion rule in globals.css. Words stay inline-block for the
 * transform; the spaces between them stay real text so the line still wraps
 * and reads normally.
 */
export function WordReveal({
  text,
  delay = 0,
  step = 90,
}: {
  text: string;
  /** ms before the first word. */
  delay?: number;
  /** ms between words. */
  step?: number;
}) {
  const words = text.split(' ');

  return words.map((word, index) => (
    <Fragment key={`${word}-${index}`}>
      <span
        className="animate-word inline-block"
        style={{ animationDelay: `${delay + index * step}ms` }}
      >
        {word}
      </span>
      {index < words.length - 1 && ' '}
    </Fragment>
  ));
}
