import { Image } from '@/components/ui/image';
import { TransitionLink } from '@/components/ui/transition-link';
import portrait from '@/assets/dr-christeen.webp';

/** The byline at the end of an article, linking to the full profile. */
export function ArticleAuthor() {
  return (
    <div className="flex items-center gap-4">
      <Image
        src={portrait}
        alt=""
        width={48}
        height={48}
        sizes="48px"
        className="size-12 shrink-0 rounded-full object-cover object-top"
      />
      <div className="min-w-0">
        <p className="m-0 font-display text-[1.25rem] leading-tight font-medium text-ink">Dr. Christeen Youssef</p>
        <p className="m-0 mt-0.5 type-small text-soft">Founder &amp; Medical Director, Everlast Wellness Medical Center</p>
        <TransitionLink
          href="/about-me"
          className="mt-1.5 inline-block type-small font-medium text-gold-text underline decoration-gold/50 underline-offset-4 transition-colors hover-fine:text-ink"
        >
          Read full profile →
        </TransitionLink>
      </div>
    </div>
  );
}
