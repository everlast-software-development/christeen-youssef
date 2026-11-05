import { Image } from '@/components/ui/image';
import { Eyebrow } from '@/components/site/layout';
import { Button } from '@/components/site/button';
import { Counter } from '@/components/site/counter';
import { WordReveal } from '@/components/site/word-reveal';
import { stats } from '@/data/stats';
import portrait from '@/assets/dr-christeen-cutout.webp';

const byLabel = (label: string) => stats.find((stat) => stat.label === label);

const years = byLabel('Years Experience');
const patients = byLabel('Patients Transformed');
const awards = byLabel('Industry Awards');

type HeroStat = {
  value?: number;
  suffix?: string;
  text?: string;
  label: string;
};

// Two stats either side of the arch, side by side, as in the reference.
const LEFT: HeroStat[] = [
  { value: years?.value, suffix: years?.suffix, label: 'Years of practice' },
  { value: patients?.value, suffix: patients?.suffix, label: 'Patients treated' },
];

const RIGHT: HeroStat[] = [
  { value: awards?.value, suffix: awards?.suffix, label: 'Industry awards' },
  { text: 'Harvard', label: 'Medical School' },
];

/** Header height (88px) plus the reference's clamp(40px, 5vw, 80px). */
const CONTENT_TOP = 'calc(88px + clamp(40px, 5vw, 80px))';

function Stat({ stat, align }: { stat: HeroStat; align: 'left' | 'right' }) {
  return (
    <div className={`flex flex-col gap-1 ${align === 'right' ? 'text-right' : 'text-left'}`}>
      <span className="type-stat text-ink">
        {stat.value !== undefined ? (
          <Counter value={stat.value} suffix={stat.suffix} trigger="load" delay={900} duration={1.8} />
        ) : (
          stat.text
        )}
      </span>
      <span className="text-[13.5px] text-caption-strong">{stat.label}</span>
    </div>
  );
}

/**
 * The opening: an ink band with a soft radial lift at the top, the centred
 * headline on two lines and the two actions; then the arch
 * portrait straddling the band's lower edge, two stats either side of it,
 * bottom-aligned, and the patient line beneath. Below 960px the stats drop
 * out and the arch takes the full width.
 */
export function HomeHero() {
  return (
    <section aria-labelledby="hero-title" className="relative bg-page">
      {/* ---------------- The ink band ---------------- */}
      <div
        data-tone="ink"
        className="relative overflow-hidden text-white"
        style={{
          background: 'radial-gradient(ellipse 60% 70% at 50% 0%, #2E2A22 0%, #17150F 70%)',
        }}
      >
        <div
          className="relative z-[2] flex flex-col items-center gap-6 px-[clamp(20px,4vw,56px)] pb-[clamp(260px,26vw,360px)] text-center"
          style={{ paddingTop: CONTENT_TOP }}
        >
          <Eyebrow onDark className="animate-fade-up">
            Aesthetic Dermatology · Abu Dhabi
          </Eyebrow>

          <h1
            id="hero-title"
            className="m-0 max-w-[1000px] type-display text-white"
          >
            <WordReveal text="Discover Your Most Radiant Self" delay={250} step={90} />
          </h1>

          <p
            className="animate-fade-up m-0 max-w-[600px] type-lead text-[#CFC8BC]"
            style={{ animationDelay: '180ms' }}
          >
            With over a decade of clinical expertise, Dr. Christeen Youssef
            combines evidence-based aesthetic medicine with regenerative therapies
            and innovative approaches to skin and tissue healing.
          </p>

          <div
            className="animate-fade-up flex flex-wrap justify-center gap-3"
            style={{ animationDelay: '180ms' }}
          >
            <Button href="/reach-me" variant="gold">
              Book a consultation
            </Button>
            <Button href="/before-and-after" variant="outline-light">
              See real results
            </Button>
          </div>
        </div>
      </div>

      {/* ---------------- The arch, straddling the seam ---------------- */}
      <div className="relative -mt-[clamp(220px,22vw,310px)] grid grid-cols-1 items-end gap-8 px-[clamp(20px,4vw,56px)] min-[961px]:grid-cols-[minmax(0,1fr)_minmax(280px,420px)_minmax(0,1fr)]">
        <div
          className="animate-fade-up hidden justify-end gap-10 pb-[30px] min-[961px]:flex"
          style={{ animationDelay: '310ms' }}
        >
          {LEFT.map((stat) => (
            <Stat key={stat.label} stat={stat} align="right" />
          ))}
        </div>

        {/* One clipping box: arch radius, overflow, its own layer (isolate +
            translateZ) so the curve stays smooth through the zoom. Behind the
            cut-out there is only the cream → page gradient; the hairline is
            drawn on top of the photo so the edge reads against the ink. */}
        <div className="animate-arch-up arch relative isolate aspect-[3/4] transform-[translateZ(0)] overflow-hidden bg-linear-to-b from-cream to-page shadow-[0_30px_60px_rgba(23,21,15,0.22)] after:pointer-events-none after:absolute after:inset-0 after:z-10 after:rounded-[inherit] after:ring-1 after:ring-gold/30 after:ring-inset after:content-['']">
          <Image
            src={portrait}
            alt="Dr. Christeen Youssef smiling, in a blue lace top"
            fill
            priority
            // No blur placeholder: on a transparent cut-out it paints a
            // blurred blob; the gradient is the placeholder.
            sizes="(min-width: 961px) 420px, calc(100vw - 26px)"
            className="animate-arch-zoom object-cover object-[50%_20%]"
          />
        </div>

        <div
          className="animate-fade-up hidden justify-start gap-10 pb-[30px] min-[961px]:flex"
          style={{ animationDelay: '310ms' }}
        >
          {RIGHT.map((stat) => (
            <Stat key={stat.label} stat={stat} align="left" />
          ))}
        </div>
      </div>

      <p
        className="animate-fade-up type-eyebrow m-0 pt-[26px] pb-14 text-center text-[13px] text-text"
        style={{ animationDelay: '310ms' }}
      >
        Trusted by more than <span className="text-gold-text">22,000+</span> patients
      </p>
    </section>
  );
}
