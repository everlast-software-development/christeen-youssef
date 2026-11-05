import { useState } from 'react';
import { Info } from 'lucide-react';
import { PageHero } from '@/components/site/page-hero';
import { Container, Section } from '@/components/site/layout';
import { Lightbox } from '@/components/site/lightbox';
import { BeforeAfterCard, caseMeta } from '@/components/site/before-after-card';
import { CompareSlider } from '@/components/ui/compare-slider';
import { beforeAfterCases, caseTitle } from '@/data/before-after';
import { RESULTS_DISCLAIMER } from '@/components/home/results';

/**
 * The Before & After page body: the hero, the grid of every compare card, one
 * disclaimer, and the lightbox (site/lightbox.tsx) paging through the cases.
 */
export function ResultsGallery() {
  const shown = beforeAfterCases;
  const [open, setOpen] = useState<number | null>(null);

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
                  // The first card is the page's main image. The rest of the
                  // first row is on screen too, so it loads up front as well —
                  // the third card only from lg, where the row is three wide.
                  // Everything below loads as it nears.
                  preload={index === 0}
                  eager={index === 1 || index === 2}
                  preloadMedia={index === 2 ? '(min-width: 1024px)' : undefined}
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

      <Lightbox
        index={open}
        count={shown.length}
        onIndexChange={setOpen}
        title={(index) => caseTitle(shown[index])}
        meta={(index) => caseMeta(shown[index])}
        previousLabel="Previous result"
        nextLabel="Next result"
      >
        {(index) => (
          <CompareSlider
            key={shown[index].id}
            before={shown[index].before}
            after={shown[index].after}
            label={caseTitle(shown[index])}
            objectPosition={shown[index].objectPosition}
            sizes="(min-width: 960px) 56rem, 92vw"
            dragAnywhere
          />
        )}
      </Lightbox>
    </>
  );
}
