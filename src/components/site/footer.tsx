import { Image } from '@/components/ui/image';
import { TransitionLink } from '@/components/ui/transition-link';
import { Container } from '@/components/site/layout';
import { SocialLinks } from '@/components/site/social-links';
import { navigationItems } from '@/data/navigation';
import { schedule } from '@/data/schedule';
import logoInk from '@/assets/Dr.-CY-Logo-FINAL-023-scaled (1).webp';

const TEL = `tel:${schedule.phone.replace(/\s+/g, '')}`;
const HOURS = `${schedule.workingDays[0]} – ${schedule.workingDays[schedule.workingDays.length - 1]}, ${schedule.hours.replace(' - ', ' – ')}`;
const DIRECTIONS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(schedule.address)}`;

const Dot = () => (
  <span aria-hidden className="mx-2.5 text-caption">
    ·
  </span>
);

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-cream text-text">
      <Container className="pt-8 pb-[26px]">
        <div className="flex flex-col items-start gap-6 border-b border-line pb-[22px] lg:flex-row lg:items-center lg:justify-between">
          <TransitionLink
            href="/"
            aria-label="Dr. Christeen Youssef — home"
            className="shrink-0 rounded-sm"
          >
            <Image src={logoInk} alt="" sizes="160px" className="h-[38px] w-auto" />
          </TransitionLink>

          <nav aria-label="Footer" className="self-stretch lg:self-auto">
            <ul className="flex flex-wrap justify-center gap-x-7 gap-y-2">
              {navigationItems.map((item) => (
                <li key={item.href}>
                  <TransitionLink
                    href={item.href}
                    className="type-nav text-soft transition-colors hover-fine:text-ink"
                  >
                    {item.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>

          <SocialLinks tone="light" />
        </div>

        <div className="flex flex-col items-start gap-2.5 pt-[18px] text-[13px] text-caption-strong lg:flex-row lg:items-end lg:justify-between">
          <p className="m-0">
            &copy; {new Date().getFullYear()} Dr. Christeen Youssef. All rights
            reserved.
          </p>
          <address className="flex flex-col gap-1 not-italic lg:items-end lg:text-right">
            <p className="m-0">
              <span className="font-semibold text-text">{schedule.clinicName}</span>
              <Dot />
              {schedule.address}
              <Dot />
              <a
                href={DIRECTIONS}
                target="_blank"
                rel="noopener noreferrer"
                className="whitespace-nowrap text-gold-text underline decoration-gold/50 underline-offset-4 transition-colors hover-fine:text-ink"
              >
                Directions
              </a>
            </p>
            <p className="m-0">
              <span className="whitespace-nowrap">{HOURS}</span>
              <Dot />
              <a href={TEL} className="whitespace-nowrap transition-colors hover-fine:text-ink">
                {schedule.phone}
              </a>
            </p>
          </address>
        </div>
      </Container>
    </footer>
  );
}
