import { useParams } from 'react-router';
import NotFound from '@/pages/not-found';
import { Seo } from '@/components/site/seo';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { TransitionLink } from '@/components/ui/transition-link';
import { ArticleRow } from '@/components/site/article-row';
import { CtaBand } from '@/components/site/cta-band';
import { ArticleHero } from '@/components/blog/article-hero';
import { ArticleBody } from '@/components/blog/article-body';
import { ArticleToc } from '@/components/blog/article-toc';
import { ArticleStats } from '@/components/blog/article-stats';
import { ArticleMotion } from '@/components/blog/article-motion';
import { blogPosts } from '@/data/blog';
import { byNewest } from '@/lib/blog-date';
import { parseArticle, tableOfContents } from '@/lib/blog-content';

/**
 * Below this a contents sidebar is furniture rather than navigation.
 *
 * Two, not four. The threshold used to be set by what a rail needs to earn its
 * place on its own page; it is now set by the fact that every article is the
 * same page. A reader who has learned that the contents live in the left rail
 * should find them there on the next piece too, and only the two single-
 * paragraph posts have nothing to put in one.
 */
const TOC_MIN_ITEMS = 2;

/** Cards at the foot of the article. */
const RELATED_COUNT = 3;

/**
 * One frame for every article.
 *
 * There used to be three. A post with a gallery was laid out in two columns with
 * the photographs in a rail on the right; a post under 350 words was narrowed
 * and centred as a "note"; and only the posts that had neither got the contents
 * rail, the numbered sections and the single measure — the shape of the SVF
 * piece. Which meant ten posts read as three different publications, and the one
 * a reader saw first was whichever they happened to click.
 *
 * The SVF shape is now the shape. Hero, figures band, contents rail on the left,
 * one measure of copy — and the photographs set into that copy rather than
 * shown alongside it. What varies between posts is what each has to put in the
 * frame, not the frame.
 */
export default function BlogPostPage() {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) return <NotFound />;

  const sections = parseArticle(post.content ?? post.excerpt);
  const toc = tableOfContents(sections);

  // Previous and next in reading order, which is chronological — not the file
  // order the index leads with.
  const ordered = [...blogPosts].sort(byNewest);
  const position = ordered.findIndex((entry) => entry.slug === post.slug);
  const newer = position > 0 ? ordered[position - 1] : null;
  const older =
    position < ordered.length - 1 ? ordered[position + 1] : null;

  // Same category first, because the categories here are genuinely different
  // kinds of writing — a reader who came for a conference talk wants another
  // talk, not a patient story. Topped up with whatever is newest.
  const related = [
    ...ordered.filter(
      (entry) => entry.slug !== post.slug && entry.category === post.category,
    ),
    ...ordered.filter(
      (entry) => entry.slug !== post.slug && entry.category !== post.category,
    ),
  ].slice(0, RELATED_COUNT);

  const showToc = toc.length >= TOC_MIN_ITEMS;

  return (
    <main id="content" className="bg-cream text-ink">
      <Seo
        path={`/blog/${post.slug}`}
        title={post.title}
        description={post.excerpt}
        image={post.image}
        type="article"
      />
      <ArticleHero post={post} />

      {post.stats && post.stats.length > 0 && (
        <ArticleMotion>
          <div className="mt-14">
            <ArticleStats stats={post.stats} />
          </div>
        </ArticleMotion>
      )}

      <ArticleMotion>
        <div className="container-site pt-14 pb-[var(--section-y)] lg:pt-20">
          {/* The rail column is reserved on every post, whether or not that post
              has contents to put in it, so the copy lands in the same place on
              every article. */}
          <div className="grid gap-12 xl:grid-cols-[minmax(0,1fr)_720px_minmax(0,1fr)] xl:gap-14">
            {showToc ? (
              <div className="hidden xl:flex xl:justify-end">
                <div className="w-[13rem]">
                  <ArticleToc items={toc} />
                </div>
              </div>
            ) : (
              <div aria-hidden className="hidden xl:block" />
            )}

            <article className="mx-auto w-full min-w-0 max-w-[720px] xl:mx-0">
              <ArticleBody
                sections={sections}
                figures={post.figures}
                gallery={post.gallery}
              />
            </article>
          </div>
        </div>
      </ArticleMotion>

      {/* ---------------- Previous / next ---------------- */}
      {(newer || older) && (
        <nav aria-label="More articles" className="border-t border-line">
          <div className="container-site grid gap-4 py-12 sm:grid-cols-2">
            {older ? (
              <TransitionLink
                href={`/blog/${older.slug}`}
                className="group flex flex-col gap-3 rounded-[16px] border border-line bg-page p-6 transition-colors hover-fine:border-ink/30"
              >
                <span className="type-eyebrow inline-flex items-center gap-2 text-caption-strong">
                  <ArrowLeft aria-hidden className="size-3.5" />
                  Earlier
                </span>
                <span className="type-h3 text-ink">
                  {older.title}
                </span>
              </TransitionLink>
            ) : (
              <span />
            )}

            {newer && (
              <TransitionLink
                href={`/blog/${newer.slug}`}
                className="group flex flex-col items-end gap-3 rounded-[16px] border border-line bg-page p-6 text-right transition-colors hover-fine:border-ink/30 sm:col-start-2"
              >
                <span className="type-eyebrow inline-flex items-center gap-2 text-caption-strong">
                  Later
                  <ArrowRight aria-hidden className="size-3.5" />
                </span>
                <span className="type-h3 text-ink">
                  {newer.title}
                </span>
              </TransitionLink>
            )}
          </div>
        </nav>
      )}

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
    </main>
  );
}
