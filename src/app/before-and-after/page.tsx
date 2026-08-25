import type { Metadata } from 'next';
import { ClosingCta } from '@/components/sections/closing-cta';
import { CompareSlider } from '@/components/ui/compare-slider';
import { beforeAfterCases } from '@/data/before-after';

export const metadata: Metadata = {
  title: 'Before & After',
  description:
    'Documented patient results across aesthetic dermatology, scar revision and regenerative treatments.',
};

export default function Page() {
  return (
    // The site header is fixed at h-18, so the page has to clear it itself
    // rather than relying on flow.
    <main className="min-h-svh bg-cream pt-32 pb-24 text-ink lg:pt-40 lg:pb-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12 xl:px-20">
        <header className="max-w-3xl">
          <p className="font-body text-[0.72rem] tracking-[0.24em] text-gold-dark uppercase sm:text-[0.78rem]">
            Results
          </p>

          <h1 className="mt-5 font-display text-display-md text-ink">
            Before &amp; After
          </h1>

          <div
            aria-hidden
            className="mt-7 h-px w-24 origin-left bg-gradient-gold"
          />

          <p className="mt-8 max-w-xl font-body text-[0.95rem]/relaxed text-slate lg:text-base/relaxed">
            Documented results across aesthetic dermatology, scar revision and
            regenerative treatments. Drag any image to move between the two
            states.
          </p>
        </header>

        {/* Two up on desktop rather than three: a comparison the reader has to
            drag needs to be large enough to read detail in, which a third
            column would cost. */}
        <div className="mt-16 grid gap-10 md:grid-cols-2 lg:mt-20 lg:gap-12">
          {beforeAfterCases.map((item, index) => (
            <CompareSlider
              key={item.id}
              label={item.label}
              before={item.before}
              after={item.after}
              index={index}
              // The first row is above the fold on most screens; everything
              // below it lazy-loads as normal.
              priority={index < 2}
            />
          ))}
        </div>

        <p className="mt-16 max-w-xl font-body text-[0.8rem]/relaxed text-slate/70">
          Individual results vary. Images are of real patients, shown with
          consent, and are not a guarantee of outcome.
        </p>

        {/* Twelve comparisons in, this is the highest-intent point on the
            page, so it closes on the same CTA the header carries — the same
            component, not a second style of primary button. */}
        <ClosingCta
          title="Every result starts with a conversation"
          body="No two cases are alike. A consultation is where the plan gets built around your skin, your history and what you actually want from treatment."
          href="/reach-me"
          label="Let's talk"
        />
      </div>
    </main>
  );
}
