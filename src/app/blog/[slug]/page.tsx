import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { TransitionLink } from '@/components/ui/transition-link';
import { BlogCard } from '@/components/ui/blog-card';
import { ClosingCta } from '@/components/sections/closing-cta';
import { ArticleHero } from '@/components/blog/article-hero';
import { ArticleBody } from '@/components/blog/article-body';
import { ArticleToc } from '@/components/blog/article-toc';
import { ArticleStats } from '@/components/blog/article-stats';
import { ArticleMotion } from '@/components/blog/article-motion';
import { blogPosts } from '@/data/blog';
import { byNewest } from '@/lib/blog-date';
import { parseArticle, tableOfContents } from '@/lib/blog-content';

type Params = { params: Promise<{ slug: string }> };

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

// Every post is known at build time, so all of them prerender as static HTML.
export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      images: [
        {
          url: post.image.src,
          width: post.image.width,
          height: post.image.height,
        },
      ],
    },
  };
}

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
export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) notFound();

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
    <main className="bg-cream text-ink">
      <ArticleHero post={post} />

      {post.stats && post.stats.length > 0 && (
        <ArticleMotion>
          <ArticleStats stats={post.stats} />
        </ArticleMotion>
      )}

      {/* One GSAP context over the whole article, so the headings, the lists
          and the photographs inside them reveal as a single sequence. */}
      <ArticleMotion>
        <div className="mx-auto max-w-[88rem] px-5 pt-16 pb-24 md:px-8 lg:px-12 lg:pt-24 lg:pb-32 xl:px-20">
          {/* The rail column is reserved on every post, whether or not that post
              has contents to put in it. It is what lands the copy in the same
              place on every article — a page that dropped the empty column
              would start its first line 20rem left of the one before it. */}
          <div className="grid gap-12 xl:grid-cols-[15rem_minmax(0,1fr)] xl:gap-20">
            {showToc ? (
              <ArticleToc items={toc} />
            ) : (
              <div aria-hidden className="hidden xl:block" />
            )}

            {/* A measure, not the column width: body copy stops being readable
                somewhere around 75 characters however much room is going, so the
                wider container above buys the copy a few characters and spends
                the rest on the margins.

                The photographs are inside this, not beside it. There is no
                picture column and no gallery band any more — a post's images go
                into the sections they belong to and the copy runs past them, so
                the article is one thing rather than a piece of writing with a
                strip of photographs alongside. */}
            <article className="min-w-0 max-w-[72ch]">
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
        <nav
          aria-label="More articles"
          className="mx-auto max-w-[88rem] border-t border-ink/10 px-5 py-14 md:px-8 lg:px-12 xl:px-20"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            {older ? (
              <TransitionLink
                href={`/blog/${older.slug}`}
                className="group flex flex-col gap-3 rounded-2xl border border-ink/10 p-6 transition-colors hover:border-gold/40"
              >
                <span className="inline-flex items-center gap-2 font-body text-[0.68rem] tracking-[0.18em] text-slate/70 uppercase">
                  <ArrowLeft aria-hidden className="size-3.5" />
                  Earlier
                </span>
                <span className="font-display text-lg/snug text-ink transition-colors group-hover:text-gold-dark">
                  {older.title}
                </span>
              </TransitionLink>
            ) : (
              <span />
            )}

            {newer && (
              <TransitionLink
                href={`/blog/${newer.slug}`}
                className="group flex flex-col items-end gap-3 rounded-2xl border border-ink/10 p-6 text-right transition-colors hover:border-gold/40 sm:col-start-2"
              >
                <span className="inline-flex items-center gap-2 font-body text-[0.68rem] tracking-[0.18em] text-slate/70 uppercase">
                  Later
                  <ArrowRight aria-hidden className="size-3.5" />
                </span>
                <span className="font-display text-lg/snug text-ink transition-colors group-hover:text-gold-dark">
                  {newer.title}
                </span>
              </TransitionLink>
            )}
          </div>
        </nav>
      )}

      {/* ---------------- Related ---------------- */}
      {related.length > 0 && (
        <section className="mx-auto max-w-[88rem] px-5 pb-24 md:px-8 lg:px-12 lg:pb-32 xl:px-20">
          <div className="flex items-center gap-6">
            <h2 className="shrink-0 font-display text-display-sm text-ink">
              Keep reading
            </h2>
            <span aria-hidden className="h-px flex-1 bg-ink/12" />
          </div>

          <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {related.map((entry) => (
              <BlogCard
                key={entry.slug}
                post={entry}
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 90vw"
              />
            ))}
          </div>

          <ClosingCta
            title="Every result starts with a conversation"
            body="No two cases are alike. A consultation is where the plan gets built around your skin, your history and what you actually want from treatment."
            href="/reach-me"
            label="Let's talk"
          />
        </section>
      )}
    </main>
  );
}
