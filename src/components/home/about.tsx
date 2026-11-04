import { Image } from '@/components/ui/image';
import { Eyebrow } from '@/components/site/layout';
import { Button } from '@/components/site/button';
import { NumberedRows } from '@/components/site/numbered-rows';
import { RotatingBadge } from '@/components/site/rotating-badge';
import podium from '@/assets/blogs/ISDS/podium.webp';

const PRINCIPLES = [
  { index: '01', name: 'Personalized Excellence', statement: 'Your skin. Your goals. Your journey.' },
  { index: '02', name: 'Science-Driven Medicine', statement: 'Innovation backed by evidence.' },
  { index: '03', name: 'Regeneration & Innovation', statement: 'Beyond aesthetics.' },
];

const STATS = [
  { value: '5000+', label: 'Procedures performed' },
  { value: '15+', label: 'Peer-reviewed publications' },
  { value: 'Harvard', label: 'Medical School graduate' },
];

/**
 * Ink on the left 46% of the screen, cream on the right, square-edged. The
 * text and the numbered principles sit on the ink; the ISDS photograph is
 * pulled back over the seam with its caption chip, and three figures sit in
 * ruled rows beside it. Below 960px the ink becomes a full-width block and
 * everything stacks.
 */
export function HomeAbout() {
  return (
    <section
      aria-labelledby="about-title"
      className="relative min-[961px]:bg-cream min-[961px]:before:absolute min-[961px]:before:inset-y-0 min-[961px]:before:left-0 min-[961px]:before:w-[46%] min-[961px]:before:bg-ink min-[961px]:before:content-['']"
    >
      <div className="container-site relative z-[1] grid items-center min-[961px]:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        {/* ---------------- Ink half ---------------- */}
        <div
          data-tone="ink"
          className="scroll-rise -mx-[var(--gutter)] flex flex-col gap-[22px] bg-ink px-[clamp(18px,4vw,32px)] py-16 text-white min-[961px]:mx-0 min-[961px]:bg-transparent min-[961px]:py-[clamp(72px,8vw,112px)] min-[961px]:pr-[clamp(80px,9vw,140px)] min-[961px]:pl-0"
        >
          <Eyebrow onDark>About me</Eyebrow>

          <h2 id="about-title" className="m-0 type-h2 text-white">
            Designed for results.
            <br />
            Grounded in science.
          </h2>

          <p className="m-0 type-body text-[#CFC8BC]">
            With over 12 years of dedicated practice in aesthetic medicine, Dr.
            Christeen Youssef has established herself as a leading authority in
            non-surgical facial rejuvenation.
          </p>

          <NumberedRows
            items={PRINCIPLES.map(({ index, name, statement }) => ({ index, title: name, body: statement }))}
          />

          <div className="flex flex-wrap items-center gap-5">
            <span className="font-display text-[26px] italic">Christeen Youssef</span>
            <Button href="/about-me" variant="outline-light">
              Read full profile
            </Button>
          </div>
        </div>

        {/* ---------------- Cream half ---------------- */}
        <div className="grid items-center gap-[clamp(28px,4vw,56px)] py-[clamp(56px,6vw,90px)] min-[961px]:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <figure className="scroll-rise relative m-0 min-[961px]:-ml-[12%]">
            <div className="group relative aspect-[4/5] overflow-hidden rounded-[16px] bg-page shadow-[0_34px_70px_rgba(0,0,0,0.3)]">
              <Image
                src={podium}
                alt="Dr. Christeen Youssef speaking at the 44th ISDS Annual Meeting"
                fill
                placeholder="blur"
                sizes="(min-width: 961px) 34vw, 92vw"
                className="object-cover object-[50%_32%] transition-transform duration-1000 ease-[cubic-bezier(.2,.7,.2,1)] group-hover-fine:scale-[1.05]"
              />
            </div>
            <figcaption className="absolute bottom-4 left-4 rounded-[12px] bg-cream px-3.5 py-2.5 text-[12.5px]/[1.4] text-text">
              <b className="font-semibold">44th ISDS Annual Meeting</b>
              <br />
              <span className="text-caption-strong">Abu Dhabi · Speaker</span>
            </figcaption>
            {/* The gold seal on the photo's top-right corner — a sibling of the
                clipped image box, so it is not cut off. Raised 28px more from
                1024–1279px, where the stats column starts higher and its first
                figure would sit under the seal. It spins on its own
                transform, so the phone-size scale sits on this wrapper. */}
            <div className="pointer-events-none absolute -top-9 -right-5 z-[5] scale-[0.72] lg:-top-[84px] lg:-right-14 lg:scale-100 xl:-top-14">
              <RotatingBadge />
            </div>
          </figure>

          <dl className="scroll-stagger m-0 flex flex-col">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-0.5 border-t border-line py-5 last:border-b">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="m-0 font-display text-[clamp(38px,3.4vw,52px)] leading-none text-text">
                  {stat.value}
                </dd>
                <dd aria-hidden className="m-0 text-[13.5px] text-caption-strong">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
