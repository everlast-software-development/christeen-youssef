import { Image, type StaticImageData } from '@/components/ui/image';
import { cn } from '@/lib/utils';

/** A photograph in the article, numbered in the article's lightbox order. */
export type ArticleImage = {
  image: StaticImageData;
  alt?: string;
  caption?: string;
  /** `object-position` inside the 3/2 frame. */
  focus?: string;
  /** Its place in the lightbox (the cover is 0). */
  index: number;
};

/**
 * A section's photographs, after its copy — never floated, nothing wraps
 * around them. One fills the article column; two or more sit in a 2-column
 * grid (one column on phones). Every frame is 3/2, cropped, with the card
 * radius, and opens the lightbox.
 */
export function ArticleFigure({
  images,
  onOpen,
}: {
  images: ArticleImage[];
  onOpen: (index: number) => void;
}) {
  const grid = images.length > 1;

  return (
    <div data-reveal className={cn('my-10', grid && 'grid gap-4 sm:grid-cols-2')}>
      {images.map((item) => (
        <figure key={item.index} className="m-0">
          <button
            type="button"
            onClick={() => onOpen(item.index)}
            aria-label={item.alt ? `Enlarge photograph: ${item.alt}` : 'Enlarge photograph'}
            className="relative block aspect-[3/2] w-full cursor-zoom-in overflow-hidden rounded-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            <Image
              src={item.image}
              alt={item.alt ?? ''}
              fill
              placeholder="blur"
              // The article column is at most ~68ch (≈ 720px); a grid cell half that.
              sizes={grid ? '(min-width: 640px) 360px, 92vw' : '(min-width: 800px) 720px, calc(100vw - 26px)'}
              style={item.focus ? { objectPosition: item.focus } : undefined}
              className="object-cover"
            />
          </button>
          {item.caption && (
            <figcaption className="mt-3 type-small text-caption-strong">{item.caption}</figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
