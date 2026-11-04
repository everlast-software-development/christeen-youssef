import { useId } from 'react';
import { cn } from '@/lib/utils';

const RING = 'Dr. Christeen Youssef · Aesthetic Dermatology · ';

// The text path's radius; the ring text is stretched to exactly its length so
// the words meet end to start and nothing runs off the end of the path.
const R = 52;
const CIRCUMFERENCE = 2 * Math.PI * R;

/**
 * The gold seal: a 140px disc with the name running round its edge, turning
 * slowly, and the CY mark still at its centre. Decorative — the name is
 * already on the page as text.
 */
export function RotatingBadge({ className }: { className?: string }) {
  const id = useId();

  return (
    <div aria-hidden className={cn('relative size-[140px]', className)}>
      <svg viewBox="0 0 140 140" className="animate-spin-slow absolute inset-0 size-full">
        <defs>
          <path id={id} d={`M70 70 m-${R} 0 a${R} ${R} 0 1 1 ${R * 2} 0 a${R} ${R} 0 1 1 -${R * 2} 0`} />
        </defs>
        {/* The disc carries type, so it is gold-deep with white lettering; the
            outer ring stays the brand gold as a pure accent. */}
        <circle cx="70" cy="70" r="70" fill="var(--gold-deep)" />
        <circle cx="70" cy="70" r="68.5" fill="none" stroke="var(--gold)" strokeWidth="3" />
        <circle cx="70" cy="70" r="38" fill="none" stroke="rgba(255,255,255,0.3)" />
        <text fontSize="10" fill="#ffffff" fontWeight="600">
          <textPath href={`#${id}`} textLength={CIRCUMFERENCE - 1} lengthAdjust="spacing">{RING.toUpperCase()}</textPath>
        </text>
      </svg>
      <img
        src="/favicon.webp"
        alt=""
        width={40}
        height={40}
        className="absolute top-1/2 left-1/2 size-10 -translate-1/2 brightness-0 invert"
      />
    </div>
  );
}
