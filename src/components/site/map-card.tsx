import { schedule } from '@/data/schedule';
import { cn } from '@/lib/utils';

export const DIRECTIONS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(schedule.address)}`;

/** EVERLAST WELLNESS MEDICAL CENTER → Everlast Wellness Medical Center. */
const CLINIC = schedule.clinicName
  .toLowerCase()
  .replace(/\b\p{L}/gu, (letter) => letter.toUpperCase());

/** "446 Al Khaleej Al Arabi St, Al Bateen, Abu Dhabi, UAE" → "Al Bateen, Abu Dhabi". */
const AREA = schedule.address.split(', ').slice(1, 3).join(', ');

/**
 * Where the clinic is, without a map embed: a drawn street plan in the site's
 * palette (not a real map — no API, nothing loaded), a gold pin, and a card
 * with the clinic and a Directions link. The whole card is one link to Google
 * Maps directions. The drawing is decoration (aria-hidden) and fills any shape
 * (preserveAspectRatio slice), so the card can be 16/10 or 4/3.
 */
export function MapCard({ className }: { className?: string }) {
  return (
    <a
      href={DIRECTIONS_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Get directions to ${CLINIC} (opens Google Maps)`}
      className={cn(
        'group relative block aspect-[4/3] overflow-hidden rounded-card bg-page shadow-sm transition-[translate,box-shadow] duration-300 ease-out lg:aspect-[16/10]',
        'hover-fine:-translate-y-1 hover-fine:shadow-md',
        'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold',
        className,
      )}
    >
      <svg
        aria-hidden
        focusable="false"
        viewBox="0 0 800 500"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 size-full"
      >
        {/* Land, a shade lighter than the page tone. */}
        <rect width="800" height="500" fill="#EFEAE1" />
        {/* A couple of blocks in the page tone, so the plan is not flat. */}
        <path d="M70 40h170v110H70z M520 60h150v90H520z M110 200h130v40H110z M560 196h170v44H560z" fill="#ECE6DC" />

        {/* Minor roads: thin, in the line colour. */}
        <g stroke="#E2DBD0" strokeWidth="7" strokeLinecap="round" fill="none">
          <path d="M-20 120 L820 160" />
          <path d="M300 -20 L250 520" />
          <path d="M610 -20 L690 520" />
          <path d="M-20 262 C200 246 360 282 820 252" />
        </g>

        {/* Main roads: wide white strokes crossing at angles. */}
        <g stroke="#FFFFFF" strokeLinecap="round" fill="none">
          <path d="M-40 230 L840 170" strokeWidth="26" />
          <path d="M150 -40 L520 540" strokeWidth="22" />
          <path d="M760 -40 L430 540" strokeWidth="20" />
          <path d="M-40 60 L460 -40" strokeWidth="18" />
        </g>

        {/* Water along the bottom — the Gulf shore — high enough to show
            above the info card. */}
        <path d="M-20 318 C120 296 230 330 360 310 C500 288 610 322 820 296 L820 520 L-20 520 Z" fill="#DCE4E3" />
        <path d="M-20 318 C120 296 230 330 360 310 C500 288 610 322 820 296" stroke="#CFD9D8" strokeWidth="3" fill="none" />
      </svg>

      {/* The pin: HTML over the drawing so it keeps its size at any width;
          centre-upper, with a soft gold halo that pulses (globals.css). */}
      <span aria-hidden className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-full">
        <span className="map-halo absolute bottom-0 left-1/2 size-14 -translate-x-1/2 translate-y-1/2 rounded-full bg-gold/20" />
        <svg
          viewBox="0 0 36 48"
          className="relative block h-12 w-9 drop-shadow-[0_6px_10px_rgba(23,21,15,0.25)] transition-transform duration-300 ease-out group-hover-fine:-translate-y-0.5"
        >
          <path d="M18 0C8.06 0 0 8.06 0 18c0 12.6 15.6 28.2 16.26 28.86a2.46 2.46 0 0 0 3.48 0C20.4 46.2 36 30.6 36 18 36 8.06 27.94 0 18 0z" fill="#B8892A" />
          <circle cx="18" cy="18" r="6.5" fill="#FFFFFF" />
        </svg>
      </span>

      {/* The card. */}
      <span className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-4 rounded-[12px] bg-cream px-4 py-3 shadow-[0_8px_24px_rgba(23,21,15,0.12)]">
        <span className="flex min-w-0 flex-col">
          <span className="text-[15px] leading-snug font-semibold text-ink">{CLINIC}</span>
          <span className="text-[13px] text-soft">{AREA}</span>
        </span>
        <span className="inline-flex shrink-0 items-center gap-1.5 text-[14px] font-medium text-ink">
          Directions
          <span aria-hidden className="transition-transform duration-300 group-hover-fine:translate-x-1">
            →
          </span>
        </span>
      </span>
    </a>
  );
}
