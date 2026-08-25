'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { gsap, SplitText, useGSAP } from '@/lib/gsap';
import { CountUp } from '@/components/ui/count-up';
import { CtaPill } from '@/components/ui/cta-pill';
import {
  aboutLinks,
  awards,
  conferences,
  disciplines,
  researchAreas,
  training,
} from '@/data/about';

/** The vision line, split so it can arrive a term at a time. */
const VISION = ['Science', 'Medicine', 'Innovation', 'Patient-Centered Care'];

export function AboutBody() {
  const rootRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // The conference rail reads its own list rather than the page, so it fills in
  // step with the entries beside it and nothing else. Same arrangement as the
  // Principles section on the home page.
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start center', 'end center'],
  });

  const rail = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  useGSAP(
    () => {
      // ---- Every section heading, each on its own arrival ----
      // One pass over the whole page rather than a block per section: they all
      // want the same treatment, and keying each to its own element is what
      // stops the last heading playing while the reader is still on the first.
      gsap.utils
        .toArray<HTMLElement>('[data-title]', rootRef.current)
        .forEach((title) => {
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
                scrollTrigger: { trigger: title, start: 'top 85%', once: true },
              }),
          });
        });

      gsap.utils
        .toArray<HTMLElement>('[data-rule]', rootRef.current)
        .forEach((rule) => {
          gsap.from(rule, {
            scaleX: 0,
            duration: 1.1,
            ease: 'power3.inOut',
            scrollTrigger: { trigger: rule, start: 'top 92%', once: true },
          });
        });

      // ---- Grouped items, staggered within their own group ----
      // Keyed to the group, so a stagger never runs across a screen boundary.
      gsap.utils
        .toArray<HTMLElement>('[data-group]', rootRef.current)
        .forEach((group) => {
          const items = gsap.utils.toArray<HTMLElement>('[data-item]', group);
          if (!items.length) return;

          gsap.from(items, {
            y: 26,
            opacity: 0,
            duration: 1.1,
            stagger: 0.09,
            ease: 'power3.out',
            scrollTrigger: { trigger: group, start: 'top 82%', once: true },
          });
        });

      // ---- The research chips: scale rather than travel ----
      gsap.utils
        .toArray<HTMLElement>('[data-chips]', rootRef.current)
        .forEach((group) => {
          gsap.from(gsap.utils.toArray('[data-chip]', group), {
            scale: 0.85,
            opacity: 0,
            duration: 0.8,
            stagger: 0.045,
            ease: 'back.out(1.6)',
            scrollTrigger: { trigger: group, start: 'top 85%', once: true },
          });
        });
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef}>
      {/* ================= Intro ================= */}
      <section className="relative overflow-hidden bg-cream py-24 text-ink lg:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12 xl:px-20">
          <div
            data-group
            className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20"
          >
            <div>
              <p
                data-item
                className="font-body text-[0.72rem] tracking-[0.24em] text-gold-dark uppercase"
              >
                The practice
              </p>

              {/* The one figure in the copy, given the weight of one. */}
              <p data-item className="mt-8 font-display text-display-lg text-ink">
                <CountUp value={12} suffix="+" />
              </p>

              <p
                data-item
                className="mt-3 font-body text-[0.78rem] tracking-[0.18em] text-slate uppercase"
              >
                Years in dermatology
                <br />
                &amp; aesthetic medicine
              </p>

              <div
                data-rule
                aria-hidden
                className="mt-10 h-px w-24 origin-left bg-gradient-gold"
              />
            </div>

            <div className="space-y-7 font-body text-[1.02rem]/relaxed text-slate lg:text-[1.06rem]/relaxed">
              <p data-item>
                With more than 12 years of experience in Dermatology and
                Aesthetic Medicine, Dr. Christeen Youssef has built a career at
                the intersection of clinical medicine, aesthetic innovation,
                regenerative medicine, tissue bioengineering, and medical
                education.
              </p>

              <p data-item>
                She is the{' '}
                <strong className="font-medium text-ink">
                  Founder &amp; Medical Director of Everlast Wellness Medical
                  Center
                </strong>{' '}
                in Abu Dhabi, where she leads a multidisciplinary approach to
                aesthetic medicine, dermatology, regenerative medicine,
                longevity, and advanced wellness.
              </p>

              <p data-item>
                Beyond clinical practice, Dr. Christeen is an active contributor
                to the international medical community, participating in
                scientific conferences, delivering lectures and professional
                training, mentoring healthcare professionals, and sharing
                evidence-based approaches to emerging areas of medicine.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= Disciplines ================= */}
      <section className="relative overflow-hidden border-t border-ink/10 bg-cream py-24 text-ink lg:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12 xl:px-20">
          <h2
            data-title
            className="max-w-[26ch] font-display text-display-md text-ink"
          >
            A Career Built on Science, Innovation &amp; Education
          </h2>

          <div
            data-rule
            aria-hidden
            className="mt-7 h-px w-24 origin-left bg-gradient-gold"
          />

          <p className="mt-8 max-w-xl font-body text-[0.98rem]/relaxed text-slate">
            Dr. Christeen&apos;s professional journey extends beyond patient
            care. Her work encompasses:
          </p>

          {/* Ruled rows rather than cards: five items with a number, a title and
              a line of copy each is a table of contents, and a grid of boxes
              would give every one the same visual weight as the section head. */}
          <div data-group className="mt-14 lg:mt-20">
            {disciplines.map((item) => (
              <article
                key={item.index}
                data-item
                className="group grid gap-4 border-t border-ink/10 py-8 last:border-b sm:grid-cols-[4rem_minmax(0,1fr)] lg:grid-cols-[5rem_minmax(0,22rem)_minmax(0,1fr)] lg:gap-10 lg:py-10"
              >
                <p
                  aria-hidden
                  className="font-body text-[0.8rem] tabular-nums tracking-[0.2em] text-gold-dark"
                >
                  {item.index}
                </p>

                <h3 className="font-display text-2xl/snug text-ink transition-colors duration-500 group-hover:text-gold-dark">
                  {item.title}
                </h3>

                <p className="font-body text-[0.95rem]/relaxed text-slate sm:col-span-2 lg:col-span-1">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= Training ================= */}
      <section
        data-header-surface="dark"
        className="relative overflow-hidden bg-ink py-24 text-cream lg:py-32"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 right-0 size-[38rem] translate-x-1/3 -translate-y-1/3 rounded-full opacity-70 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(201,153,40,0.16), transparent 70%)',
          }}
        />

        <div className="relative mx-auto max-w-7xl px-5 md:px-8 lg:px-12 xl:px-20">
          <p className="font-body text-[0.72rem] tracking-[0.24em] text-gold uppercase">
            International Training &amp; Medical Education
          </p>

          <h2
            data-title
            className="mt-6 max-w-[24ch] font-display text-display-md text-cream"
          >
            Empowering Healthcare Professionals Through Knowledge
          </h2>

          <div
            data-rule
            aria-hidden
            className="mt-7 h-px w-24 origin-left bg-gradient-gold"
          />

          <div className="mt-8 grid gap-7 lg:grid-cols-2 lg:gap-16">
            <p className="font-body text-[0.98rem]/relaxed text-cream/70">
              A significant part of Dr. Christeen&apos;s professional mission is
              medical education.
            </p>
            <p className="font-body text-[0.98rem]/relaxed text-cream/70">
              Through workshops, hands-on courses, lectures, and professional
              training programs, she shares practical knowledge and clinical
              experience with healthcare professionals in the fields of aesthetic
              medicine, dermatology, regenerative medicine, laser and
              energy-based devices, and advanced treatment techniques.
            </p>
          </div>

          <div
            data-group
            className="mt-14 grid gap-6 sm:grid-cols-2 lg:mt-20 lg:gap-7"
          >
            {training.map((item) => (
              <article
                key={item.title}
                data-item
                className="rounded-2xl border border-cream/12 bg-cream/[0.03] p-7 transition-colors duration-500 hover:border-gold/30 lg:p-8"
              >
                {item.meta && (
                  <p className="font-body text-[0.68rem] tracking-[0.18em] text-gold uppercase">
                    {item.meta}
                  </p>
                )}

                <h3
                  className={`font-display text-xl/snug text-cream ${
                    item.meta ? 'mt-4' : ''
                  }`}
                >
                  {item.title}
                </h3>

                <p className="mt-4 font-body text-[0.92rem]/relaxed text-cream/65">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= Conferences ================= */}
      <section className="relative overflow-hidden bg-cream py-24 text-ink lg:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12 xl:px-20">
          <p className="font-body text-[0.72rem] tracking-[0.24em] text-gold-dark uppercase">
            Conferences &amp; Scientific Speaking
          </p>

          <h2
            data-title
            className="mt-6 max-w-[22ch] font-display text-display-md text-ink"
          >
            Sharing Knowledge Beyond the Clinic
          </h2>

          <div
            data-rule
            aria-hidden
            className="mt-7 h-px w-24 origin-left bg-gradient-gold"
          />

          <p className="mt-8 max-w-2xl font-body text-[0.98rem]/relaxed text-slate">
            Dr. Christeen regularly participates in scientific and professional
            events, contributing her clinical experience and research
            perspectives to discussions surrounding aesthetics, dermatology,
            wound healing, regenerative medicine, and tissue engineering.
          </p>

          <p className="mt-14 font-body text-[0.72rem] tracking-[0.2em] text-slate/70 uppercase lg:mt-20">
            Selected 2025&ndash;2026 highlights
          </p>

          {/* A timeline, because these are dated events and the order is the
              point. The rail is driven by this list's own scroll so it can never
              disagree with where the reader is in it. */}
          <div ref={timelineRef} data-group className="relative mt-10">
            <div
              aria-hidden
              className="absolute top-0 bottom-0 left-[7px] w-px bg-ink/12 sm:left-[calc(5rem+7px)]"
            >
              <motion.div
                style={{ scaleY: rail }}
                className="h-full w-full origin-top bg-gradient-gold"
              />
            </div>

            {conferences.map((item, index) => (
              <article
                key={`${item.title}-${index}`}
                data-item
                className="relative grid gap-3 pb-12 pl-9 last:pb-0 sm:grid-cols-[5rem_minmax(0,1fr)] sm:gap-x-9 sm:pl-0"
              >
                <p className="font-body text-[0.8rem] tabular-nums tracking-[0.16em] text-gold-dark sm:text-right">
                  {item.year}
                </p>

                {/* Sits on the rail. */}
                <span
                  aria-hidden
                  className="absolute top-1.5 left-0 size-[15px] rounded-full border-2 border-gold bg-cream sm:left-[5rem]"
                />

                <div>
                  <h3 className="font-display text-xl/snug text-ink">
                    {item.title}
                    {item.place && (
                      <span className="text-slate/70"> · {item.place}</span>
                    )}
                  </h3>

                  <p className="mt-3 max-w-2xl font-body text-[0.95rem]/relaxed text-slate">
                    {item.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= Research ================= */}
      <section className="relative overflow-hidden border-t border-ink/10 bg-cream py-24 text-ink lg:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12 xl:px-20">
          <p className="font-body text-[0.72rem] tracking-[0.24em] text-gold-dark uppercase">
            Research &amp; Regenerative Medicine
          </p>

          <h2
            data-title
            className="mt-6 max-w-[20ch] font-display text-display-md text-ink"
          >
            Advancing the Future of Healing
          </h2>

          <div
            data-rule
            aria-hidden
            className="mt-7 h-px w-24 origin-left bg-gradient-gold"
          />

          <p className="mt-8 max-w-2xl font-body text-[0.98rem]/relaxed text-slate">
            Dr. Christeen&apos;s scientific interests extend into emerging
            regenerative approaches designed to improve tissue repair, wound
            healing, scar management, and functional recovery. Her work has
            explored areas including:
          </p>

          {/* Chips, not a bulleted list: nine short terms read as a field of
              interest, and a column of bullets would read as a ranking. */}
          <ul data-chips className="mt-12 flex flex-wrap gap-3">
            {researchAreas.map((area) => (
              <li
                key={area}
                data-chip
                className="rounded-full border border-ink/12 bg-white/60 px-5 py-2.5 font-body text-[0.88rem] text-ink transition-colors duration-500 hover:border-gold/40 hover:text-gold-dark"
              >
                {area}
              </li>
            ))}
          </ul>

          <p className="mt-12 max-w-2xl font-body text-[0.98rem]/relaxed text-slate">
            Her research and clinical interests reflect a broader vision: using
            science and innovation to move beyond treating symptoms toward
            supporting tissue regeneration and improved long-term outcomes.
          </p>
        </div>
      </section>

      {/* ================= Awards ================= */}
      <section className="relative overflow-hidden border-t border-ink/10 bg-cream py-24 text-ink lg:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12 xl:px-20">
          <p className="font-body text-[0.72rem] tracking-[0.24em] text-gold-dark uppercase">
            Awards &amp; Recognition
          </p>

          <h2
            data-title
            className="mt-6 max-w-[24ch] font-display text-display-md text-ink"
          >
            Excellence Recognized by the Medical Community
          </h2>

          <div data-group className="mt-14 grid gap-7 lg:mt-20 lg:grid-cols-2">
            {awards.map((award, index) => (
              <article
                key={award.title}
                data-item
                // The first is an actual award and is treated as one; the second
                // is a standing contribution, so it stays quiet.
                className={
                  index === 0
                    ? 'rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/10 to-transparent p-8 lg:p-10'
                    : 'rounded-2xl border border-ink/10 p-8 lg:p-10'
                }
              >
                {award.meta && (
                  <p className="font-body text-[0.68rem] tracking-[0.18em] text-gold-dark uppercase">
                    {award.meta}
                  </p>
                )}

                <h3
                  className={`font-display text-2xl/snug text-ink ${
                    award.meta ? 'mt-4' : ''
                  }`}
                >
                  {award.title}
                </h3>

                <p className="mt-4 font-body text-[0.95rem]/relaxed text-slate">
                  {award.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= Leadership ================= */}
      <section
        data-header-surface="dark"
        className="relative overflow-hidden bg-ink py-24 text-cream lg:py-32"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2 size-[42rem] -translate-x-1/2 translate-y-1/2 rounded-full opacity-70 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(201,153,40,0.16), transparent 70%)',
          }}
        />

        <div className="relative mx-auto max-w-7xl px-5 md:px-8 lg:px-12 xl:px-20">
          <p className="font-body text-[0.72rem] tracking-[0.24em] text-gold uppercase">
            Medical Leadership
          </p>

          <h2
            data-title
            className="mt-6 max-w-[26ch] font-display text-display-md text-cream"
          >
            Founder &amp; Medical Director — Everlast Wellness Medical Center
          </h2>

          <div
            data-rule
            aria-hidden
            className="mt-7 h-px w-24 origin-left bg-gradient-gold"
          />

          <p className="mt-8 max-w-2xl font-body text-[0.98rem]/relaxed text-cream/70">
            As Founder and Medical Director of Everlast Wellness Medical Center,
            Dr. Christeen leads a multidisciplinary healthcare environment
            focused on aesthetic medicine, dermatology, regenerative medicine,
            longevity, and advanced wellness. Her vision is centered on bringing
            together:
          </p>

          {/* The four terms set as the equation the copy makes of them, with the
              plus signs drawn in gold so the line reads as a formula rather than
              a list that happens to use punctuation. */}
          <div
            data-group
            className="mt-14 flex flex-wrap items-center gap-x-5 gap-y-4 lg:mt-16 lg:gap-x-7"
          >
            {VISION.map((term, index) => (
              <div key={term} data-item className="flex items-center gap-5 lg:gap-7">
                {index > 0 && (
                  <span
                    aria-hidden
                    className="font-display text-2xl text-gold lg:text-4xl"
                  >
                    +
                  </span>
                )}
                <span className="font-display text-2xl/tight text-cream lg:text-4xl/tight">
                  {term}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-12 max-w-xl font-body text-[0.98rem]/relaxed text-cream/60">
            to create a healthcare experience that goes beyond conventional
            aesthetics.
          </p>
        </div>
      </section>

      {/* ================= Education + closing ================= */}
      <section className="relative overflow-hidden bg-cream py-24 text-ink lg:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12 xl:px-20">
          <div
            data-group
            className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20"
          >
            <div>
              <h2
                data-title
                className="max-w-[18ch] font-display text-display-md text-ink"
              >
                A Passion for Medical Education
              </h2>

              <div
                data-rule
                aria-hidden
                className="mt-7 h-px w-24 origin-left bg-gradient-gold"
              />
            </div>

            <div className="space-y-7 font-body text-[1.02rem]/relaxed text-slate">
              <p data-item>
                Dr. Christeen believes that advancing medicine requires more
                than individual clinical excellence.
              </p>
              <p data-item>
                It requires sharing knowledge, mentoring future practitioners,
                encouraging scientific thinking, and creating opportunities for
                healthcare professionals to learn from one another.
              </p>
              <p data-item>
                Through her lectures, workshops, conferences, professional
                training, and collaborations, she continues to contribute to the
                development of the next generation of healthcare professionals.
              </p>
            </div>
          </div>

          {/* ---- Beyond the Clinic ---- */}
          <div className="mt-24 border-t border-ink/10 pt-16 lg:mt-32 lg:pt-20">
            <p className="font-body text-[0.72rem] tracking-[0.24em] text-gold-dark uppercase">
              Beyond the Clinic
            </p>

            <p className="mt-8 max-w-3xl font-body text-[0.98rem]/relaxed text-slate">
              From international scientific conferences to hands-on medical
              training, from regenerative research to patient-centered aesthetic
              care, Dr. Christeen&apos;s journey reflects one central
              philosophy:
            </p>

            <blockquote
              data-title
              className="mt-10 max-w-[30ch] font-display text-display-md text-ink"
            >
              Medicine should continuously evolve. And so should the way we
              learn, innovate, and care for our patients.
            </blockquote>

            <div
              data-group
              className="mt-14 flex flex-wrap gap-4 lg:mt-16"
            >
              {aboutLinks.map((link, index) => (
                <div key={link.href} data-item>
                  <CtaPill
                    href={link.href}
                    label={link.label}
                    // The consultation is the outcome; the three explorations
                    // are quieter by a border.
                    className={
                      index === aboutLinks.length - 1
                        ? undefined
                        : 'border-ink/10 bg-transparent'
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
