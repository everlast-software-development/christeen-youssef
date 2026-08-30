import type { BlogPost, ImageFocus } from '@/types';

/**
 * Where a photograph is anchored when the post says nothing.
 *
 * The two frames want different answers. In the article hero, faces sit above
 * centre in most of these and a wide crop of a portrait photograph centred on
 * 50% lands on the chin — so that default pulls up to 32%. The carousel runs
 * the posts back to back, and a shared centre crop is what makes the run read
 * as one sequence rather than a set of separately-tuned stills, so it stays at
 * dead centre and only a post that actually needs otherwise opts out.
 */
const DEFAULT_FOCUS = {
  hero: '50% 32%',
  carousel: '50% 50%',
} as const;

function resolve(focus: ImageFocus | undefined, surface: 'hero' | 'carousel') {
  if (!focus) return DEFAULT_FOCUS[surface];
  if (typeof focus === 'string') return focus;

  return focus[surface] ?? DEFAULT_FOCUS[surface];
}

/**
 * The `object-position` for a post's photograph in the article hero.
 *
 * The hero was written as the carousel slide stopped — same crop, so clicking a
 * slide lands you on the frame you clicked. That still holds for every post that
 * gives `imageFocus` a bare string, which is the intended case.
 *
 * It does not hold where a post sets the two separately, because the frames are
 * not actually the same shape: the hero is `min-h-[78svh]` and static, the
 * carousel is `h-[90svh]` and spends its whole hold scaled between 1.16 and 1.
 * On a laptop that difference is several hundred pixels of crop, which is enough
 * to put a face inside one frame and outside the other. Where those pull apart,
 * a subject in frame beats a promise about continuity.
 */
export function heroFocus(post: BlogPost) {
  return resolve(post.imageFocus, 'hero');
}

/** The same, for the listing carousel. See `heroFocus` on why they can differ. */
export function carouselFocus(post: BlogPost) {
  return resolve(post.imageFocus, 'carousel');
}

