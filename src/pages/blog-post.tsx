import { useState } from 'react';
import { useParams } from 'react-router';
import NotFound from '@/pages/not-found';
import { Seo } from '@/components/site/seo';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { TransitionLink } from '@/components/ui/transition-link';
import { ArticleRow } from '@/components/site/article-row';
import { CtaBand } from '@/components/site/cta-band';
import { Lightbox } from '@/components/site/lightbox';
import { ArticleHero } from '@/components/blog/article-hero';
import { ArticleBody, placeImages } from '@/components/blog/article-body';
import { ArticleToc, ArticleTocToggle, STICKY_TOP } from '@/components/blog/article-toc';
import { ArticleStats } from '@/components/blog/article-stats';
import { ArticleShare } from '@/components/blog/article-share';
import { ArticleAuthor } from '@/components/blog/article-author';
import { blogPosts } from '@/data/blog';
import { byNewest } from '@/lib/blog-date';
import { heroFocus } from '@/lib/blog-image';
import { parseArticle, tableOfContents } from '@/lib/blog-content';

/** Below this a contents list is furniture rather than navigation. */
const TOC_MIN_ITEMS = 2;

/** Cards at the foot of the article. */
const RELATED_COUNT = 3;

const PAGER_CARD =
  'group flex h-full flex-col gap-3 rounded-card border border-line bg-page p-6 transition-colors hover-fine:border-ink/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';

/**
 * One frame for every article, on one 12-column grid (from lg):
 *
 *   row 1  1–3   "On this page", sticky, the section being read in gold
 *          4–10  the article — cover, figures, body — held to one measure
 *                (68ch), so photographs and copy share both edges
 *          11–12 the share rail, sticky
 *   row 2  4–10  byline, share row (small screens), prev/next — not sticky,
 *                and below the rails, which stop with row 1
 *
 * The side columns are reserved on every post, whether or not it has contents
 * to list, so the copy lands in the same place on every article. Below lg the
 * contents fold behind a button under the hero, the rail goes, and the share
 * row at the end of the article stays.
 */
