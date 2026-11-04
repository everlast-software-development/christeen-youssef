import type { ReactNode } from 'react';
import { Eyebrow } from '@/components/site/layout';
import { Button } from '@/components/site/button';
import { QUADRANT_ICON, QuadrantGrid } from '@/components/site/quadrant-grid';

type Focus = { title: string; body: string; icon: ReactNode };

const ICON = QUADRANT_ICON;

const FOCUS: Focus[] = [
  {
    title: 'Cell-Based Therapies',
    body: 'Mesenchymal stem cell-based therapies for skin and tissue healing.',
    icon: (
      <svg {...ICON}>
        <path d="M12 3v18 M8 6c2 1 6 1 8 0 M8 12c2 1 6 1 8 0 M8 18c2 1 6 1 8 0" />
      </svg>
    ),
  },
  {
    title: 'SVF & Nanofat',
    body: 'Stromal vascular fraction and nanofat for regeneration.',
    icon: (
      <svg {...ICON}>
        <path d="M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11z" />
      </svg>
    ),
  },
  {
    title: 'Wound & Scar Healing',
    body: 'Burn scars, chronic wounds and diabetic foot ulcers.',
    icon: (
      <svg {...ICON}>
        <path d="M4 12h4l2-5 4 10 2-5h4" />
      </svg>
    ),
  },
  {
    title: 'Tissue Bioengineering',
    body: 'Where dermatology, research and bioengineering meet.',
    icon: (
      <svg {...ICON}>
        <path d="M12 2l8 4.5v9L12 20l-8-4.5v-9z M12 11v9 M4 6.5l8 4.5 8-4.5" />
      </svg>
    ),
  },
];

/**
 * Signature focus. Ink with a warm lift on the right and one soft gold glow
 * drifting behind the grid; the heading, text, gold action and ISDS line on
 * the left; the four focus areas as quadrants of one frosted panel on the
 * right. Hovering a quadrant fills its icon circle gold.
 */
export function HomeRegenerative() {
  return (
    <section
      data-tone="ink"
      aria-labelledby="regen-title"
      className="relative overflow-clip py-[clamp(64px,7vw,104px)] text-white"
      style={{ background: 'radial-gradient(ellipse 50% 70% at 85% 50%, #2B261D 0%, #17150F 70%)' }}
    >
      <span
        aria-hidden
        className="animate-blob absolute top-[20%] right-[18%] size-[420px] rounded-full blur-[10px]"
        style={{ background: 'radial-gradient(closest-side, rgba(217,181,102,0.22), rgba(217,181,102,0))' }}
      />

      <div className="container-site relative z-[2] grid items-center gap-[clamp(36px,5vw,80px)] min-[961px]:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div className="scroll-rise flex flex-col gap-[22px]">
          <Eyebrow onDark>Signature focus</Eyebrow>
          <h2 id="regen-title" className="m-0 text-[clamp(34px,3.6vw,54px)] leading-[1.06] text-white">
            Regenerative Medicine &amp; Tissue Repair
          </h2>
          <p className="m-0 type-body text-[#CFC8BC]">
            Exploring innovative regenerative approaches to skin and tissue
            healing, including advanced cell-based and biologically inspired
            therapies at the intersection of dermatology, research, and tissue
            bioengineering.
          </p>
          <div className="flex flex-col items-start gap-4 pt-1">
            <Button href="/before-and-after" variant="gold">
              Explore treatment
            </Button>
            <span className="inline-flex items-center gap-2.5 text-[13.5px] text-[#9E978B]">
              <span aria-hidden className="size-[7px] shrink-0 rounded-full bg-gold" />
              Speaker on regenerative dermatology · 44th ISDS Annual Meeting
            </span>
          </div>
        </div>

        <QuadrantGrid
          items={FOCUS.map((item, i) => ({ ...item, label: String(i + 1).padStart(2, '0') }))}
        />
      </div>
    </section>
  );
}
