import type { Metadata } from 'next';
import Image from 'next/image';
import { TransitionLink } from '@/components/ui/transition-link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { blogPosts } from '@/data/blog';

type Params = { params: Promise<{ slug: string }> };

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

  return (
    <main className="bg-background pb-24">
      <article className="container-brand max-w-3xl pt-28">
        <TransitionLink
          href="/blog"
          className="inline-flex items-center gap-2 font-body text-sm text-slate transition-colors hover:text-gold"
        >
          <ArrowLeft className="size-4" />
          All articles
        </TransitionLink>

        <p className="mt-10 font-body text-xs tracking-[0.25em] text-gold uppercase">
          {post.category} · {post.readTime}
        </p>

        <h1 className="mt-4 font-display text-display-md text-ink">
          {post.title}
        </h1>

        <p className="mt-4 font-body text-sm text-slate">{post.date}</p>

        <Image
          src={post.image}
          alt={post.title}
          priority
          className="mt-10 w-full rounded-xl object-cover"
          sizes="(max-width: 768px) 100vw, 768px"
        />

        {/* TODO(rebuild): render `content` through a markdown pipeline —
            it uses ## headings and - lists that need real parsing. */}
        <div className="mt-12 space-y-5 font-body text-base/8 text-ink-soft">
          {(post.content ?? post.excerpt)
            .split('\n\n')
            .filter(Boolean)
            .map((block, i) => (
              <p key={i} className="whitespace-pre-wrap">
                {block}
              </p>
            ))}
        </div>
      </article>
    </main>
  );
}
