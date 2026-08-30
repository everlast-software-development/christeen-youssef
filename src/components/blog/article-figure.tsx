import type { CSSProperties } from 'react';
import Image, { type StaticImageData } from 'next/image';

/**
 * A photograph set inside a body section, with the copy running past it.
 *
 * Every picture on every post is one of these. There is no gallery band and no
 * picture column any more — put the podium shot in a strip at the foot and it
 * has been separated from the paragraph about what was said at the podium.
 *
 * Floated rather than laid out in a grid beside the prose, because the article
 * column is a measure (72ch) and not a layout: a grid would have to narrow that
 * measure for the whole section, including the paragraphs below the image. A
 * float only borrows the width it needs, and the copy closes back over it —
 * which is the shape this is for, so the frame is sized to make sure the copy
 * gets there. See the width note below.
 *
 * A float is now the *only* thing this does. It used to take a `bleed` that let
 * the frame out into the page margin and a `column` mode that split the article
 * in two — both of which changed the shape of the page they landed on, so an
 * article's spine depended on which pictures it happened to carry.
 */
export function ArticleFigure({
  image,
  side = 'right',
  alt = '',
  crop,
  focus,
  width,
}: {
  image: StaticImageData;
  side?: 'left' | 'right';
  alt?: string;
  /**
   * Square the frame off instead of keeping the source's own shape.
   *
   * Natural aspect is the default because these arrive portrait *and* landscape
   * and a forced ratio would crop the subject out of one of them. It is the
   * wrong default for a photograph shot from across a room, where a third of the
   * height is ceiling — squaring that off with `focus` is what makes it a
   * picture of the thing rather than of the room.
   */
  crop?: 'square';
  /** `object-position`, for a cropped frame. Ignored at natural aspect. */
  focus?: string;
  /**
   * A flat width in pixels from sm up, in place of the responsive default.
   *
   * Still a percentage below sm — a fixed 350px frame on a 360px phone is the
   * whole column with no room to float against, and would leave the copy
   * wrapping in the few pixels beside it.
   */
  width?: number;
}) {
  // How wide the float runs, from the shape of what is in it.
  //
  // One flat percentage cannot serve both, because what actually matters is the
  // frame's *height* against the length of the section it sits in. These
  // sections run 50 to 100 words — about eight to fourteen lines beside a
  // float — so a frame much taller than that leaves the copy stopping level
  // with its middle and a wedge of empty page beneath.
  //
  // At a 72ch measure a landscape at 46% is roughly 210 tall and any section
  // here clears it. The same 46% given to a 2:3 portrait is 440, which no
  // section here clears — so portraits run narrower, trading some size for the
  // copy actually closing back underneath them. Cropping them to a landscape
  // would be the other way out, and it is wrong for this set: they are
  // full-length group shots, and the crop that makes them wrap takes off the
  // heads and the feet.
  const ratio = crop === 'square' ? 1 : image.width / image.height;
  const shape = ratio < 0.9 ? 'sm:w-[36%]' : 'sm:w-[46%]';

  // Below sm it is a full-measure block: a float on a phone is a thumbnail with
  // two words per line beside it.
  const widthClass = width ? 'sm:w-[var(--figure-width)]' : shape;

  const flow =
    side === 'left' ? 'sm:float-left sm:mr-8' : 'sm:float-right sm:ml-8';

  // Not the viewport: a float is a percentage of the 72ch measure, not of the
  // window, and quoting a vw here would have next/image fetch a file several
  // times the size of the one drawn.
  const sizes = width
    ? `(min-width: 640px) ${width}px, 92vw`
    : ratio < 0.9
      ? '(min-width: 640px) 14rem, 92vw'
      : '(min-width: 640px) 18rem, 92vw';

  return (
    <figure
      // clipPath only, per ArticleMotion — no transform, so the float is safe.
      data-reveal-image
      style={
        width
          ? ({ '--figure-width': `${width}px` } as CSSProperties)
          : undefined
      }
      className={`my-8 overflow-hidden rounded-2xl bg-cream-dark sm:my-6 ${widthClass} ${flow}`}
    >
      {/* A laid-out image, not a `fill` inside an aspect-ratio box.

          The box version is one missing utility away from vanishing: `fill`
          makes the img absolute, so the wrapper's only height comes from
          `aspect-square`, and without that rule in the sheet the wrapper is 0px
          and `overflow-hidden` above clips the picture out of the page
          altogether. A laid-out img carries width/height attributes, so the
          browser reserves its box from the intrinsic ratio whatever the CSS
          says, and the worst a missing `aspect-square` can do is leave the frame
          uncropped. */}
      <Image
        src={image}
        alt={alt}
        sizes={sizes}
        placeholder="blur"
        style={crop && focus ? { objectPosition: focus } : undefined}
        className={
          crop === 'square' ? 'aspect-square w-full object-cover' : 'w-full'
        }
      />
    </figure>
  );
}
