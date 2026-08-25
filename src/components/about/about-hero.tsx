'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { gsap, SplitText, useGSAP } from '@/lib/gsap';
import portrait from '@/assets/about-me.jpeg';

const CREDENTIALS = [
  'Dermatologist',
  'Aesthetic & Regenerative Medicine Specialist',
  'International Trainer',
  'Medical Educator',
];

export function AboutHero() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const title = rootRef.current?.querySelector<HTMLElement>('[data-title]');

      // Nothing here is scroll-triggered: this is the top of the page, so it
      // plays on arrival. Delays rather than a shared timeline so the portrait
      // and the type can overlap without either waiting on the other.
      if (title) {
        SplitText.create(title, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 120,
              duration: 1.5,
              stagger: 0.12,
              ease: 'power4.out',
              delay: 0.3,
            }),
        });
      }

      gsap.from('[data-cred]', {
        y: 14,
        opacity: 0,
        duration: 0.9,
        stagger: 0.07,
        ease: 'power3.out',
        delay: 0.9,
      });

      gsap.from('[data-rule]', {
        scaleX: 0,
        duration: 1.2,
        ease: 'power3.inOut',
        delay: 0.8,
      });

      // The frame reveals by uncovering rather than fading, so the portrait
      // arrives as an object rather than an image loading.
      gsap.from('[data-frame]', {
        clipPath: 'inset(100% 0% 0% 0%)',
        duration: 1.6,
        ease: 'power4.inOut',
        delay: 0.2,
      });

      // Slow counter-drift as the hero leaves. The frame is 115% tall so the
      // travel never exposes an edge.
      gsap.to('[data-portrait]', {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      // Inverts the fixed header for as long as this dark hero is under it.
      data-header-surface="dark"
      className="relative overflow-hidden bg-ink text-cream"
    >
      {/* Warm bloom, the same device the rest of the site uses. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/3 size-[44rem] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-70 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(201,153,40,0.16), transparent 70%)',
        }}
      />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-5 pt-32 pb-20 md:px-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center lg:gap-20 lg:px-12 lg:pt-40 lg:pb-28 xl:px-20">
        <div>
          <p className="font-body text-[0.72rem] tracking-[0.24em] text-gold uppercase sm:text-[0.78rem]">
            About
          </p>

          <h1
            data-title
            className="mt-6 font-display text-display-lg text-cream"
          >
            Dr. Christeen Youssef
          </h1>

          <div
            data-rule
            aria-hidden
            className="mt-8 h-px w-24 origin-left bg-gradient-gold"
          />

          {/* A list, not a sentence of bullet separators: each credential is a
              discrete thing, and the separators are drawn rather than typed so
              they never wrap onto a line of their own. */}
          <ul className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2">
            {CREDENTIALS.map((credential, index) => (
              <li
                key={credential}
                data-cred
                className="flex items-center gap-3 font-body text-[0.85rem] text-cream/70"
              >
                {index > 0 && (
                  <span
                    aria-hidden
                    className="hidden size-1 rounded-full bg-gold/70 sm:block"
                  />
                )}
                {credential}
              </li>
            ))}
          </ul>

          <p
            data-cred
            className="mt-10 max-w-xl font-display text-2xl/relaxed text-cream/90 lg:text-[1.7rem]/relaxed"
          >
            Where Clinical Excellence Meets Scientific Innovation
          </p>
        </div>

        <div
          data-frame
          className="relative aspect-4/5 overflow-hidden rounded-3xl bg-ink-soft"
        >
          {/* Taller than the frame, so the parallax has somewhere to travel. */}
          <div data-portrait className="absolute -inset-y-[7.5%] inset-x-0">
            <Image
              src={portrait}
              alt="Dr. Christeen Youssef"
              fill
              priority
              sizes="(min-width: 1024px) 42vw, 90vw"
              className="object-cover"
            />
          </div>

          <div
            aria-hidden
            className="absolute inset-0 rounded-3xl ring-1 ring-cream/10 ring-inset"
          />
        </div>
      </div>
    </section>
  );
}
