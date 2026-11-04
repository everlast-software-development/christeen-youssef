'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Eyebrow } from '@/components/site/layout';
import { Button } from '@/components/site/button';
import { TransitionLink } from '@/components/ui/transition-link';
import { beforeAfterCases, caseTitle, type BeforeAfterCase } from '@/data/before-after';
import { cn } from '@/lib/utils';

const SHOWN = beforeAfterCases.slice(0, 8);

export const RESULTS_DISCLAIMER =
  'Individual results vary. Images are of real patients, shown with consent, and are not a guarantee of outcome.';

const pad = (n: number) => String(n).padStart(2, '0');

const PILL = 'absolute top-3.5 rounded-full px-3 py-1 text-[12px] font-semibold';

/** Before | after, side by side, filling whatever frame holds them. */
function Pair({ item, decorative = false }: { item: BeforeAfterCase; decorative?: boolean }) {
  return (
    <span className="absolute inset-0 grid grid-cols-2">
      {(['before', 'after'] as const).map((state) => (
        <span key={state} className="relative overflow-hidden">
          <Image
            src={item[state]}
            alt={decorative ? '' : `${caseTitle(item)}, ${state} treatment`}
            fill
            placeholder="blur"
            sizes="(min-width: 961px) 430px, 46vw"
            className="object-cover transition-transform duration-1000 ease-[cubic-bezier(.2,.7,.2,1)] group-hover-fine:scale-[1.04]"
          />
        </span>
      ))}
    </span>
  );
}

// The two cases waiting underneath, tilted either way and faded.
const BEHIND = [
  'translate-x-[-30px] translate-y-3 -rotate-3 opacity-75 shadow-[0_20px_40px_rgba(23,21,15,0.14)]',
  'translate-x-[34px] translate-y-[22px] rotate-[4deg] opacity-50 shadow-[0_20px_40px_rgba(23,21,15,0.12)]',
];

/**
 * A deck of cases: the current one on top in a white frame with Before /
 * After labels and a thin divider, the next two tilted behind it. The arrows
 * bring the next case up to the top; the case's name and its place in the
 * run sit between them.
 */
export function HomeResults() {
  const [index, setIndex] = useState(0);
  const total = SHOWN.length;
  const at = (offset: number) => SHOWN[(index + offset + total) % total];
  const current = at(0);

  const go = (step: number) => setIndex((value) => (value + step + total) % total);

  const arrow =
    'inline-flex size-[42px] items-center justify-center rounded-full border border-line bg-cream text-ink transition-colors duration-200 hover-fine:bg-ink hover-fine:text-white';

  return (
    <section aria-labelledby="results-title" className="relative overflow-x-clip bg-page py-[clamp(64px,7vw,104px)] text-text">
      <div className="container-site">
        <header className="scroll-rise mb-[60px] flex flex-col items-center gap-3.5 text-center">
          <Eyebrow>Before &amp; after</Eyebrow>
          <h2 id="results-title" className="m-0 type-h2 text-text">
            Real Results
          </h2>
          <p className="m-0 max-w-[520px] text-[15px]/[1.7] text-soft">{RESULTS_DISCLAIMER}</p>
        </header>

        <div className="relative mx-auto h-[clamp(300px,34vw,440px)] max-w-[860px]">
          {[2, 1].map((offset) => (
            <div
              key={`behind-${offset}`}
              aria-hidden
              className={cn(
                'absolute inset-0 overflow-hidden rounded-[20px] bg-page transition-[translate,rotate,opacity] duration-500',
                BEHIND[offset - 1],
              )}
            >
              <Pair item={at(offset)} decorative />
            </div>
          ))}

          <TransitionLink
            key={current.id}
            href="/before-and-after"
            className="animate-deck group absolute inset-0 overflow-hidden rounded-[20px] border-8 border-cream bg-cream shadow-[0_34px_70px_rgba(23,21,15,0.22)]"
          >
            <Pair item={current} />
            <span aria-hidden className="absolute inset-y-0 left-1/2 -ml-px w-0.5 bg-cream" />
            <span aria-hidden className={`${PILL} left-3.5 bg-cream text-ink`}>
              Before
            </span>
            <span aria-hidden className={`${PILL} right-3.5 bg-cream text-ink`}>
              After
            </span>
          </TransitionLink>
        </div>

        <div className="mt-[60px] flex items-center justify-center gap-[18px]">
          <button type="button" className={arrow} onClick={() => go(-1)} aria-label="Previous case">
            <ArrowLeft aria-hidden strokeWidth={2} className="size-[15px]" />
          </button>
          <span aria-live="polite" className="flex min-w-[130px] flex-col text-center">
            <span className="font-display text-[24px]">{caseTitle(current)}</span>
            <span className="text-[12.5px] text-caption-strong tabular-nums">
              {pad(index + 1)} / {pad(total)}
            </span>
          </span>
          <button type="button" className={arrow} onClick={() => go(1)} aria-label="Next case">
            <ArrowRight aria-hidden strokeWidth={2} className="size-[15px]" />
          </button>
        </div>

        <div className="mt-[26px] flex justify-center">
          <Button href="/before-and-after" variant="outline-dark">
            View full gallery
          </Button>
        </div>
      </div>
    </section>
  );
}
