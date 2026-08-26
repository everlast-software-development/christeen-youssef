import type { BlogPost, GalleryFrame, ImageFocus } from '@/types';

/**
 * Where a photograph is anchored in the full-bleed frames.
 *
 * Faces sit above centre in most of these, and a wide crop of a portrait
 * photograph centred on 50% lands on the chin — so the default pulls up to 32%.
 */
const DEFAULT_FOCUS = '50% 32%';

function resolve(focus: ImageFocus | undefined, surface: 'hero' | 'carousel') {
  if (!focus) return DEFAULT_FOCUS;
  if (typeof focus === 'string') return focus;

  return focus[surface] ?? DEFAULT_FOCUS;
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

/**
 * A gallery entry as the renderer wants it: an image and a crop anchor.
 *
 * The gallery frames are `object-cover`, and a portrait photograph dropped into
 * a square or a 4:3 slot loses a third of its height to a centred crop. Where
 * the subject is not in the middle of the source that crop is wrong — the
 * German University signing is shot from across the room with the ceiling and
 * the air-conditioning taking the top of the frame, so centring it fills half
 * the tile with ceiling and pushes the signatories to the bottom edge.
 *
 * Undefined focus is left undefined rather than defaulted to `50% 50%`, so the
 * untouched entries render with no inline style at all.
 */
export function galleryFrame(frame: GalleryFrame) {
  return 'image' in frame
    ? { image: frame.image, focus: frame.focus, width: frame.width ?? 'full' }
    : { image: frame, focus: undefined, width: 'full' as const };
}
