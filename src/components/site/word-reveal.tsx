import { Fragment } from 'react';

/**
 * A heading whose words blur-fade in one after another on load.
 *
 * Pure CSS (`animate-word`, staggered by inline delay), so it is rendered on
 * the server, ends visible without JavaScript, and is cut to nothing by the
 * reduced-motion rule in globals.css. Words stay inline-block for the
 * transform; the spaces between them stay real text so the line still wraps
 * and reads normally. The last two words are kept together (an inline-block
 * per word defeats text-wrap: balance), so the heading never ends on a line
 * of one word.
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
  const word = (index: number) => (
    <span className="animate-word inline-block" style={{ animationDelay: `${delay + index * step}ms` }}>
      {words[index]}
    </span>
  );
  const tail = Math.max(words.length - 2, 0);

  return (
    <>
      {words.slice(0, tail).map((_, index) => (
        <Fragment key={index}>
          {word(index)}{' '}
        </Fragment>
      ))}
      <span className="whitespace-nowrap">
        {words.slice(tail).map((_, i) => (
          <Fragment key={tail + i}>
            {i > 0 && ' '}
            {word(tail + i)}
          </Fragment>
        ))}
      </span>
    </>
  );
}
