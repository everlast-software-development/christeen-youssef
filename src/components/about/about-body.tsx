import type { ReactNode } from 'react';
import { Image } from '@/components/ui/image';
import { GraduationCap, MapPin } from 'lucide-react';
import { BAND_Y, Container, Eyebrow, SPLIT } from '@/components/site/layout';
import { Button } from '@/components/site/button';
import { ExpertiseList } from '@/components/about/expertise-list';
import { QUADRANT_ICON, QuadrantGrid } from '@/components/site/quadrant-grid';
import { CARD, CARD_TONE, GLASS_PANEL } from '@/components/site/surfaces';
import { LogoMarquee } from '@/components/site/logo-marquee';
import { CtaBand } from '@/components/site/cta-band';
import { Timeline } from '@/components/site/timeline';
import {
  aboutLinks,
  awards,
  conferences,
  disciplines,
  researchAreas,
  training,
} from '@/data/about';
import { schedule } from '@/data/schedule';
import { stats } from '@/data/stats';
import { cn } from '@/lib/utils';
import clinicPhoto from '@/assets/blogs/germany/team.webp';

const VISION = ['Science', 'Medicine', 'Innovation', 'Patient-Centered Care'];

const stat = (label: string) => stats.find((item) => item.label === label)!;
const years = stat('Years Experience');
const patients = stat('Patients Transformed');
const industryAwards = stat('Industry Awards');

// Three figures that already exist in data/stats.ts, labelled as in the home hero.
const FIGURES = [
  { value: `${years.value}${years.suffix}`, label: 'Years of practice' },
  { value: `${patients.value}${patients.suffix}`, label: 'Patients treated' },
  { value: `${industryAwards.value}${industryAwards.suffix}`, label: 'Industry awards' },
];

// The two cards under the practice lead. The clinic's name is the first
// card's title, so its paragraph starts from "In Abu Dhabi".
const PRACTICE = [
  {
    label: 'Founder & Medical Director',
    title: 'Everlast Wellness Medical Center',
    body: 'In Abu Dhabi, she leads a multidisciplinary approach to aesthetic medicine, dermatology, regenerative medicine, longevity, and advanced wellness.',
    meta: 'Abu Dhabi, UAE',
    icon: MapPin,
  },
  {
    label: 'Beyond the clinic',
    title: 'The International Medical Community',
    body: 'Beyond clinical practice, Dr. Christeen is an active contributor to the international medical community, participating in scientific conferences, delivering lectures and professional training, mentoring healthcare professionals, and sharing evidence-based approaches to emerging areas of medicine.',
    meta: 'Conferences · Lectures · Training',
    icon: GraduationCap,
  },
];

// The four threads named in the medical-education paragraph.
const EDUCATION_THREADS = [
  'Sharing knowledge',
  'Mentoring practitioners',
  'Scientific thinking',
  'Collaboration',
];

// One icon per training programme, in the order of `training`.
const TRAINING_ICONS: ReactNode[] = [
  <svg key="academy" {...QUADRANT_ICON}>
    <path d="M2 9l10-5 10 5-10 5z M6 11v5c3 2 9 2 12 0v-5 M22 9v6" />
  </svg>,
  <svg key="workshop" {...QUADRANT_ICON}>
    <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />
  </svg>,
  <svg key="laser" {...QUADRANT_ICON}>
    <path d="M12 3v3 M12 18v3 M3 12h3 M18 12h3 M8 12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
  </svg>,
  <svg key="international" {...QUADRANT_ICON}>
    <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0 M3 12h18 M12 3c3 3.2 3 14.8 0 18 M12 3c-3 3.2-3 14.8 0 18" />
  </svg>,
];

const TRAINING = training.map((item, i) => ({
  title: item.title,
  body: item.body,
  label: [String(i + 1).padStart(2, '0'), item.meta].filter(Boolean).join(' · '),
  icon: TRAINING_ICONS[i],
}));

const READING = aboutLinks.filter((link) => link.href.startsWith('/blog'));
const BOOK = aboutLinks.find((link) => link.href === '/reach-me')!;

/** One word set in italic for emphasis inside display type. */
function Em({ children }: { children: ReactNode }) {
  return <em className="italic">{children}</em>;
}

