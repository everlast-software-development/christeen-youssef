import Image, { type StaticImageData } from 'next/image';
import { cn } from '@/lib/utils';

import arabicMark from '@/assets/partners/arabic-wordmark.webp';
import brideImage from '@/assets/partners/bride-abu-dhabi.webp';
import aptosImage from '@/assets/partners/aptos.webp';
import falconMark from '@/assets/partners/falcon-emblem.webp';
import imcasImage from '@/assets/partners/imcas.webp';
import faceImage from '@/assets/partners/face-conference.webp';
import eadvImage from '@/assets/partners/eadv.webp';
import aadImage from '@/assets/partners/aad.webp';
import aidaImage from '@/assets/partners/aida.webp';

type Partner = { name: string; logo: StaticImageData };

export const PARTNERS: Partner[] = [
  { name: 'Partner — Arabic calligraphic wordmark', logo: arabicMark },
  { name: 'Bride Abu Dhabi', logo: brideImage },
  { name: 'Aptos Thread Lifting Methods', logo: aptosImage },
  { name: 'Partner — falcon emblem', logo: falconMark },
  { name: 'IMCAS', logo: imcasImage },
  { name: 'FACE — Facial Aesthetic Conference and Exhibition', logo: faceImage },
  { name: 'European Academy of Dermatology and Venereology', logo: eadvImage },
  { name: 'American Academy of Dermatology Association', logo: aadImage },
  { name: 'AIDA', logo: aidaImage },
];

// Only the logos fade at the ends — the card's own edge stays crisp because
// the mask is on this inner strip, not on the card.
const EDGE_MASK =
  'linear-gradient(to right, transparent 0, #000 12%, #000 88%, transparent 100%)';

/**
 * Partner logos on an endless loop: the list twice in one track, translated
 * by half its width over 38s, paused while hovered. The second copy is hidden
 * from assistive tech. Reduced motion stops the loop and wraps the single
 * copy instead.
 *
 * `order` re-sequences the marks by name; `itemClassName` / `logoClassName`
 * size the cells and the marks (the home page uses the reference's 110×60
 * marks with 34px either side).
 */
export function LogoMarquee({
  order,
  mask = EDGE_MASK,
  itemClassName = 'h-20 w-[8.5rem] px-4 sm:w-[10rem]',
  logoClassName = 'h-16 opacity-75',
}: {
  order?: string[];
  mask?: string;
  itemClassName?: string;
  logoClassName?: string;
} = {}) {
  const partners = order
    ? order.flatMap((name) => PARTNERS.filter((partner) => partner.name === name))
    : PARTNERS;

  const row = (copy: number) =>
    partners.map((partner) => (
      <li
        key={`${copy}-${partner.name}`}
        className={cn('flex shrink-0 items-center justify-center', itemClassName)}
      >
        <Image
          src={partner.logo}
          alt={copy === 0 ? partner.name : ''}
          sizes="110px"
          className={cn(
            'w-auto max-w-full object-contain grayscale transition-[filter,opacity] duration-500 hover-fine:opacity-100 hover-fine:grayscale-0',
            logoClassName,
          )}
        />
      </li>
    ));

  return (
    <div
      className="group overflow-hidden"
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    >
      <div className="animate-marquee flex w-max group-hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none">
        <ul className="flex motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center">
          {row(0)}
        </ul>
        <ul aria-hidden className="flex motion-reduce:hidden">
          {row(1)}
        </ul>
      </div>
    </div>
  );
}
