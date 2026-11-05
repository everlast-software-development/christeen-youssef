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
import { parseArticle, tableOfContents } from '@/lib/blog-content';

/** Below this a contents list is furniture rather than navigation. */
const TOC_MIN_ITEMS = 2;

/** Cards at the foot of the article. */
const RELATED_COUNT = 3;

/** Earlier / Later: text on the cream, no box — the row's hairlines are the frame. */
const PAGER_LINK =
  'group flex flex-col gap-2 py-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';
const PAGER_TITLE =
  'line-clamp-2 font-display text-[1.125rem] leading-[1.35] font-medium text-ink transition-colors duration-200 group-hover-fine:text-gold-text';

/**
 * One frame for every article. The cover hangs from the hero across the full
 * container (ArticleHero); below it, one 12-column grid (from lg):
 *
 *   row 1  1–2   "On this page", sticky, the section being read marked gold
 *          3–10  the article — figures and body — at most 720px wide
 *          11–12 the share rail, sticky, level with the contents
 *   row 2  3–10  the sign-off, the share row (small screens) and Earlier /
 *                Later — not sticky, and below the rails, which stop with row 1
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

  // The cover is photograph 0 in the lightbox; the body's follow in reading
  // order — less any that only repeat the cover.
  const placed = placeImages(sections, post.figures, post.gallery, 1, post.image);
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
    <main id="content" className="cover-overhang bg-cream text-ink">
      <Seo path={path} title={post.title} description={post.excerpt} image={post.image} type="article" />
      <ArticleHero post={post} onOpenCover={() => setLightbox(0)} />

      <div className="container-site pt-10 pb-[var(--section-y)] lg:grid lg:grid-cols-12 lg:gap-x-6 lg:pt-16">
        {/* 1–2 */}
        <aside className="hidden lg:col-span-2 lg:row-start-1 lg:block">
          {showToc && <ArticleToc items={toc} />}
        </aside>

        {/* 3–10 */}
        <article className="min-w-0 lg:col-span-8 lg:row-start-1">
          <div className="max-w-[720px]">
            {post.imageCaption && (
              <p className="m-0 mb-8 type-small text-caption-strong">{post.imageCaption}</p>
            )}

            {showToc && (
              <div className="mb-10 lg:hidden">
                <ArticleTocToggle items={toc} />
              </div>
            )}

            {post.stats && post.stats.length > 0 && <ArticleStats stats={post.stats} />}

            <ArticleBody sections={sections} images={placed.bySection} onOpenImage={setLightbox} />
          </div>
        </article>

        {/* 11–12 */}
        <aside className="hidden lg:col-span-2 lg:row-start-1 lg:block">
          <div className="sticky" style={{ top: STICKY_TOP }}>
            <ArticleShare path={path} title={post.title} layout="rail" />
          </div>
        </aside>

        {/* ---------------- End of article — row 2, 3–10 ----------------
            Its own grid row, so the two sticky rails (whose cells end with
            row 1) let go at the end of the body and never sit beside this. */}
        <div className="min-w-0 lg:col-span-8 lg:col-start-3 lg:row-start-2">
          <div className="max-w-[720px]">
            <footer className="mt-20">
              <ArticleAuthor />
              <ArticleShare path={path} title={post.title} className="mt-10 justify-center lg:hidden" />
            </footer>

            {(newer || older) && (
              <nav aria-label="More articles" className="mt-16 grid divide-y divide-line border-y border-line sm:grid-cols-2 sm:gap-8 sm:divide-y-0">
                {older ? (
                  <TransitionLink href={`/blog/${older.slug}`} className={PAGER_LINK}>
                    <span className="inline-flex items-center gap-2 type-eyebrow text-caption-strong">
                      <ArrowLeft aria-hidden className="size-3.5 transition-transform duration-200 group-hover-fine:-translate-x-1" />
                      Earlier
                    </span>
                    <span className={PAGER_TITLE}>{older.title}</span>
                  </TransitionLink>
                ) : (
                  <span className="hidden sm:block" />
                )}
                {newer && (
                  <TransitionLink href={`/blog/${newer.slug}`} className={`${PAGER_LINK} items-end text-right`}>
                    <span className="inline-flex items-center gap-2 type-eyebrow text-caption-strong">
                      Later
                      <ArrowRight aria-hidden className="size-3.5 transition-transform duration-200 group-hover-fine:translate-x-1" />
                    </span>
                    <span className={PAGER_TITLE}>{newer.title}</span>
                  </TransitionLink>
                )}
              </nav>
            )}
          </div>
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
