'use client';

import Image, { type StaticImageData } from 'next/image';
import { useRef } from 'react';
import { gsap, SplitText, useGSAP } from '@/lib/gsap';

// Renamed from the delivered `1 (1).webp`, `2-1.webp`, `3.webp`… for two
// reasons: a space and parentheses in a filename are exactly the hazard
// documented at the top of expertise-section.tsx, and an import list of bare
// digits tells the next reader nothing about which logo is which.
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

// `name` is the alt text, so it is the accessible name of the logo and the only
// thing a screen reader gets — the marks themselves carry no text layer.
//
// TODO(names): two of these carry no readable name in the artwork — the Arabic
// calligraphic mark and the falcon emblem. They are described rather than named
// because alt text that confidently names the wrong institution is worse than
// alt text that names none. Replace both strings with the real organisations.
const PARTNERS: Partner[] = [
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

// How many copies of the list sit in the track. The loop travels exactly one
// copy and then jumps back, which is only seamless while the copies that are
// left still fill the screen — so `(COPIES - 1) × copyWidth` has to beat the
// widest viewport this will ever run on. Nine logos come to roughly 1700px a
// copy, so three spare copies covers past 5000px: ultrawides included.
const COPIES = 4;

/** Travel in px per second. Slow enough to take a logo in as it passes. */
const SPEED = 70;

// Both edges dissolve rather than cutting off, so logos enter and leave instead
// of appearing. A mask, not two gradient overlays in the section's own colour:
// the mask is decoupled from whatever sits behind it, so changing the section
// background can never leave a pair of mismatched fades behind.
//
// The stop is min(12%, 9rem) so the fade is a proportion of narrow screens but
// stops growing on wide ones, where 12% would eat a third of the row.
const EDGE_FADE =
  'linear-gradient(to right, transparent 0, #000 min(12%, 9rem), #000 calc(100% - min(12%, 9rem)), transparent 100%)';

export function PartnersSection() {
  const rootRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // ---- Header: per-line mask reveal, same device as the other sections ----
      const title = rootRef.current?.querySelector<HTMLElement>('[data-title]');
      const rule = rootRef.current?.querySelector<HTMLElement>('[data-rule]');

      const headerTrigger = {
        trigger: rootRef.current,
        start: 'top 75%',
        once: true,
      } as const;

      if (title) {
        SplitText.create(title, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 120,
              duration: 1.2,
              stagger: 0.12,
              ease: 'power4.out',
              scrollTrigger: headerTrigger,
            }),
        });
      }

      if (rule) {
        gsap.from(rule, {
          scaleX: 0,
          duration: 1.2,
          delay: 0.35,
          ease: 'power3.inOut',
          scrollTrigger: headerTrigger,
        });
      }

      // ---- The marquee ----
      // Gated on prefers-reduced-motion rather than checked once at mount:
      // matchMedia reverts the tween if the setting changes, and this is the
      // only thing on the page that moves without being asked to. The row falls
      // back to an ordinary horizontal scroller — see motion-reduce: below.
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const track = trackRef.current;
        const viewport = viewportRef.current;
        if (!track || !viewport) return;

        // Measured, not assumed: the duration has to come from the real width
        // for the speed to stay constant whatever ends up in the list.
        const copyWidth = track.scrollWidth / COPIES;

        const loop = gsap.to(track, {
          // A percentage, not the measured pixels: on resize the endpoint moves
          // with the track, so the loop stays seamless. Only the speed drifts
          // slightly, which is imperceptible on a marquee this slow.
          xPercent: -100 / COPIES,
          ease: 'none',
          duration: copyWidth / SPEED,
          repeat: -1,
        });

        // Hold still while a logo is being looked at.
        const pause = () => loop.pause();
        const resume = () => loop.play();

        viewport.addEventListener('pointerenter', pause);
        viewport.addEventListener('pointerleave', resume);
        // Keyboard and screen-reader users never fire pointer events, so the
        // focus pair is what makes the pause reachable for them too.
        viewport.addEventListener('focusin', pause);
        viewport.addEventListener('focusout', resume);

        return () => {
          viewport.removeEventListener('pointerenter', pause);
          viewport.removeEventListener('pointerleave', resume);
          viewport.removeEventListener('focusin', pause);
          viewport.removeEventListener('focusout', resume);
        };
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="partners"
      // Opaque and above everything before it: the hero is sticky for the whole
      // page, so a transparent section here would show it through.
      // The hairline is doing real work: Expertise ends on cream too, so
      // without it the two sections read as one continuous field rather than
      // as a section break.
      className="relative z-20 overflow-hidden border-t border-ink/10 bg-cream py-24 text-ink lg:py-32"
    >
      {/* Warm bloom, the same device the other sections use. */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 size-[40rem] -translate-x-1/2 translate-y-1/2 rounded-full opacity-70 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(201,153,40,0.12), transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8 lg:px-12 xl:px-20">
        {/* gold-dark, not gold: #c99928 on cream is close to failing at this
            size, and the dark cut is what the Principles section already uses
            for small type on the same field. */}
        <p className="font-body text-[0.72rem] tracking-[0.24em] text-gold-dark uppercase sm:text-[0.78rem]">
          Partners &amp; Affiliations
        </p>

        <h2
          data-title
          className="mt-5 max-w-[22ch] font-display text-display-sm text-ink"
        >
          Trusted alongside leading institutions
        </h2>

        <div
          data-rule
          aria-hidden
          className="mt-7 h-px w-24 origin-left bg-gradient-gold"
        />
      </div>

      {/* Full-bleed on purpose — the row has to run off both edges of the
          screen for the fade to read as content leaving rather than a list
          ending, so it sits outside the measured container above. */}
      <div
        ref={viewportRef}
        className="relative mt-14 overflow-hidden lg:mt-20 motion-reduce:overflow-x-auto [&::-webkit-scrollbar]:hidden"
        style={{
          maskImage: EDGE_FADE,
          WebkitMaskImage: EDGE_FADE,
          scrollbarWidth: 'none',
        }}
      >
        <div ref={trackRef} className="flex w-max">
          {Array.from({ length: COPIES }, (_, copy) => (
            <ul
              key={copy}
              // Only the first copy is real content. The rest exist to make the
              // loop seamless, so they are hidden from assistive tech — which
              // would otherwise read the same nine names four times over.
              aria-hidden={copy > 0}
              // The duplicates are what the animation consumes; with motion
              // reduced there is no animation, so they would just be a visibly
              // repeating list inside a scroller.
              className={
                copy > 0
                  ? 'flex shrink-0 items-center motion-reduce:hidden'
                  : 'flex shrink-0 items-center'
              }
            >
              {PARTNERS.map((partner) => (
                <li
                  key={partner.name}
                  className="flex shrink-0 items-center justify-center px-8 lg:px-12"
                >
                  <Image
                    src={partner.logo}
                    // The duplicate copies are aria-hidden as a whole, so their
                    // images need no alt of their own to stay silent.
                    alt={copy === 0 ? partner.name : ''}
                    // The artwork is nine 250x250 squares with the mark inset,
                    // so a square slot is the normalisation the files were
                    // built for — anything width-driven would blow the icon
                    // marks up next to the wide lockups.
                    className="size-20 object-contain opacity-55 brightness-0 transition-opacity duration-500 hover:opacity-100 lg:size-24"
                    // Every mark arrives a slightly different grey, which reads
                    // as a mismatched set. brightness-0 crushes all nine to one
                    // black, and opacity alone then carries the hierarchy —
                    // 0.55 of black on cream lands about where the greys were
                    // aiming. Nothing is lost doing it: the source files are
                    // monochrome. On the previous ink background this took an
                    // `invert` after it to lift the marks to white instead.
                    sizes="96px"
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
