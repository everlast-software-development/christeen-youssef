import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { TransitionLink } from '@/components/ui/transition-link';
import { BlogCard } from '@/components/ui/blog-card';
import { ClosingCta } from '@/components/sections/closing-cta';
import { ArticleHero } from '@/components/blog/article-hero';
import { ArticleBody } from '@/components/blog/article-body';
import { ArticleToc } from '@/components/blog/article-toc';
import { blogPosts } from '@/data/blog';
import { byNewest } from '@/lib/blog-date';
import { parseArticle, tableOfContents } from '@/lib/blog-content';

type Params = { params: Promise<{ slug: string }> };

/** Below this a contents sidebar is furniture rather than navigation. */
const TOC_MIN_ITEMS = 4;

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

      <div className="mx-auto max-w-7xl px-5 pt-16 pb-24 md:px-8 lg:px-12 lg:pt-24 lg:pb-32 xl:px-20">
        <div
          className={
            showToc
              ? 'grid gap-12 xl:grid-cols-[15rem_minmax(0,1fr)] xl:gap-20'
              : ''
          }
        >
          {showToc && <ArticleToc items={toc} />}

          {/* A measure, not the column width: body copy stops being readable
              somewhere around 75 characters however much room is going. */}
          <article className="max-w-[68ch]">
            <ArticleBody sections={sections} gallery={post.gallery} />
          </article>
        </div>
      </div>

      {/* ---------------- Previous / next ---------------- */}
      {(newer || older) && (
        <nav
          aria-label="More articles"
          className="mx-auto max-w-7xl border-t border-ink/10 px-5 py-14 md:px-8 lg:px-12 xl:px-20"
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
        <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8 lg:px-12 lg:pb-32 xl:px-20">
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