export default function BlogPostPage() {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (!post) return <NotFound />;

  const path = `/blog/${post.slug}`;
  const sections = parseArticle(post.content ?? post.excerpt);
  const toc = tableOfContents(sections);
  const showToc = toc.length >= TOC_MIN_ITEMS;

  // The cover is photograph 0 in the lightbox; the body's follow in reading order.
  const placed = placeImages(sections, post.figures, post.gallery, 1);
  const photos = [{ image: post.image, alt: post.title, caption: post.imageCaption }, ...placed.all];

  // Previous and next in reading order, which is chronological.
  const ordered = [...blogPosts].sort(byNewest);
  const position = ordered.findIndex((entry) => entry.slug === post.slug);
  const newer = position > 0 ? ordered[position - 1] : null;
  const older = position < ordered.length - 1 ? ordered[position + 1] : null;

  // Same category first — a reader who came for a conference talk wants
  // another talk — topped up with whatever is newest.
  const related = [
    ...ordered.filter((entry) => entry.slug !== post.slug && entry.category === post.category),
    ...ordered.filter((entry) => entry.slug !== post.slug && entry.category !== post.category),
  ].slice(0, RELATED_COUNT);

  return (
    <main id="content" className="bg-cream text-ink">
      <Seo path={path} title={post.title} description={post.excerpt} image={post.image} type="article" />
      <ArticleHero post={post} />

      <div className="container-site pt-8 pb-[var(--section-y)] lg:grid lg:grid-cols-12 lg:gap-x-6 lg:pt-16">
        {/* 1–3 */}
        <aside className="hidden lg:col-span-3 lg:row-start-1 lg:block">
          {showToc && <ArticleToc items={toc} />}
        </aside>

        {/* 4–10 — font-size here so the 68ch measure is counted in body type. */}
        <article className="min-w-0 max-w-[68ch] text-[17px] lg:col-span-7 lg:row-start-1">
          {showToc && (
            <div className="mb-8 lg:hidden">
              <ArticleTocToggle items={toc} />
            </div>
          )}

          <figure className="m-0 mb-12 animate-fade-up">
            <button
              type="button"
              onClick={() => setLightbox(0)}
              aria-label="Enlarge the cover photograph"
              className="relative block aspect-video w-full cursor-zoom-in overflow-hidden rounded-card bg-page focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <Image
                src={post.image}
                alt=""
                fill
                preload
                sizes="(min-width: 1024px) 720px, 94vw"
                placeholder="blur"
                style={{ objectPosition: heroFocus(post) }}
                className="object-cover"
              />
            </button>
            {post.imageCaption && (
              <figcaption className="mt-3 type-small text-caption-strong">{post.imageCaption}</figcaption>
            )}
          </figure>

          {post.stats && post.stats.length > 0 && <ArticleStats stats={post.stats} />}

          <ArticleBody sections={sections} images={placed.bySection} onOpenImage={setLightbox} />
        </article>

        {/* 11–12 */}
        <aside className="hidden lg:col-span-2 lg:row-start-1 lg:block">
          <div className="sticky" style={{ top: STICKY_TOP }}>
            <ArticleShare path={path} title={post.title} layout="rail" />
          </div>
        </aside>

        {/* ---------------- End of article — row 2, 4–10 ----------------
            Its own grid row, so the two sticky rails (whose cells end with
            row 1) let go at the end of the body and never sit beside this. */}
        <div className="min-w-0 max-w-[68ch] text-[17px] lg:col-span-7 lg:col-start-4 lg:row-start-2">
          <footer className="mt-16 border-t border-line pt-8">
            <ArticleAuthor />
            <ArticleShare path={path} title={post.title} className="mt-8 lg:hidden" />
          </footer>

          {(newer || older) && (
            <nav aria-label="More articles" className="mt-12 grid gap-4 sm:grid-cols-2">
              {older ? (
                <TransitionLink href={`/blog/${older.slug}`} className={PAGER_CARD}>
                  <span className="inline-flex items-center gap-2 type-eyebrow text-caption-strong">
                    <ArrowLeft aria-hidden className="size-3.5" />
                    Earlier
                  </span>
                  <span className="font-display text-[1.375rem] leading-[1.25] font-medium text-ink">{older.title}</span>
                </TransitionLink>
              ) : (
                <span className="hidden sm:block" />
              )}
              {newer && (
                <TransitionLink href={`/blog/${newer.slug}`} className={`${PAGER_CARD} items-end text-right`}>
                  <span className="inline-flex items-center gap-2 type-eyebrow text-caption-strong">
                    Later
                    <ArrowRight aria-hidden className="size-3.5" />
                  </span>
                  <span className="font-display text-[1.375rem] leading-[1.25] font-medium text-ink">{newer.title}</span>
                </TransitionLink>
              )}
            </nav>
          )}
        </div>
      </div>

      {/* ---------------- Related ---------------- */}
      {related.length > 0 && (
        <section aria-labelledby="related-title" className="section-y bg-page">
          <div className="container-site">
            <h2 id="related-title" data-reveal className="type-h2 text-ink">
              Keep reading
            </h2>
            <ArticleRow posts={related} className="mt-10" />
          </div>
        </section>
      )}

      <CtaBand
        title="Every result starts with a conversation"
        body="No two cases are alike. A consultation is where the plan gets built around your skin, your history and what you actually want from treatment."
        primary={{ href: '/reach-me', label: "Let's talk" }}
      />

      <Lightbox
        index={lightbox}
        count={photos.length}
        onIndexChange={setLightbox}
        title={() => post.title}
        meta={(index) => photos[index].caption}
        previousLabel="Previous photograph"
        nextLabel="Next photograph"
      >
        {(index) => (
          <figure className="m-0">
            <Image
              key={index}
              src={photos[index].image}
              alt={photos[index].alt ?? ''}
              sizes="(min-width: 960px) 56rem, 92vw"
              placeholder="blur"
              className="mx-auto h-auto max-h-[72vh] w-auto max-w-full rounded-card"
            />
          </figure>
        )}
      </Lightbox>
    </main>
  );
}
