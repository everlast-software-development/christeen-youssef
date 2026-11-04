import Image, { type StaticImageData } from 'next/image';
import { Eyebrow } from '@/components/site/layout';
import { CARD, CARD_TONE } from '@/components/site/surfaces';
import { cn } from '@/lib/utils';
import aestheticImage from '@/assets/Clinical Expertise & Treatments/aesthetic-dermatology.jpeg';
import moderators from '@/assets/blogs/ISDS/moderators.webp';
import rejuvenationImage from '@/assets/Clinical Expertise & Treatments/skin-rejuvenation-collagen-stimulation.jpeg';
import teaching from '@/assets/EBD Teaching blog. (2).webp';

type Photo = { kind: 'image'; image: StaticImageData; alt: string; focus?: string };
type Figure = { kind: 'card'; value: string; title: string; body: string };
type Tile = Photo | Figure;

// Four columns, alternating image-first and card-first, as in the reference.
const COLUMNS: [Tile, Tile][] = [
  [
    { kind: 'image', image: aestheticImage, alt: 'Aesthetic dermatology' },
    { kind: 'card', value: '12+', title: 'Years of experience', body: 'Dedicated practice in aesthetic medicine.' },
  ],
  [
    { kind: 'card', value: '20+', title: 'Industry awards', body: 'Recognised for clinical excellence.' },
    { kind: 'image', image: moderators, alt: 'Dr. Christeen Youssef at ISDS', focus: '50% 30%' },
  ],
  [
    { kind: 'image', image: rejuvenationImage, alt: 'Skin rejuvenation treatment' },
    { kind: 'card', value: '22K+', title: 'Patients treated', body: 'Natural, harmonious results.' },
  ],
  [
    { kind: 'card', value: '15+', title: 'Publications', body: 'Peer-reviewed research and global conferences.' },
    { kind: 'image', image: teaching, alt: 'Hands-on laser training course' },
  ],
];

function TileView({ tile }: { tile: Tile }) {
  if (tile.kind === 'image') {
    return (
      <div className="group relative h-[270px] overflow-hidden rounded-[16px] bg-page">
        <Image
          src={tile.image}
          alt={tile.alt}
          fill
          placeholder="blur"
          sizes="(min-width: 961px) 300px, 46vw"
          style={tile.focus ? { objectPosition: tile.focus } : undefined}
          className="object-cover transition-transform duration-1000 ease-[cubic-bezier(.2,.7,.2,1)] group-hover-fine:scale-[1.05]"
        />
      </div>
    );
  }

  return (
    <div className={cn(CARD, CARD_TONE.cream, 'h-[200px]')}>
      <span className="font-display text-[36px] leading-none text-text">{tile.value}</span>
      <span className="pt-1.5 text-[15px] font-semibold text-text">{tile.title}</span>
      <span className="text-[13.5px]/[1.55] text-caption-strong">{tile.body}</span>
    </div>
  );
}

export function HomeTrust() {
  return (
    <section aria-labelledby="trust-title" className="relative bg-page py-[clamp(64px,7vw,104px)] text-text">
      <div className="container-site">
        <header className="scroll-rise mb-11 grid items-end gap-x-16 gap-y-5 min-[961px]:grid-cols-2">
          <div className="flex flex-col gap-3.5">
            <Eyebrow>Proven excellence</Eyebrow>
            <h2 id="trust-title" className="m-0 type-h2 text-text">
              Built on Trust
            </h2>
          </div>
          <p className="m-0 max-w-[500px] type-body text-soft">
            A graduate of Harvard Medical School and the American Academy of Aesthetic Medicine.
          </p>
        </header>

        <ul className="scroll-stagger-cols m-0 grid list-none grid-cols-2 items-start gap-4 p-0 min-[961px]:grid-cols-4">
          {COLUMNS.map((column, i) => (
            <li key={i} className="flex flex-col gap-4">
              <TileView tile={column[0]} />
              <TileView tile={column[1]} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
