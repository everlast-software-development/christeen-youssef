import type { ReactNode } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';

const pad = (n: number) => String(n).padStart(2, '0');

const CONTROL =
  'flex size-[46px] cursor-pointer items-center justify-center rounded-full border border-white/30 text-white transition-colors hover-fine:border-white hover-fine:bg-white hover-fine:text-ink focus-visible:outline-2 focus-visible:outline-gold';

/**
 * The site's one lightbox: Before & After's compare cards and an article's
 * photographs. Pages through `count` items with ← / → (and the buttons),
 * closes on Esc; Base UI's Dialog traps focus and returns it to whatever
 * opened it. `index` null is closed.
 */
export function Lightbox({
  index,
  count,
  onIndexChange,
  title,
  meta,
  previousLabel = 'Previous',
  nextLabel = 'Next',
  children,
}: {
  index: number | null;
  count: number;
  onIndexChange: (index: number | null) => void;
  /** The dialog's name for the item showing. */
  title: (index: number) => ReactNode;
  /** A line after the "03 / 12" counter. */
  meta?: (index: number) => ReactNode;
  previousLabel?: string;
  nextLabel?: string;
  /** The item itself. */
  children: (index: number) => ReactNode;
}) {
  const step = (direction: number) => {
    if (index === null) return;
    onIndexChange((index + direction + count) % count);
  };
  const extra = index === null ? null : meta?.(index);

  return (
    <Dialog.Root open={index !== null} onOpenChange={(next) => !next && onIndexChange(null)}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[110] bg-ink/90 backdrop-blur-sm transition-opacity duration-300 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Dialog.Popup
          onKeyDown={(event) => {
            // A slider inside the item (the compare grip) owns the arrow keys
            // while it has focus.
            if ((event.target as HTMLElement).getAttribute('role') === 'slider') return;
            if (event.key === 'ArrowLeft') step(-1);
            if (event.key === 'ArrowRight') step(1);
          }}
          className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto p-4 transition-[opacity,transform] duration-300 data-[ending-style]:scale-[0.98] data-[ending-style]:opacity-0 data-[starting-style]:scale-[0.98] data-[starting-style]:opacity-0 sm:p-8"
        >
          {index !== null && (
            <div className="w-full max-w-[56rem]">
              <div className="mb-4 flex items-center justify-between gap-4 text-white">
                <div className="min-w-0">
                  <Dialog.Title className="m-0 type-h3 text-white">{title(index)}</Dialog.Title>
                  <p className="m-0 mt-1 type-small text-white/60 tabular-nums">
                    {pad(index + 1)} / {pad(count)}
                    {extra && <> · {extra}</>}
                  </p>
                </div>
                <Dialog.Close aria-label="Close" className={`${CONTROL} shrink-0`}>
                  <X aria-hidden strokeWidth={1.6} className="size-5" />
                </Dialog.Close>
              </div>

              {children(index)}

              {count > 1 && (
                <div className="mt-6 flex justify-center gap-3">
                  <button type="button" className={CONTROL} onClick={() => step(-1)} aria-label={previousLabel}>
                    <ArrowLeft aria-hidden strokeWidth={1.6} className="size-[18px]" />
                  </button>
                  <button type="button" className={CONTROL} onClick={() => step(1)} aria-label={nextLabel}>
                    <ArrowRight aria-hidden strokeWidth={1.6} className="size-[18px]" />
                  </button>
                </div>
              )}
            </div>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
