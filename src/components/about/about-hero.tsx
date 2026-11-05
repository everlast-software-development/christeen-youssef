import { Image } from '@/components/ui/image';
import { PageHero } from '@/components/site/page-hero';
import { RotatingBadge } from '@/components/site/rotating-badge';
import heroPortrait from '@/assets/dr-christeen.webp';

const CREDENTIALS = [
  'Dermatologist',
  'Aesthetic & Regenerative Medicine Specialist',
  'International Trainer',
  'Medical Educator',
];

/** How far the arch hangs below the hero into the next section. */
const OVERHANG = 'clamp(220px, 22vw, 310px)';

/**
 * The About opening: the shared inner-page hero with the titles as its intro,
 * and the arch portrait (with the gold seal on its shoulder) in the slot,
 * straddling down into the page colour below.
 */
export function AboutHero() {
  return (
    <PageHero
      section="/about-me"
      title="Dr. Christeen {Youssef}"
      overhang={OVERHANG}
      intro={
        <>
          <p className="m-0">
            {/* Real spaces either side of each dot are the only places the line
                may break, since each title is kept whole. */}
            {CREDENTIALS.map((credential, index) => (
              <span key={credential}>
                {index > 0 && (
                  <>
                    {' '}
                    <span aria-hidden className="mx-1 text-gold-light">
                      ·
                    </span>{' '}
                  </>
                )}
                <span className="whitespace-nowrap">{credential}</span>
              </span>
            ))}
          </p>
          <p className="m-0 mt-3 font-display text-[clamp(20px,1.8vw,24px)] leading-[1.35] text-white italic">
            Where Clinical Excellence Meets Scientific Innovation
          </p>
        </>
      }
    >
      <div className="relative mx-auto w-[min(70vw,420px)]">
        {/* The portrait is a cut-out with faded edges, so the arch carries a
            cream backing to keep its shape against the ink. Radius, clip and
            colour are on this one element, so nothing shows outside the curve. */}
        <div className="animate-arch-up arch relative isolate aspect-[3/4] overflow-hidden bg-cream">
          <Image
            src={heroPortrait}
            alt="Dr. Christeen Youssef smiling, in a blue lace top with an EVSS conference lanyard"
            placeholder="blur"
            preload
            fill
            sizes="(min-width: 600px) 420px, 70vw"
            quality={90}
            className="animate-arch-zoom-settle object-cover object-[50%_15%]"
          />
        </div>
        {/* The seal spins on its own transform, so the phone-size reduction
            sits on this wrapper. */}
        <div className="absolute top-[14%] -right-[30px] z-[3] scale-[0.72] min-[961px]:top-[18%] min-[961px]:-right-[70px] min-[961px]:scale-100">
          <RotatingBadge />
        </div>
      </div>
    </PageHero>
  );
}
