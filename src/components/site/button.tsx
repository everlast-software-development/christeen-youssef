import type { ComponentProps, ReactNode } from 'react';
import { ArrowRight, MoveRight } from 'lucide-react';
import { TransitionLink } from '@/components/ui/transition-link';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'gold' | 'dark' | 'outline-dark' | 'outline-light';
export type ButtonShape = 'rounded' | 'pill';
export type ButtonArrow = 'short' | 'long' | 'none';

/**
 * The site-wide defaults. Change `shape` to 'pill' or `arrow` to 'long' /
 * 'none' here and every button follows; a single call can still override.
 */
export const BUTTON_DEFAULTS: { shape: ButtonShape; arrow: ButtonArrow } = {
  shape: 'rounded',
  arrow: 'short',
};

const BASE =
  'group inline-flex h-[50px] shrink-0 items-center justify-center gap-3 border px-6 type-button whitespace-nowrap transition-[background-color,border-color,color,box-shadow] duration-300 ease-[var(--ease-brand)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold disabled:pointer-events-none disabled:opacity-60';

const SHAPE: Record<ButtonShape, string> = {
  rounded: 'rounded-[10px]',
  pill: 'rounded-full',
};

/** The corner radius every button has by default — for controls that should
 *  share the button's shape (the blog search, its filter chips). */
export const BUTTON_RADIUS = SHAPE[BUTTON_DEFAULTS.shape];

// Gold surfaces carry white text on gold-deep (#96701f, 4.5:1); white on the
// brighter #b8892a would be under 3:1. The arrow inherits the white.
const VARIANT: Record<ButtonVariant, string> = {
  gold: 'border-gold-deep bg-gold-deep text-white hover-fine:border-gold-deep-hover hover-fine:bg-gold-deep-hover',
  dark: 'border-ink bg-ink text-white hover-fine:border-text hover-fine:bg-text',
  'outline-dark':
    'border-ink/25 bg-transparent text-ink hover-fine:border-ink hover-fine:bg-ink hover-fine:text-white',
  'outline-light':
    'border-white/30 bg-transparent text-white hover-fine:border-white hover-fine:bg-white hover-fine:text-ink',
};

export function buttonClass({
  variant = 'gold',
  shape = BUTTON_DEFAULTS.shape,
  className,
}: {
  variant?: ButtonVariant;
  shape?: ButtonShape;
  className?: string;
} = {}) {
  return cn(BASE, SHAPE[shape], VARIANT[variant], className);
}

export function ButtonArrowIcon({ arrow }: { arrow: ButtonArrow }) {
  if (arrow === 'none') return null;
  const Icon = arrow === 'long' ? MoveRight : ArrowRight;

  return (
    <Icon
      aria-hidden
      strokeWidth={1.8}
      className="size-[17px] transition-transform duration-300 ease-[var(--ease-brand)] group-hover-fine:translate-x-1"
    />
  );
}

type CommonProps = {
  variant?: ButtonVariant;
  shape?: ButtonShape;
  arrow?: ButtonArrow;
  className?: string;
  children: ReactNode;
};

type LinkProps = CommonProps & {
  href: string;
} & Omit<ComponentProps<'a'>, 'href' | 'className' | 'children'>;

type NativeProps = CommonProps & {
  href?: undefined;
} & Omit<ComponentProps<'button'>, 'className' | 'children'>;

/**
 * One button for the whole site. Internal hrefs route through the page
 * transition; tel:, mailto: and off-site links stay plain anchors so the
 * curtain never swallows them; no href renders a real <button>.
 */
export function Button(props: LinkProps | NativeProps) {
  const {
    variant,
    shape,
    arrow = BUTTON_DEFAULTS.arrow,
    className,
    children,
    ...rest
  } = props;
  const classes = buttonClass({ variant, shape, className });
  const inner = (
    <>
      <span>{children}</span>
      <ButtonArrowIcon arrow={arrow} />
    </>
  );

  if (typeof rest.href === 'string') {
    const { href, ...anchor } = rest as Omit<LinkProps, keyof CommonProps>;

    if (href.startsWith('/')) {
      return (
        <TransitionLink href={href} className={classes} {...anchor}>
          {inner}
        </TransitionLink>
      );
    }

    const offsite = href.startsWith('http');
    return (
      <a
        href={href}
        className={classes}
        {...(offsite ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...anchor}
      >
        {inner}
      </a>
    );
  }

  const { type = 'button', ...native } = rest as Omit<
    NativeProps,
    keyof CommonProps
  >;

  return (
    <button type={type} className={classes} {...native}>
      {inner}
    </button>
  );
}

/** Inline call to action: 14.5px/600, a 1px underline and an arrow. */
export function TextLink({
  href,
  onDark = false,
  className,
  children,
}: {
  href: string;
  onDark?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const classes = cn(
    'group inline-flex items-center gap-2 type-button underline decoration-1 underline-offset-[6px] transition-colors duration-300',
    onDark
      ? 'text-white decoration-white/40 hover-fine:decoration-gold-light'
      : 'text-ink decoration-ink/30 hover-fine:decoration-gold',
    className,
  );

  const inner = (
    <>
      {children}
      <ArrowRight
        aria-hidden
        strokeWidth={1.8}
        className="size-[15px] transition-transform duration-300 group-hover-fine:translate-x-1"
      />
    </>
  );

  if (href.startsWith('/')) {
    return (
      <TransitionLink href={href} className={classes}>
        {inner}
      </TransitionLink>
    );
  }

  return (
    <a href={href} className={classes}>
      {inner}
    </a>
  );
}
