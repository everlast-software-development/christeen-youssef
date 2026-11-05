import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Eyebrow } from '@/components/site/layout';
import { LogoMarquee } from '@/components/site/logo-marquee';
import { GLASS_PANEL } from '@/components/site/surfaces';
import { testimonials } from '@/data/testimonials';

const EASE = [0.16, 1, 0.3, 1] as const;

// The reference opens on Lamy S; the rest follow in their usual order.
const START = Math.max(
  0,
  testimonials.findIndex((item) => item.name === 'Lamy S'),
);
const ORDERED = [...testimonials.slice(START), ...testimonials.slice(0, START)];

const initial = (name: string) =>
  name.replace(/^(Ms\.|Mr\.|Mrs\.|Dr\.)\s*/, '').charAt(0);

const ICON = {
  width: 17,
  height: 17,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

const AREAS: { label: string; icon: ReactNode }[] = [
  {
    label: 'Advanced Injectables',
    icon: (
      <svg {...ICON}>
        <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />
      </svg>
    ),
  },
  {
    label: 'Facial Harmonization',
    icon: (
      <svg {...ICON}>
        <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
      </svg>
    ),
  },
  {
    label: 'Laser Resurfacing',
    icon: (
      <svg {...ICON}>
        <path d="M12 3v3 M12 18v3 M3 12h3 M18 12h3 M8 12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
      </svg>
    ),
  },
  {
    label: 'Scar Revision',
    icon: (
      <svg {...ICON}>
        <path d="M4 12c3-6 13-6 16 0 M7 15c2-2 8-2 10 0" />
      </svg>
    ),
  },
  {
    label: 'Medical Dermatology',
    icon: (
      <svg {...ICON}>
        <path d="M12 7v10 M7 12h10 M5 4h14v16H5z" />
      </svg>
    ),
  },
  {
    label: 'Skin Rejuvenation',
    icon: (
      <svg {...ICON}>
        <path d="M12 4a8 8 0 1 0 8 8 M12 8a4 4 0 1 0 4 4 M17 3l.7 1.8L19.5 5.5l-1.8.7L17 8l-.7-1.8L14.5 5.5l1.8-.7z" />
      </svg>
    ),
  },
];

// The reference's logo order.
const LOGO_ORDER = [
  'IMCAS',
  'European Academy of Dermatology and Venereology',
  'American Academy of Dermatology Association',
  'AIDA',
  'FACE — Facial Aesthetic Conference and Exhibition',
  'Aptos Thread Lifting Methods',
  'Bride Abu Dhabi',
  'Partner — falcon emblem',
  'Partner — Arabic calligraphic wordmark',
];

// The logo strip, rule included, fades out at both ends.
const FADE = 'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)';


/**
 * Patient stories on ink: the heading with the arrows beside it, a large
 * glass card holding the current testimonial and a glass list of the areas
 * of expertise, then the partner logos, in white, running underneath.
 */
export function HomeStories() {
  const [index, setIndex] = useState(0);
  const total = ORDERED.length;
  const current = ORDERED[index];

  const go = (step: number) => setIndex((value) => (value + step + total) % total);

  const arrow =
    'tap-target relative inline-flex size-[42px] items-center justify-center rounded-full border border-white/28 text-white transition-colors duration-200 hover-fine:bg-white hover-fine:text-ink';

  return (
    <section
      data-tone="ink"
      aria-labelledby="stories-title"
      className="relative overflow-clip py-[clamp(64px,7vw,104px)] text-white"
      style={{ background: 'radial-gradient(ellipse 60% 70% at 50% 0%, #2B261D 0%, #17150F 70%)' }}
    >
      <div className="container-site relative z-[2]">
        <div className="scroll-rise mb-11 grid items-end gap-x-16 gap-y-5 min-[961px]:grid-cols-2">
          <div className="flex flex-col gap-3.5">
            <Eyebrow onDark>What our patients say</Eyebrow>
            <h2 id="stories-title" className="m-0 type-h2 text-white">
              Patient Stories
            </h2>
          </div>
          <div className="flex gap-2">
            <button type="button" className={arrow} onClick={() => go(-1)} aria-label="Previous testimonial">
              <ArrowLeft aria-hidden strokeWidth={2} className="size-3.5" />
            </button>
            <button type="button" className={arrow} onClick={() => go(1)} aria-label="Next testimonial">
              <ArrowRight aria-hidden strokeWidth={2} className="size-3.5" />
            </button>
          </div>
        </div>

        <div className="scroll-stagger grid gap-4 min-[961px]:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
          <div className={`flex flex-col gap-[18px] p-[clamp(26px,3vw,40px)] ${GLASS_PANEL}`}>
            <span aria-hidden className="font-display text-[54px] leading-[0.6] text-gold">
              &ldquo;
            </span>
            <div aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.figure
                  key={current.id}
                  className="m-0 flex flex-col gap-[18px]"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <blockquote className="m-0 min-h-[4em] type-quote text-white">
                    {current.content}
                  </blockquote>
                  <figcaption className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="inline-flex size-[42px] shrink-0 items-center justify-center rounded-full bg-gold-deep font-semibold text-white"
                    >
                      {initial(current.name)}
                    </span>
                    <span className="flex flex-col leading-[1.35]">
                      <span className="font-semibold text-white">{current.name}</span>
                      <span className="text-[13px] text-[#B0A898]">{current.role ?? 'Patient'}</span>
                    </span>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>
          </div>

          <div className={`flex flex-col gap-3.5 p-[clamp(24px,3vw,32px)] ${GLASS_PANEL}`}>
            <Eyebrow onDark as="h3" className="m-0">
              Areas of expertise
            </Eyebrow>
            <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
              {AREAS.map((area) => (
                <li
                  key={area.label}
                  className="flex items-center gap-3 border-t border-white/10 py-2.5 type-nav"
                >
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-[rgba(217,181,102,0.12)] text-gold-light">
                    {area.icon}
                  </span>
                  {area.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          role="region"
          aria-label="Partners & affiliations"
          className="mt-7 border-t border-white/12 pt-[22px]"
          style={{ maskImage: FADE, WebkitMaskImage: FADE }}
        >
          <LogoMarquee
            order={LOGO_ORDER}
            mask="none"
            itemClassName="px-8"
            logoClassName="h-14 w-[104px] brightness-0 invert opacity-50"
          />
        </div>
      </div>
    </section>
  );
}
