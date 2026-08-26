import Image from 'next/image';
import { galleryFrame } from '@/lib/blog-image';
import { cn } from '@/lib/utils';
import type { GalleryFrame } from '@/types';

/**
 * An article's photographs, in the column beside the copy.
 *
 * One place, one shape. This replaces two components that each put images
 * somewhere different — a sticky single image beside the prose and a full-bleed
 * band below it — which meant an article could open with a hero, interrupt
 * itself with an aside, and then close with a third arrangement of the same
 * material. Copy on the left, pictures on the right, and that is the whole
 * layout.
 *
 * No `fill` and no chosen aspect ratio: each image keeps its own, so a portrait
 * is shown as a portrait and a landscape as a landscape. Nothing gets cropped
 * into a box picked here, which is what let the column stop caring what it is
 * handed — and it is why a frame's `focus` is not read below. `object-position`
 * only means something against a crop, and there is no crop left to anchor.
 */
export function ArticleImages({ images }: { images: GalleryFrame[] }) {
  if (images.length === 0) return null;

  return (
    // Below lg this is simply the next block after the prose, at full width.
    // Above it, the second column of the grid.
    <div className="mt-14 flex flex-col gap-5 lg:mt-0">
      {images.map((frame, index) => {
        const { image, width } = galleryFrame(frame);

        return (
        <figure
          key={index}
          data-reveal-image
          className={cn(
            'relative overflow-hidden rounded-2xl bg-cream-dark',
            // Full width below sm whatever the frame asks for. Half of a phone's
            // column is a thumbnail, which is the same reason the floated
            // figures drop their percentage at that width.
            width === 'half' && 'sm:w-1/2',
          )}
        >
          <Image
            src={image}
            alt=""
            placeholder="blur"
            sizes={
              width === 'half'
                ? '(min-width: 1024px) 12rem, (min-width: 640px) 46vw, 100vw'
                : '(min-width: 1024px) 24rem, 100vw'
            }
            className="h-auto w-full"
          />

          <div
            aria-hidden
            className="absolute inset-0 rounded-2xl ring-1 ring-ink/10 ring-inset"
          />
        </figure>
        );
      })}
    </div>
  );
}
