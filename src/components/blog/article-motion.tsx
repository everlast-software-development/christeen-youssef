import type { ReactNode } from 'react';

/**
 * The article's motion scope.
 *
 * It used to run its own GSAP context — headings masked line by line, blocks
 * faded up from nothing, photographs wiped in with a clip-path — all of which
 * started content hidden. The site-wide ScrollMotion now reads the same
 * `data-reveal` markers and only ever moves them, so this is a plain wrapper,
 * kept so the article's markup did not have to change shape.
 */
export function ArticleMotion({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
