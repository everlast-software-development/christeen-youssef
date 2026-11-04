import Image from 'next/image';
import { Clock, MapPin } from 'lucide-react';
import { Eyebrow } from '@/components/site/layout';
import { Button } from '@/components/site/button';
import { schedule } from '@/data/schedule';
import portrait from '@/assets/hero-portrait.webp';

const TEL = `tel:${schedule.phone.replace(/\s+/g, '')}`;
const DAYS = `${schedule.workingDays[0]} – ${schedule.workingDays[schedule.workingDays.length - 1]}`;
const HOURS = schedule.hours.replace(' - ', ' – ');

const DETAILS = [
  { icon: MapPin, label: 'Clinic', value: 'Everlast Wellness, Al Bateen' },
  { icon: Clock, label: 'Hours', value: `${DAYS}, ${HOURS}` },
];

type Action = { href: string; label: string };

/**
 * The closing invitation every page ends on — the home page's design, and the
 * only CTA implementation on the site. A warm gold glow on ink, the ask with
 * its two actions and, under a hairline, the clinic and hours; on the right
 * the cut-out portrait standing on the section's bottom edge, its right edge on
 * the container's edge. Below 960px the portrait drops out and everything stacks.
 *
 * The defaults are the home page's copy; a page may pass its own heading,
 * text and actions.
 */
export function CtaBand({
  eyebrow = 'Book a consultation',
  title = 'Ready to discover your best skin?',
  body = 'Schedule a highly personalized consultation today & experience the pinnacle of aesthetic dermatology. Let us craft a bespoke treatment plan exclusively for you.',
  primary = { href: '/reach-me', label: 'Book a consultation' },
  secondary = { href: TEL, label: schedule.phone },
}: {
  eyebrow?: string;
  title?: string;
  body?: string;
  primary?: Action;
  secondary?: Action | null;
}) {
  return (
    <section
      data-tone="ink"
      aria-labelledby="cta-title"
      className="relative overflow-clip text-white"
      style={{ background: 'radial-gradient(ellipse 42% 80% at 80% 60%, #4A3F2A 0%, #17150F 68%)' }}
    >
      <div className="container-site grid items-end gap-8 min-[961px]:grid-cols-[minmax(0,1.25fr)_minmax(0,0.95fr)]">
        <div className="scroll-rise flex flex-col gap-[22px] py-[clamp(80px,8vw,116px)]">
          <Eyebrow onDark>{eyebrow}</Eyebrow>
          <h2 id="cta-title" className="m-0 text-[clamp(36px,3.6vw,56px)] leading-[1.05] text-white">
            {title}
          </h2>
          <p className="m-0 max-w-[500px] text-[16.5px]/[1.75] text-[#CFC8BC]">{body}</p>

          <div className="flex flex-wrap gap-3">
            <Button href={primary.href} variant="gold">
              {primary.label}
            </Button>
            {secondary && (
              <Button href={secondary.href} variant="outline-light">
                {secondary.label}
              </Button>
            )}
          </div>

          <ul className="m-0 mt-1.5 grid max-w-[560px] list-none gap-[18px] border-t border-white/12 p-0 pt-[22px] min-[961px]:grid-cols-2">
            {DETAILS.map(({ icon: Icon, label, value }) => (
              <li key={label} className="flex items-center gap-3">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-white/22 text-eyebrow-dark">
                  <Icon aria-hidden strokeWidth={1.7} className="size-[17px]" />
                </span>
                <span className="flex flex-col leading-[1.4]">
                  <span className="text-[12.5px] text-[#9E978B]">{label}</span>
                  <span className="text-[15px] font-semibold">{value}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* The original portrait, unchanged — only pushed to the column's right
            edge (the container's edge) and standing on the section's bottom. */}
        <div className="relative hidden items-end justify-end self-stretch pt-6 min-[961px]:flex">
          <Image
            src={portrait}
            alt="Dr. Christeen Youssef"
            sizes="560px"
            className="scroll-rise block h-[clamp(480px,42vw,620px)] w-auto max-w-none"
          />
        </div>
      </div>
    </section>
  );
}
