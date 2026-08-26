import Image, { type StaticImageData } from 'next/image';

/**
 * A photograph set inside a body section, with the copy running past it.
 *
 * The gallery band is the right home for a set of event photographs seen as a
 * set. It is the wrong home for one photograph that belongs to one part of the
 * argument — put four frames in a band at the foot and the podium shot has been
 * separated from the paragraph about what was said at the podium.
 *
 * Floated rather than laid out in a grid beside the prose, because the article
 * column is a measure (68ch) and not a layout: a grid would have to narrow that
 * measure for the whole section, including the paragraphs below the image. A
 * float only borrows the width it needs, and the copy closes back over it.
 */
export function ArticleFigure({
  image,
  side = 'right',
  alt = '',
  bleed = false,
  crop,
  focus,
}: {
  image: StaticImageData;
  side?: 'left' | 'right';
  alt?: string;
  /**
   * Let the frame out of the 68ch measure and into the page margin.
   *
   * The outdent grows with the image, so the *footprint* inside the measure
   * stays put: 22rem outdented 4rem and 26rem outdented 8rem both leave the
   * same ~18rem for the copy to wrap against. A bigger picture that does not
   * cost the paragraph beside it any more width than the smaller one did.
   *
   * Capped at 8rem because the outdent has to clear the tightest layout it can
   * land in, which is an article that also carries the contents rail: at xl
   * that leaves ~11rem between the measure and the container edge, and the
   * gutter absorbs the rest. Going further would push a horizontal scrollbar
   * onto the page on exactly the posts with a sidebar.
   */
  bleed?: boolean;
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
}) {
  const width = bleed
    ? 'sm:w-[42%] lg:w-[22rem] xl:w-[26rem]'
    : 'sm:w-[42%]';

  const outdent = bleed
    ? side === 'left'
      ? 'lg:-ml-16 xl:-ml-32'
      : 'lg:-mr-16 xl:-mr-32'
    : '';

  // Below sm it is a full-measure block: a 42% float on a phone is a thumbnail
  // with two words per line beside it.
  const flow =
    side === 'left'
      ? 'sm:float-left sm:mr-8'
      : 'sm:float-right sm:ml-8';

  const sizes = bleed
    ? '(min-width: 1280px) 26rem, (min-width: 1024px) 22rem, (min-width: 640px) 17rem, 92vw'
    : '(min-width: 640px) 17rem, 92vw';

  return (
    <figure
      // clipPath only, per ArticleMotion — no transform, so the float is safe.
      data-reveal-image
      className={`my-8 overflow-hidden rounded-2xl bg-cream-dark sm:my-6 ${width} ${outdent} ${flow}`}
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
        // Not the viewport: 42% of a 68ch measure is ~17rem, and quoting a vw
        // here would have next/image fetch a far larger file than is drawn.
        sizes={sizes}
        placeholder="blur"
        style={crop && focus ? { objectPosition: focus } : undefined}
        className={
          crop === 'square'
            ? 'aspect-square w-full object-cover'
            : 'w-full'
        }
      />
    </figure>
  );
}
