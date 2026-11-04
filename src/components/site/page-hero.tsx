import { Fragment, type CSSProperties, type ReactNode } from 'react';
import { PageBreadcrumb } from '@/components/site/page-breadcrumb';
import { cn } from '@/lib/utils';

/** Header height (88px) plus the home hero's clamp(40px, 5vw, 80px). */
const TOP = 'calc(88px + clamp(40px, 5vw, 80px))';
/** The same bottom padding everywhere, so heroes without a slot match. */
const BOTTOM = 'clamp(56px, 6vw, 88px)';

/**
 * `"Insight, research & {results}"` → words, the braced one in italic. Each
 * word blurs in on its own beat, as on the home page — 90ms apart, closer for
 * long titles so the last word never lands more than ~0.7s after the first.
 */
function Title({ text }: { text: string }) {
  const words = text.split(/\s+/).map((word) => {
    const match = word.match(/^([^{]*)\{([^}]+)\}(.*)$/);
    return match
      ? { before: match[1], word: match[2], after: match[3], italic: true }
      : { before: '', word, after: '', italic: false };
  });

  const step = Math.min(90, 700 / Math.max(words.length - 1, 1));

  return words.map(({ before, word, after, italic }, index) => (
    <Fragment key={`${word}-${index}`}>
      {index > 0 && ' '}
      <span className="animate-word inline-block" style={{ animationDelay: `${Math.round(250 + index * step)}ms` }}>
        {before}
        {italic ? <em className="italic">{word}</em> : word}
        {after}
      </span>
    </Fragment>
  ));
}

/**
 * The opening of every inner page — one design, so About, Before & After,
 * Blog, each article and Reach Me all start the same way: the home hero's ink
 * and warm glow; centred breadcrumb, title (one word in italic) and a line of
 * intro, always at the same place and size; then an optional slot (the blog's
 * search, an article's meta, the About portrait).
 *
 * Order and rhythm: breadcrumb → 20px → H1 → 24px → intro → 40px → slot.
 * Entrance motion is CSS, so it waits behind the preloader like every other
 * load-in on the site.
 *
 * `overhang` lets the slot hang below the band into the next section (the
 * About arch): the slot is pulled down past the bottom padding by that much,
 * and a strip of `overhangClassName` colour is laid under the band to land on.
 */
export function PageHero({
  section,
  page,
  title,
  intro,
  children,
  align = 'center',
  overhang,
  overhangClassName = 'bg-page',
}: {
  /** The section's href in the navigation data — drives the breadcrumb. */
  section: string;
  /** A page below the section (a blog post) — the breadcrumb's last item. */
  page?: { label: string; href: string };
  /** One word may be wrapped in braces to set it in italic. */
  title: string;
  intro?: ReactNode;
  children?: ReactNode;
  align?: 'center';
  /** CSS length the slot hangs below the band. */
  overhang?: string;
  overhangClassName?: string;
}) {
  const slotStyle: CSSProperties | undefined = overhang
    ? { marginBottom: `calc(-1 * (${overhang} + ${BOTTOM}))` }
    : undefined;

  return (
    <>
      <section
        data-tone="ink"
        aria-labelledby="page-title"
        className="relative text-white"
        style={{ background: 'radial-gradient(ellipse 60% 70% at 50% 0%, #2E2A22 0%, #17150F 70%)' }}
      >
        <div
          className={cn(
            'container-site flex flex-col',
            align === 'center' && 'items-center text-center',
          )}
          style={{ paddingTop: TOP, paddingBottom: BOTTOM }}
        >
          <div className="flex w-full max-w-[880px] flex-col items-center">
            <PageBreadcrumb section={section} page={page} align="center" className="animate-fade-up" />

            <h1
              id="page-title"
              className="m-0 mt-5 type-h1 text-balance text-white"
            >
              <Title text={title} />
            </h1>

            {intro && (
              <div
                className="animate-fade-up mt-6 max-w-[52ch] type-lead text-balance text-white/72"
                style={{ animationDelay: '180ms' }}
              >
                {intro}
              </div>
            )}
          </div>

          {children && (
            <div
              className="animate-fade-up relative z-[2] mt-10 flex w-full flex-col items-center"
              style={{ animationDelay: '310ms', ...slotStyle }}
            >
              {children}
            </div>
          )}
        </div>
      </section>
      {overhang && <div aria-hidden className={overhangClassName} style={{ height: overhang }} />}
    </>
  );
}