/** The home page's section header: eyebrow, display heading, standfirst. */
function Head({
  eyebrow,
  title,
  id,
  onDark = false,
  as: Heading = 'h2',
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  id?: string;
  onDark?: boolean;
  as?: 'h2' | 'h3';
  children?: ReactNode;
}) {
  return (
    <div className="scroll-rise flex flex-col gap-3.5">
      {eyebrow && <Eyebrow onDark={onDark}>{eyebrow}</Eyebrow>}
      <Heading id={id} className={cn('m-0 type-h2', onDark ? 'text-white' : 'text-text')}>
        {title}
      </Heading>
      {children && (
        <div
          className={cn(
            'mt-1 flex max-w-[500px] flex-col gap-4 type-body',
            onDark ? 'text-[#CFC8BC]' : 'text-soft',
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function AboutBody() {
  return (
    <>
      {/* ================= 2 · Introduction =================
          Everything — heading, lead, the two columns and the figures — sits in
          one 760px column, so nothing below is wider than the lead above it. */}
      <section aria-labelledby="practice-title" className={cn('relative bg-page text-text', BAND_Y)}>
        <Container>
          <div className="mx-auto max-w-[760px]">
            <div className="scroll-rise flex flex-col items-center gap-4 text-center">
              <Eyebrow>The practice</Eyebrow>
              <h2 id="practice-title" className="m-0 type-h2 text-text">
                A career at the intersection of <Em>medicine</Em>, <Em>science</Em> and{' '}
                <Em>education</Em>.
              </h2>
            </div>

            <p className="scroll-rise m-0 mt-7 text-center type-lead text-balance text-soft">
              With more than 12 years of experience in Dermatology and Aesthetic
              Medicine, Dr. Christeen Youssef has built a career at the intersection
              of clinical medicine, aesthetic innovation, regenerative medicine,
              tissue bioengineering, and medical education.
            </p>

            {/* Two equal cards: the grid stretches them to one height and each
                footer is pushed to the bottom, so the footers share a line. */}
            <ul className="scroll-rise m-0 mt-12 grid list-none items-stretch gap-5 p-0 text-left md:grid-cols-2">
              {PRACTICE.map(({ label, title, body, meta, icon: Icon }) => (
                <li key={label} className={cn(CARD, CARD_TONE.cream, 'h-full gap-0 border border-line p-8')}>
                  <p className="type-eyebrow m-0 text-gold-text">{label}</p>
                  <h3 className="m-0 mt-3 type-h3 text-ink">{title}</h3>
                  <p className="m-0 mt-4 mb-6 type-body text-pretty text-soft">{body}</p>
                  <p className="m-0 mt-auto flex items-center gap-2 border-t border-line pt-6 type-small text-caption-strong">
                    <Icon aria-hidden strokeWidth={1.7} className="size-4 shrink-0 text-gold" />
                    {meta}
                  </p>
                </li>
              ))}
            </ul>

            {/* The hairlines are on the grid and the dividers between its cells,
                so the verticals meet the horizontals exactly. */}
            <dl className="mt-16 grid divide-y divide-line border-y border-line md:grid-cols-3 md:divide-x md:divide-y-0">
              {FIGURES.map((figure) => (
                <div key={figure.label} className="flex flex-col items-center gap-1 py-8 text-center">
                  <dt className="sr-only">{figure.label}</dt>
                  <dd className="m-0 type-stat text-text">
                    {figure.value}
                  </dd>
                  <dd aria-hidden className="m-0 type-stat-label whitespace-nowrap text-caption-strong">
                    {figure.label}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="scroll-rise m-0 mt-10 text-center">
              <span className="block font-display text-[26px] text-text italic">Christeen Youssef</span>
              <span className="type-eyebrow mt-1 block text-caption-strong">{schedule.role}</span>
            </p>
          </div>
        </Container>
      </section>

      {/* ================= 3 · Areas of expertise ================= */}
      <section aria-labelledby="career-title" className={cn('relative bg-cream text-text', BAND_Y)}>
        <Container>
          <ExpertiseList
            items={disciplines}
            heading={
              <Head
                eyebrow="Areas of expertise"
                id="career-title"
                title="A Career Built on Science, Innovation & Education"
              >
                <p>
                  Dr. Christeen&apos;s professional journey extends beyond patient care.
                  Her work encompasses:
                </p>
              </Head>
            }
          />
        </Container>
      </section>

      {/* ================= 4 · Education & speaking ================= */}
      <section
        data-tone="ink"
        aria-labelledby="training-title"
        className={cn('relative overflow-clip text-white', BAND_Y)}
        style={{ background: 'radial-gradient(ellipse 50% 70% at 85% 50%, #2B261D 0%, #17150F 70%)' }}
      >
        <span
          aria-hidden
          className="animate-blob absolute top-[12%] right-[18%] size-[420px] rounded-full blur-[10px]"
          style={{ background: 'radial-gradient(closest-side, rgba(217,181,102,0.22), rgba(217,181,102,0))' }}
        />
        <Container className="relative z-[2]">
          <div className={cn(SPLIT.grid, 'items-center')}>
            <div className={cn(SPLIT.start, 'flex flex-col gap-7')}>
              <Head
                onDark
                eyebrow="International Training & Medical Education"
                id="training-title"
                title="Empowering Healthcare Professionals Through Knowledge"
              >
                <p>
                  A significant part of Dr. Christeen&apos;s professional mission is
                  medical education.
                </p>
                <p>
                  Through workshops, hands-on courses, lectures, and professional
                  training programs, she shares practical knowledge and clinical
                  experience with healthcare professionals in the fields of aesthetic
                  medicine, dermatology, regenerative medicine, laser and energy-based
                  devices, and advanced treatment techniques.
                </p>
              </Head>
              <Button href="/reach-me" variant="gold" className="self-start">
                Book a consultation
              </Button>
            </div>
            <QuadrantGrid items={TRAINING} className={SPLIT.end} />
          </div>

          <div className="mt-[clamp(64px,7vw,104px)] border-t border-white/12 pt-[clamp(48px,5vw,72px)]">
            <div className={SPLIT.grid}>
              <div className={SPLIT.start}>
                <Head onDark as="h3" eyebrow="Conferences & Scientific Speaking" title="Sharing Knowledge Beyond the Clinic" />
              </div>
              <p className={cn(SPLIT.end, 'scroll-rise m-0 max-w-[60ch] self-end type-body text-[#CFC8BC]')}>
                Dr. Christeen regularly participates in scientific and professional
                events, contributing her clinical experience and research perspectives
                to discussions surrounding aesthetics, dermatology, wound healing,
                regenerative medicine, and tissue engineering.
              </p>
            </div>

            <Eyebrow onDark className="scroll-rise mt-14">
              Selected 2025&ndash;2026 highlights
            </Eyebrow>
            <Timeline items={conferences} className="mt-8" />
          </div>
        </Container>
      </section>

      {/* ================= 5 · Research & recognition ================= */}
      <section aria-labelledby="research-title" className={cn('relative bg-page text-text', BAND_Y)}>
        <Container>
          {/* Header: heading in columns 1–6, the intro in 8–12 sitting on the
              heading's baseline — directly above the list it introduces. */}
          <div className="grid gap-y-6 lg:grid-cols-12 lg:items-end lg:gap-x-6">
            <div className="lg:col-span-6">
              <Head
                eyebrow="Research & Regenerative Medicine"
                id="research-title"
                title={
                  <>
                    Advancing the <Em>Future</Em> of Healing
                  </>
                }
              />
            </div>
            <p className="scroll-rise m-0 max-w-[60ch] type-body text-pretty text-soft lg:col-span-5 lg:col-start-8">
              Dr. Christeen&apos;s scientific interests extend into emerging
              regenerative approaches designed to improve tissue repair, wound
              healing, scar management, and functional recovery. Her work has
              explored areas including:
            </p>
          </div>

          {/* Nine areas as a 3×3 grid: every cell carries its own top rule and
              the grid the bottom one, so all lines run edge to edge; the rule
              between columns is each cell's own left border, so it spans the
              full (stretched) row height. One column below 1024px. */}
          <ol className="scroll-rise m-0 mt-14 grid list-none border-b border-line p-0 lg:grid-cols-3">
            {researchAreas.map((area, index) => (
              <li
                key={area}
                className="group flex items-baseline gap-5 border-t border-line py-5 lg:flex-col lg:gap-3 lg:px-6 lg:py-7 lg:[&:nth-child(3n+1)]:pl-0 lg:[&:not(:nth-child(3n+1))]:border-l"
              >
                <span className="w-6 shrink-0 type-eyebrow text-gold-text tabular-nums transition-colors duration-200 group-hover-fine:text-gold">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="type-h3 text-balance text-text transition-transform duration-200 group-hover-fine:translate-x-1">
                  {area}
                </span>
              </li>
            ))}
          </ol>

          <p className="scroll-rise m-0 mx-auto mt-12 max-w-[680px] text-center type-quote text-balance text-ink italic">
            Her research and clinical interests reflect a broader vision: using
            science and innovation to move beyond treating symptoms toward
            supporting tissue regeneration and improved long-term outcomes.
          </p>

          <div className="mt-[clamp(56px,6vw,88px)] border-t border-line pt-[clamp(48px,5vw,72px)]">
            <Head eyebrow="Awards & Recognition" as="h3" title="Excellence Recognized by the Medical Community" />
            <ul className="scroll-stagger m-0 mt-11 grid list-none gap-4 p-0 min-[961px]:grid-cols-2">
              {awards.map((award, index) => {
                const featured = index === 0;
                return (
                  <li
                    key={award.title}
                    className={cn(CARD, featured ? CARD_TONE.gold : CARD_TONE.cream, 'gap-3 p-[clamp(24px,3vw,36px)]')}
                  >
                    {award.meta && (
                      <span className={cn('type-eyebrow', featured ? 'text-white' : 'text-caption-strong')}>
                        {award.meta}
                      </span>
                    )}
                    <h4 className={cn('m-0 type-h3', featured ? 'text-white' : 'text-ink')}>
                      {award.title}
                    </h4>
                    <p className={cn('m-0 type-body', featured ? 'text-white' : 'text-soft')}>
                      {award.body}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </Container>
      </section>

      {/* ================= 6 · Founder ================= */}
      <section
        data-tone="ink"
        aria-labelledby="founder-title"
        className={cn('relative overflow-clip text-white', BAND_Y)}
        style={{ background: 'radial-gradient(ellipse 60% 70% at 50% 0%, #2B261D 0%, #17150F 70%)' }}
      >
        <Container>
          <div className={cn(GLASS_PANEL, 'scroll-rise p-[clamp(20px,3vw,40px)]')}>
            <div className={cn(SPLIT.grid, 'items-center')}>
              <figure className={cn(SPLIT.start, 'relative m-0')}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-[16px] bg-ink shadow-[0_34px_70px_rgba(0,0,0,0.3)]">
                  <Image
                    src={clinicPhoto}
                    alt="Dr. Christeen Youssef with colleagues at Everlast Wellness Medical Center"
                    fill
                    placeholder="blur"
                    sizes="(min-width: 961px) 440px, 92vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="absolute bottom-4 left-4 rounded-[12px] bg-cream px-3.5 py-2.5 type-small font-semibold text-text">
                  Everlast Wellness Medical Center · Abu Dhabi
                </figcaption>
              </figure>

              <div className={cn(SPLIT.end, 'flex flex-col gap-3.5')}>
                <Eyebrow onDark>Medical Leadership</Eyebrow>
                <h2 id="founder-title" className="m-0 type-h2 text-white">
                  Founder &amp; Medical Director — Everlast Wellness Medical Center
                </h2>
                <p className="m-0 mt-1 max-w-[60ch] type-body text-[#CFC8BC]">
                  As Founder and Medical Director of Everlast Wellness Medical Center,
                  Dr. Christeen leads a multidisciplinary healthcare environment focused
                  on aesthetic medicine, dermatology, regenerative medicine, longevity,
                  and advanced wellness. Her vision is centered on bringing together:
                </p>
                <p className="m-0 mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-y border-white/12 py-5 font-display text-[clamp(26px,2.8vw,38px)] leading-tight text-white">
                  {VISION.map((term, index) => (
                    <span key={term} className="flex items-baseline gap-4">
                      {index > 0 && (
                        <span aria-hidden className="text-gold-light">
                          +
                        </span>
                      )}
                      {term}
                    </span>
                  ))}
                </p>
                <p className="m-0 mt-1 max-w-[60ch] type-body text-[#CFC8BC]">
                  to create a healthcare experience that goes beyond conventional
                  aesthetics.
                </p>
              </div>
            </div>
          </div>

          {/* ---------- A passion for medical education ----------
              Two rows on the 12-column grid that mirror each other — heading
              beside quote (their last lines on one baseline), then paragraph
              beside paragraph — and the four threads below on the same grid.
              Spaced from the panel above by the sections' own padding. */}
          <div className="mt-[clamp(64px,7vw,104px)]">
            <div className="grid gap-y-8 min-[961px]:grid-cols-12 min-[961px]:items-baseline-last min-[961px]:gap-x-6">
              <div className="scroll-rise flex flex-col gap-3.5 min-[961px]:col-span-5">
                <Eyebrow onDark>Medical Education</Eyebrow>
                <h2 id="education-title" className="m-0 type-h2 text-white">
                  A Passion for Medical <Em>Education</Em>
                </h2>
              </div>
              <blockquote className="scroll-rise relative m-0 max-w-[34ch] type-quote text-cream italic min-[961px]:col-span-6 min-[961px]:col-start-7">
                {/* Hanging quote on desktop: outside the text, so the words stay
                    flush with the column edge. On phones the gutter is too narrow
                    to hang into, so it sits inline. */}
                <span aria-hidden className="text-gold not-italic min-[961px]:absolute min-[961px]:-left-[0.6em]">
                  &ldquo;
                </span>
                Dr. Christeen believes that advancing medicine requires more than
                individual clinical excellence.
              </blockquote>
            </div>

            <div className="scroll-rise mt-12 grid items-start gap-y-5 border-t border-white/13 pt-10 type-body text-white/72 min-[961px]:grid-cols-12 min-[961px]:gap-x-6">
              <p className="m-0 max-w-[46ch] text-pretty min-[961px]:col-span-5">
                It requires sharing knowledge, mentoring future practitioners,
                encouraging scientific thinking, and creating opportunities for
                healthcare professionals to learn from one another.
              </p>
              <p className="m-0 max-w-[46ch] text-pretty min-[961px]:col-span-6 min-[961px]:col-start-7">
                Through her lectures, workshops, conferences, professional training,
                and collaborations, she continues to contribute to the development of
                the next generation of healthcare professionals.
              </p>
            </div>

            {/* Each thread carries its own top rule across its columns; the
                gutter between them breaks the line into four equal segments. */}
            <ol className="m-0 mt-14 grid list-none gap-x-6 gap-y-8 p-0 min-[640px]:max-[960px]:grid-cols-2 min-[961px]:grid-cols-12">
              {EDUCATION_THREADS.map((thread, index) => (
                <li
                  key={thread}
                  className={cn(
                    'flex flex-col gap-2 border-t pt-6 min-[961px]:col-span-3',
                    index === 0 ? 'border-gold' : 'border-white/13',
                  )}
                >
                  <span className="type-eyebrow text-gold-light tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="type-h3 text-cream">{thread}</span>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* ================= 7 · Closing ================= */}
      <section aria-labelledby="closing-title" className={cn('relative bg-cream text-text', BAND_Y)}>
        <Container>
          <div className="scroll-rise mx-auto flex max-w-[1000px] flex-col items-center gap-3.5 text-center">
            <Eyebrow>Beyond the Clinic</Eyebrow>
            <p className="m-0 max-w-[600px] type-body text-soft">
              From international scientific conferences to hands-on medical training,
              from regenerative research to patient-centered aesthetic care, Dr.
              Christeen&apos;s journey reflects one central philosophy:
            </p>
            <h2 id="closing-title" className="m-0 mt-4 text-[clamp(40px,4.8vw,72px)] leading-[1.05] text-text">
              Medicine should continuously <Em>evolve</Em>. And so should the way we{' '}
              <Em>learn</Em>, <Em>innovate</Em>, and <Em>care</Em> for our patients.
            </h2>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              {READING.map((link) => (
                <Button key={link.href} href={link.href} variant="outline-dark">
                  {link.label}
                </Button>
              ))}
              <Button href={BOOK.href} variant="gold">
                {BOOK.label}
              </Button>
            </div>
          </div>

          <div className="scroll-rise mt-[clamp(56px,6vw,88px)] border-t border-line pt-10">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
              <Eyebrow>Partners &amp; Affiliations</Eyebrow>
              <p className="m-0 type-h3 text-text">
                Trusted alongside leading institutions
              </p>
            </div>
            <div className="mt-8">
              <LogoMarquee logoClassName="h-16 opacity-60" />
            </div>
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
