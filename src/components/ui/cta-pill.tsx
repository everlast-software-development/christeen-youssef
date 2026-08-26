'use client';

import { TransitionLink } from '@/components/ui/transition-link';
import { TextReveal } from '@/components/ui/cascade-text';
import { cn } from '@/lib/utils';

type CtaPillProps = {
  href: string;
  label: string;
  className?: string;
  /** The header takes it out of the tab order while the menu is open. */
  tabIndex?: number;
  /**
   * Over a dark surface. Only the shell inverts — the gold fill is the same
   * either way, which is why the label has to go ink on hover here: cream on
   * gold is about 2.3:1, and that is the reason gold buttons take ink text
   * everywhere else on this site.
   */
  onDark?: boolean;
};

/** Shared by both exports, so the two can never drift out of step. */
const PILL_SHELL =
  // w-fit because `flex` is block-level: in a flex row the pill shrink-wraps on
  // its own, but given a block parent it stretched to the full column. That is
  // how the carousel's "Read article" came to run the entire width of the slide
  // and sit under the arrow buttons at the other end of it. A pill is sized by
  // its label everywhere; no call site wants it edge to edge.
  'group relative flex h-12 w-fit items-center justify-center overflow-hidden rounded-full px-6 font-body text-sm tracking-[0.14em] whitespace-nowrap uppercase transition-colors duration-500';

// Both, deliberately: `hover:` drives the cascade when the pill itself is
// hovered, `group-hover:` lets an outer group drive it — a wrapper with a badge
// or an icon beside the label counts as a hover even though the pointer never
// touches the text.
const PILL_CASCADE = 'group-hover:[--cascade:1] hover:[--cascade:1]';

/**
 * The site's primary call to action: a glass pill that fills with gold from the
 * base up on hover while the label cascades character by character.
 *
 * Lifted out of site-header.tsx, which was the only place it existed. It is
 * here rather than duplicated because it is the one CTA design on the site —
 * two copies of this much hover choreography drift apart the first time either
 * is touched, and then the page-level CTA quietly stops matching the header.
 *
 * Not the shadcn `Button`: that carries its own variants and focus treatment,
 * and wrapping this in it would mean fighting them.
 */
export function CtaPill({
  href,
  label,
  className,
  tabIndex,
  onDark = false,
}: CtaPillProps) {
  const classes = cn(
    PILL_SHELL,
    PILL_CASCADE,
    'border backdrop-blur-md',
    onDark
      ? 'border-cream/25 bg-cream/10 text-cream hover:text-ink'
      : 'border-ink/15 bg-white/40 text-ink',
    className,
  );

  const inner = (
    <>
      {/* Scales from the bottom edge, so the gold rises into the pill rather
          than fading in over it. */}
      <span
        aria-hidden
        className="absolute inset-0 origin-bottom scale-y-0 bg-gradient-gold transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100"
      />

      <TextReveal text={label} className="relative" />
    </>
  );

  // Only in-app routes go through the ink curtain. A `tel:` or `mailto:` handed
  // to TransitionLink would be intercepted and pushed at the router, which
  // cannot navigate to it — the dialler would simply never open.
  if (!href.startsWith('/')) {
    const offsite = href.startsWith('http');

    return (
      <a
        href={href}
        tabIndex={tabIndex}
        className={classes}
        target={offsite ? '_blank' : undefined}
        rel={offsite ? 'noopener noreferrer' : undefined}
      >
        {inner}
      </a>
    );
  }

  return (
    <TransitionLink href={href} tabIndex={tabIndex} className={classes}>
      {inner}
    </TransitionLink>
  );
}

type CtaSubmitProps = {
  label: string;
  /** Swapped in while the request is in flight. */
  pendingLabel?: string;
  pending?: boolean;
  className?: string;
};

/**
 * The submit-button twin of CtaPill, cut for a dark panel: outlined in cream
 * and empty, filling with gold from the base up on hover.
 *
 * CtaPill is a link, so it cannot be a form's submit control — but the two have
 * to look like one family, which is why the shell and cascade above are shared
 * constants rather than copied class strings.
 *
 * The label going ink on hover is not decoration: cream on gold is about 2.3:1,
 * which is why gold surfaces take ink text everywhere on this site.
 */
export function CtaSubmit({
  label,
  pendingLabel = 'Sending…',
  pending = false,
  className,
}: CtaSubmitProps) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        PILL_SHELL,
        PILL_CASCADE,
        'w-full cursor-pointer border border-cream bg-transparent text-cream',
        'hover:text-ink',
        'focus-visible:ring-3 focus-visible:ring-gold/40 focus-visible:outline-none',
        'disabled:pointer-events-none disabled:opacity-60',
        className,
      )}
    >
      {/* Scales from the bottom edge, so the gold rises into the button rather
          than fading in over it — the same device as the pill above. */}
      <span
        aria-hidden
        className="absolute inset-0 origin-bottom scale-y-0 bg-gradient-gold transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100"
      />

      {/* Keyed so the cascade replays when the label changes rather than
          animating between two different strings mid-flight. */}
      <TextReveal
        key={pending ? 'pending' : 'idle'}
        text={pending ? pendingLabel : label}
        className="relative"
      />
    </button>
  );
}
