import { useRef } from 'react';
import { Image, type StaticImageData } from '@/components/ui/image';
import { Eyebrow } from '@/components/site/layout';
import { TransitionLink } from '@/components/ui/transition-link';
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '@/lib/gsap';

import introImage from '@/assets/Clinical Expertise & Treatments/dermatology-aesthetics-regenerative-medicine.jpeg';
import acneImage from '@/assets/Clinical Expertise & Treatments/acne-and-acne-scarring.jpeg';
import aestheticImage from '@/assets/Clinical Expertise & Treatments/aesthetic-dermatology.jpeg';
import eczemaImage from '@/assets/Clinical Expertise & Treatments/eczema-psoriasis-skin-conditions.jpeg';
import hairImage from '@/assets/Clinical Expertise & Treatments/hair-and-scalp-health.jpeg';
import rejuvenationImage from '@/assets/Clinical Expertise & Treatments/skin-rejuvenation-collagen-stimulation.jpeg';
import regenerativeImage from '@/assets/Clinical Expertise & Treatments/regenerative-medicine-tissue-repair.jpeg';
import allergyImage from '@/assets/Clinical Expertise & Treatments/allergy-and-clinical-dermatology.jpeg';

type Treatment = {
  index: string;
  title: string;
  body: string;
  image: StaticImageData;
};

const TREATMENTS: Treatment[] = [
  {
    index: '01',
    title: 'Dermatology, Aesthetics & Regenerative Medicine',
    body: 'A comprehensive approach to skin, hair, and aesthetic health — combining clinical expertise, advanced technologies, and evidence-based treatment protocols tailored to every patient.',
    image: introImage,
  },
  {
    index: '02',
    title: 'Acne & Acne Scarring',
    body: 'Personalized treatment plans for acne and post-acne scarring, combining medical therapies and advanced procedures to restore clearer, healthier-looking skin.',
    image: acneImage,
  },
  {
    index: '03',
    title: 'Aesthetic Dermatology',
    body: 'Enhance your natural features through carefully tailored treatments including injectables, skin resurfacing, chemical peels, laser procedures, and non-surgical facial rejuvenation.',
    image: aestheticImage,
  },
  {
    index: '04',
    title: 'Eczema, Psoriasis & Skin Conditions',
    body: 'Comprehensive diagnosis and individualized management of chronic inflammatory skin conditions, with a focus on effective treatment and long-term skin health.',
    image: eczemaImage,
  },
  {
    index: '05',
    title: 'Hair & Scalp Health',
    body: 'Advanced approaches to hair loss and scalp disorders, including regenerative treatments such as PRP, alongside evidence-based medical therapies and personalized treatment plans.',
    image: hairImage,
  },
  {
    index: '06',
    title: 'Skin Rejuvenation & Collagen Stimulation',
    body: 'Restore skin quality, texture, and radiance through advanced rejuvenation technologies designed to stimulate collagen, improve skin tone, and address signs of aging.',
    image: rejuvenationImage,
  },
  {
    index: '07',
    title: 'Regenerative Medicine & Tissue Repair',
    body: 'Exploring innovative regenerative approaches to skin and tissue healing, including advanced cell-based and biologically inspired therapies at the intersection of dermatology, research, and tissue bioengineering.',
    image: regenerativeImage,
  },
  {
    index: '08',
    title: 'Allergy & Clinical Dermatology',
    body: 'Accurate assessment and personalized management of allergic and dermatological conditions, combining clinical evaluation, targeted treatment, and long-term care strategies.',
    image: allergyImage,
  },
];

function TreatmentCard({ item }: { item: Treatment }) {
  return (
    <TransitionLink
      href="/before-and-after"
      className="group relative flex aspect-[3/4] w-[clamp(260px,24vw,320px)] shrink-0 flex-col justify-end overflow-hidden rounded-[16px] bg-ink text-white"
    >
      <Image
        src={item.image}
        alt={item.title}
        fill
        placeholder="blur"
        sizes="320px"
        className="object-cover transition-transform duration-1000 ease-[cubic-bezier(.2,.7,.2,1)] group-hover-fine:scale-[1.05]"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(23,21,15,0) 45%, rgba(23,21,15,0.85) 100%)' }}
      />
      <span className="absolute top-3.5 left-3.5 rounded-full bg-cream px-[11px] py-[3px] text-[12px] font-semibold text-text tabular-nums">
        {item.index}
      </span>
      <div className="relative flex flex-col gap-1.5 p-5">
        <h3 className="m-0 type-h3 text-white">{item.title}</h3>
        <span className="text-[13px] font-semibold text-[#E9DFC9]">Learn more →</span>
      </div>
    </TransitionLink>
  );
}

/**
 * Above 960px the section is 2.4 screens tall and its content sticks to the
 * top: while it is pinned, the page scroll drives the eight cards sideways
 * and the gold bar in the header fills. That runs on a CSS scroll timeline
 * (globals.css: pin-scroll / pin-track / pin-bar); where those are not
 * supported GSAP scrubs the same movement. Below 960px it is a plain swipe.
 */
export function HomeTreatments() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (CSS.supports('animation-timeline: view()') || prefersReducedMotion()) return;

      const mm = gsap.matchMedia();
      mm.add('(min-width: 961px)', () => {
        const el = track.current;
        if (!el || !section.current) return;
        // Turns on the tall, sticky layout (globals.css) only now that
        // something will actually move inside it.
        section.current.dataset.pinned = '';
        const host = section.current;
        const scrollTrigger = {
          trigger: section.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          invalidateOnRefresh: true,
        };
        gsap.to(el, {
          // The CSS version's end: -100% + 100vw - 2 × the container edge.
          x: () => {
            const edge = parseFloat(getComputedStyle(el.parentElement!).paddingLeft);
            return Math.min(0, window.innerWidth - el.offsetWidth - 2 * edge);
          },
          ease: 'none',
          scrollTrigger,
        });
        gsap.fromTo(bar.current, { scaleX: 0 }, { scaleX: 1, ease: 'none', transformOrigin: 'left', scrollTrigger });
        ScrollTrigger.refresh();
        return () => {
          delete host.dataset.pinned;
        };
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      aria-labelledby="treatments-title"
      className="pin-scroll relative bg-cream text-text"
    >
      <div className="pin-stage flex flex-col justify-center overflow-clip py-[clamp(64px,7vw,104px)]">
        <div className="mx-auto box-border max-w-[1280px] px-[var(--gutter)]">
          <div className="scroll-rise mb-11 grid items-end gap-x-16 gap-y-5 min-[961px]:grid-cols-2">
            <div className="flex flex-col gap-3.5">
              <Eyebrow>Clinical expertise</Eyebrow>
              <h2 id="treatments-title" className="m-0 type-h2 text-text">
                Treatments &amp; Care
              </h2>
            </div>
            <div className="flex flex-col items-start gap-[18px]">
              <p className="m-0 max-w-[500px] type-body text-soft">
                Every treatment plan is uniquely crafted to honor individual facial
                anatomy and aesthetic goals.
              </p>
              <div aria-hidden className="h-0.5 w-[220px] bg-line">
                <div ref={bar} className="pin-bar h-full bg-gold" />
              </div>
            </div>
          </div>
        </div>

        <div className="pl-[max(var(--gutter),calc((100vw-1232px)/2))]">
          <ul
            ref={track}
            aria-label="Treatments"
            className="pin-track no-scrollbar m-0 flex max-w-full list-none gap-4 overflow-x-auto p-0 pr-[var(--gutter)]"
          >
            {TREATMENTS.map((item) => (
              <li key={item.index} className="shrink-0">
                <TreatmentCard item={item} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
