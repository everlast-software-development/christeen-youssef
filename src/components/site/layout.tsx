import type { ComponentProps, ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * The page's layout primitives. Every section's content starts on the same
 * left edge because every section goes through Container.
 */

export function Container({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('container-site', className)} {...props} />;
}

export type Tone = 'page' | 'cream' | 'ink';

const TONE: Record<Tone, string> = {
  page: 'bg-page text-text',
  cream: 'bg-cream text-text',
  ink: 'bg-ink text-white',
};

/** A full-width colour band with the shared vertical rhythm. */
export function Section({
  tone = 'page',
  className,
  ...props
}: ComponentProps<'section'> & { tone?: Tone }) {
  return (
    <section
      data-tone={tone}
      className={cn('section-y relative', TONE[tone], className)}
      {...props}
    />
  );
}

export function Eyebrow({
  onDark = false,
  as: Tag = 'p',
  className,
  ...props
}: ComponentProps<'p'> & { onDark?: boolean; as?: ElementType }) {
  return (
    <Tag
      className={cn(
        'type-eyebrow',
        onDark ? 'text-eyebrow-dark' : 'text-caption-strong',
        className,
      )}
      {...props}
    />
  );
}

type SectionHeadingProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  onDark?: boolean;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2';
  /** Rendered beside the heading at md and up (arrows, a "view all" link). */
  aside?: ReactNode;
  className?: string;
  titleClassName?: string;
};

/**
 * Eyebrow, heading and optional standfirst, with the scroll reveal attached.
 * The reveal is a transform only — see providers/scroll-motion.tsx.
 */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  onDark = false,
  align = 'left',
  as: Heading = 'h2',
  aside,
  className,
  titleClassName,
}: SectionHeadingProps) {
  const centered = align === 'center';

  const block = (
    <div
      data-reveal
      className={cn(centered && 'mx-auto max-w-[44rem] text-center', !aside && className)}
    >
      {eyebrow && <Eyebrow onDark={onDark}>{eyebrow}</Eyebrow>}
      <Heading
        className={cn(
          'type-h2',
          eyebrow && 'mt-4',
          onDark ? 'text-white' : 'text-ink',
          titleClassName,
        )}
      >
        {title}
      </Heading>
      {intro && (
        <div
          className={cn(
            'mt-5 max-w-[38rem] type-body',
            centered && 'mx-auto',
            onDark ? 'text-white/70' : 'text-soft',
          )}
        >
          {intro}
        </div>
      )}
    </div>
  );

  if (!aside) return block;

  return (
    <div
      className={cn(
        'flex flex-col gap-6 md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      {block}
      <div data-reveal className="shrink-0">
        {aside}
      </div>
    </div>
  );
}

/**
 * The split used wherever a section sets a heading beside its content: on the
 * 12-column grid, the heading takes columns 1–5 and the content 6–12, with the
 * home page's 64px gutter. Below 961px they stack, heading first.
 */
export const SPLIT = {
  grid: 'grid gap-y-10 min-[961px]:grid-cols-12 min-[961px]:gap-x-16',
  start: 'min-[961px]:col-span-5',
  end: 'min-[961px]:col-span-7',
} as const;

/** The home page's band padding. */
export const BAND_Y = 'py-[clamp(64px,7vw,104px)]';
