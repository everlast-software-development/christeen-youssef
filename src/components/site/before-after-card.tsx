import { CompareSlider } from '@/components/ui/compare-slider';
import { caseTitle, UNCATEGORIZED, type BeforeAfterCase } from '@/data/before-after';

/** "Scar revision · 3 sessions" — only the parts the clinic has supplied. */
export function caseMeta(item: BeforeAfterCase) {
  return [
    item.category !== UNCATEGORIZED ? item.category : null,
    item.sessions ? `${item.sessions} ${item.sessions === 1 ? 'session' : 'sessions'}` : null,
  ]
    .filter(Boolean)
    .join(' · ');
}

/**
 * One result: the compare slider with its grip, and the treatment beneath it.
 * Dragging the grip compares; a click anywhere else on the photo opens the
 * lightbox (`onOpen`).
 */
export function BeforeAfterCard({
  item,
  sizes,
  preload = false,
  hint = false,
  onOpen,
}: {
  item: BeforeAfterCase;
  sizes: string;
  preload?: boolean;
  hint?: boolean;
  onOpen: () => void;
}) {
  const title = caseTitle(item);
  const meta = caseMeta(item);

  return (
    <figure className="m-0">
      <CompareSlider
        before={item.before}
        after={item.after}
        label={title}
        objectPosition={item.objectPosition}
        sizes={sizes}
        preload={preload}
        hint={hint}
      >
        <button
          type="button"
          onClick={onOpen}
          aria-label={`${title} — view larger`}
          className="absolute inset-0 z-10 cursor-zoom-in rounded-[16px] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gold"
        />
      </CompareSlider>

      <figcaption className="mt-4">
        <span className="block type-h3 text-ink">{title}</span>
        {meta && <span className="mt-1 block type-small text-caption-strong">{meta}</span>}
      </figcaption>
    </figure>
  );
}
