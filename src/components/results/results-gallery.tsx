import { useState } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { ArrowLeft, ArrowRight, Info, X } from 'lucide-react';
import { PageHero } from '@/components/site/page-hero';
import { Container, Section } from '@/components/site/layout';
import { BeforeAfterCard, caseMeta } from '@/components/site/before-after-card';
import { CompareSlider } from '@/components/ui/compare-slider';
import { beforeAfterCases, caseTitle } from '@/data/before-after';
import { RESULTS_DISCLAIMER } from '@/components/home/results';

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * The Before & After page body: the hero, the grid of every compare card, one
 * disclaimer, and the lightbox. The lightbox pages through the cases with
 * ← / → and closes on Esc; Base UI's Dialog traps focus and
 * returns it to the card that opened it.
 */
export function ResultsGallery() {
  const shown = beforeAfterCases;

  const [open, setOpen] = useState<number | null>(null);
  const current = open === null ? null : shown[open];
  const total = shown.length;
  const step = (direction: number) =>
    setOpen((value) => (value === null ? value : (value + direction + total) % total));

  const control =
    'flex size-[46px] items-center justify-center rounded-full border border-white/30 text-white transition-colors hover-fine:border-white hover-fine:bg-white hover-fine:text-ink focus-visible:outline-2 focus-visible:outline-gold';

  return (
    <>
      <PageHero
        section="/before-and-after"
        title="Real {results}"
        intro="Documented results across aesthetic dermatology, scar revision and regenerative treatments."
      />

      <Section tone="page">
        <Container>
          <ul className="m-0 grid list-none gap-x-4 gap-y-10 p-0 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((item, index) => (
              <li key={item.id} data-reveal-item>
                <BeforeAfterCard
                  item={item}
                  // Only the first card loads up front: on a phone it is the
                  // only one on screen, and every eager image beside it slows
                  // the page's largest paint. The rest load lazily as they near.
                  preload={index === 0}
                  hint={index === 0}
                  sizes="(min-width: 1024px) 400px, (min-width: 768px) 46vw, 92vw"
                  onOpen={() => setOpen(index)}
                />
              </li>
            ))}
          </ul>

          <p className="m-0 mx-auto mt-16 flex max-w-[640px] items-start justify-center gap-2 text-center type-small text-caption-strong">
            <Info aria-hidden strokeWidth={1.7} className="mt-0.5 size-4 shrink-0" />
            {RESULTS_DISCLAIMER}
          </p>
        </Container>
      </Section>

      <Dialog.Root open={current !== null} onOpenChange={(next) => !next && setOpen(null)}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-[110] bg-ink/90 backdrop-blur-sm transition-opacity duration-300 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
          <Dialog.Popup
            onKeyDown={(event) => {
              // The grip owns the arrow keys while it has focus.
              if ((event.target as HTMLElement).getAttribute('role') === 'slider') return;
              if (event.key === 'ArrowLeft') step(-1);
              if (event.key === 'ArrowRight') step(1);
            }}
            className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto p-4 transition-[opacity,transform] duration-300 data-[ending-style]:scale-[0.98] data-[ending-style]:opacity-0 data-[starting-style]:scale-[0.98] data-[starting-style]:opacity-0 sm:p-8"
          >
            {current && open !== null && (
              <div className="w-full max-w-[56rem]">
                <div className="mb-4 flex items-center justify-between gap-4 text-white">
                  <div>
                    <Dialog.Title className="m-0 type-h3 text-white">{caseTitle(current)}</Dialog.Title>
                    <p className="m-0 mt-1 type-small text-white/60 tabular-nums">
                      {pad(open + 1)} / {pad(total)}
                      {caseMeta(current) && ` · ${caseMeta(current)}`}
                    </p>
                  </div>
                  <Dialog.Close aria-label="Close" className={control}>
                    <X aria-hidden strokeWidth={1.6} className="size-5" />
                  </Dialog.Close>
                </div>

                <CompareSlider
                  key={current.id}
                  before={current.before}
                  after={current.after}
                  label={caseTitle(current)}
                  objectPosition={current.objectPosition}
                  sizes="(min-width: 960px) 56rem, 92vw"
                  dragAnywhere
                />

                <div className="mt-6 flex justify-center gap-3">
                  <button type="button" className={control} onClick={() => step(-1)} aria-label="Previous result">
                    <ArrowLeft aria-hidden strokeWidth={1.6} className="size-[18px]" />
                  </button>
                  <button type="button" className={control} onClick={() => step(1)} aria-label="Next result">
                    <ArrowRight aria-hidden strokeWidth={1.6} className="size-[18px]" />
                  </button>
                </div>
              </div>
            )}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
