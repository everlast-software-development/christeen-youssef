import { Image } from '@/components/ui/image';
import { TransitionLink } from '@/components/ui/transition-link';
import portrait from '@/assets/dr-christeen.webp';

/**
 * The article's sign-off, centred and without a card: a short gold hairline,
 * the About portrait in a 64px circle, the signature (the Home About one),
 * her title and a link to the full profile.
 */
export function ArticleAuthor() {
  return (
    <div className="flex flex-col items-center text-center">
      <span aria-hidden className="h-px w-12 bg-gold" />
      {/* The About portrait is half-length; zoomed in on the face so it reads
          at 64px. `sizes` counts the zoom, so the file stays sharp. */}
      <span className="mt-8 block size-16 overflow-hidden rounded-full bg-page">
        <Image
          src={portrait}
          alt=""
          width={64}
          height={64}
          sizes="112px"
          className="size-full origin-[50%_18%] scale-[1.75] object-cover object-[50%_12%]"
        />
      </span>
      <p className="m-0 mt-4 font-display text-[26px] leading-tight text-ink italic">Christeen Youssef</p>
      <p className="m-0 mt-2 type-eyebrow text-caption-strong">Founder &amp; Medical Director</p>
      <TransitionLink
        href="/about-me"
        className="tap-target relative mt-3 type-small font-semibold text-gold-text transition-colors hover-fine:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        Read full profile →
      </TransitionLink>
    </div>
  );
}
