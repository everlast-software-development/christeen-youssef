'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';
import { useLenis } from 'lenis/react';
import { TransitionLink } from '@/components/ui/transition-link';
import { TextReveal } from '@/components/ui/cascade-text';
import { navigationItems } from '@/data/navigation';
import { cn } from '@/lib/utils';

const EASE = [0.22, 1, 0.36, 1] as const;

// Long enough for the incoming curtain to hide the panel collapsing.
const MENU_CLOSE_DELAY_MS = 300;

type NavLink = { label: string; href: string };

// The bar has no inline links, so the panel carries the whole nav. Parent
// groups are flattened — a nested dropdown inside a menu panel is friction.
const LINKS: NavLink[] = navigationItems.flatMap((item) =>
  item.children
    ? item.children.map((child) => ({ label: child.label, href: child.href }))
    : [{ label: item.label, href: item.href }],
);

/**
 * Per-character vertical roll on hover.
 *
 * Two stacked copies of each glyph inside an overflow-hidden box; shifting the
 * stack up by half its height swaps one for the other. Motion drives the
 * stagger so an interrupted hover reverses cleanly instead of snapping.
 */
function LetterRoll({ text, active }: { text: string; active: boolean }) {
  const reduced = useReducedMotion();
  const chars = [...text];

  // Still aria-hidden: MenuLink already exposes the label to assistive tech,
  // so returning bare text here would announce every item twice.
  if (reduced) return <span aria-hidden>{text}</span>;

  return (
    <motion.span
      aria-hidden
      className="flex"
      initial={false}
      animate={active ? 'roll' : 'rest'}
      variants={{
        rest: { transition: { staggerChildren: 0.022, staggerDirection: -1 } },
        roll: { transition: { staggerChildren: 0.022 } },
      }}
    >
      {chars.map((char, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden"
          style={{ height: '1em' }}
        >
          <motion.span
            className="flex flex-col"
            variants={{ rest: { y: '0%' }, roll: { y: '-50%' } }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <span style={{ height: '1em', lineHeight: '1em' }}>
              {char === ' ' ? ' ' : char}
            </span>
            <span style={{ height: '1em', lineHeight: '1em' }}>
              {char === ' ' ? ' ' : char}
            </span>
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

function MenuLink({
  link,
  index,
  isOpen,
  isActive,
  onNavigate,
}: {
  link: NavLink;
  index: number;
  isOpen: boolean;
  isActive: boolean;
  onNavigate: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.li
      initial={false}
      animate={{
        opacity: isOpen ? 1 : 0,
        y: isOpen ? 0 : 18,
      }}
      transition={{
        duration: 0.7,
        ease: EASE,
        delay: isOpen ? 0.38 + index * 0.07 : 0,
      }}
    >
      <TransitionLink
        href={link.href}
        onBeforeNavigate={onNavigate}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        tabIndex={isOpen ? 0 : -1}
        aria-current={isActive ? 'page' : undefined}
        className={cn(
          'group flex items-baseline gap-4 py-2.5 font-display text-[clamp(1.75rem,3.4vw,2.5rem)] leading-none transition-colors duration-300',
          isActive ? 'text-gold' : 'text-cream hover:text-gold',
        )}
      >
        <span
          className={cn(
            'h-px shrink-0 self-center bg-gold transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
            isActive ? 'w-7' : 'w-0 group-hover:w-7',
          )}
        />
        {/* Real text for a11y and copy/paste; the roll is decorative. */}
        <span className="sr-only">{link.label}</span>
        <LetterRoll text={link.label} active={hovered} />
      </TransitionLink>
    </motion.li>
  );
}

export function LiquidMenu({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const lenis = useLenis();
  const panelId = useId();

  const containerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);

  // The curtain sweeps in from the right, where this panel sits, so it is
  // covered almost immediately. Closing on a short delay means the collapse
  // happens behind the curtain instead of racing it on screen.
  const handleMenuNavigate = useCallback(() => {
    window.setTimeout(() => onOpenChange(false), MENU_CLOSE_DELAY_MS);
  }, [onOpenChange]);

  // ---- Scroll lock -------------------------------------------------------
  // Lenis owns scrolling when it is mounted; with reduced motion it is not,
  // so fall back to locking the document element directly.
  useEffect(() => {
    if (!open) return;

    if (lenis) {
      lenis.stop();
      return () => lenis.start();
    }

    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => {
      root.style.overflow = previous;
    };
  }, [open, lenis]);

  // ---- Escape, outside click, focus management --------------------------
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        toggleRef.current?.focus();
        return;
      }

      if (event.key !== 'Tab') return;

      // Keep focus inside the panel while it behaves as a modal surface.
      const focusables = containerRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusables?.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) close();
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);

    // Move focus to the first link once the panel has opened.
    const focusTimer = window.setTimeout(() => {
      navRef.current?.querySelector<HTMLAnchorElement>('a[href]')?.focus();
    }, reduced ? 0 : 560);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
      window.clearTimeout(focusTimer);
    };
  }, [open, close, reduced]);

  return (
    <>
      {/* Backdrop — also the click-to-close target */}
      <motion.div
        aria-hidden
        initial={false}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: 0.65, ease: EASE }}
        className={cn(
          'fixed inset-0 z-40 bg-ink/35 backdrop-blur-[2px]',
          open ? 'pointer-events-auto' : 'pointer-events-none',
        )}
      />

      <div
        ref={containerRef}
        data-state={open ? 'open' : 'closed'}
        className={cn(
          'fixed top-3 right-5 z-50 flex flex-col overflow-hidden md:right-8',
          // The morph itself is CSS, not Motion: transitioning computed widths
          // lets the open size stay a responsive clamp() instead of a measured
          // pixel value, so no resize listener is needed.
          'transition-[width,height,background-color,border-color]',
          'duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
          // Radius is a constant 1.5rem and deliberately NOT transitioned.
          // rounded-full resolves to an effectively infinite radius, which the
          // browser clamps to half the box — so while the box grew it stayed
          // clamped as a giant stadium and then snapped. 1.5rem is exactly half
          // the closed height, so it still reads as a true pill when closed.
          'h-12 w-[8.75rem] rounded-[1.5rem] border border-ink/15 bg-white/40 backdrop-blur-md',
          'will-change-[width,height]',
          'data-[state=open]:h-[calc(100svh-1.5rem)]',
          'data-[state=open]:w-[min(calc(100vw-2.5rem),clamp(21rem,30vw,30rem))]',
          'data-[state=open]:border-cream/10 data-[state=open]:bg-transparent',
        )}
      >
        {/* Ink wash: an oversized circle descending from above the panel, which
            is what gives the morph its liquid leading edge. Sized in vh so it
            always covers a full-height panel. */}
        <motion.div
          aria-hidden
          initial={false}
          animate={{ x: '-50%', y: open ? '-25%' : '-100%' }}
          transition={{
            duration: reduced ? 0 : 1,
            ease: EASE,
          }}
          // y/x are transforms rather than `top`, so the wash composites on the
          // GPU instead of forcing layout on a 155vh element every frame.
          // At y:-100% its bottom edge rests exactly on the panel top.
          className="absolute top-0 left-1/2 rounded-full bg-ink"
          style={{ width: '155vh', height: '155vh' }}
        />


        {/* ---------------- Top bar: label + hamburger ---------------- */}
        <button
          ref={toggleRef}
          type="button"
          onClick={() => onOpenChange(!open)}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="group relative z-10 flex h-12 w-full shrink-0 cursor-pointer items-center justify-between px-5 hover:[--cascade:1]"
        >
          <TextReveal
            text={open ? 'Close' : 'Menu'}
            className={cn(
              'font-body text-sm tracking-[0.14em] uppercase transition-colors duration-300',
              open ? 'text-cream' : 'text-ink',
            )}
          />

          <span className="relative flex size-6 items-center justify-center">
            <motion.span
              className={cn(
                'absolute block h-[1.5px] w-[18px] rounded-full transition-colors duration-300',
                open ? 'bg-cream' : 'bg-ink',
              )}
              initial={false}
              animate={{ rotate: open ? 45 : 0, y: open ? 0 : -3.5 }}
              transition={{ duration: 0.55, ease: EASE }}
            />
            <motion.span
              className={cn(
                'absolute block h-[1.5px] w-[18px] rounded-full transition-colors duration-300',
                open ? 'bg-cream' : 'bg-ink',
              )}
              initial={false}
              animate={{ rotate: open ? -45 : 0, y: open ? 0 : 3.5 }}
              transition={{ duration: 0.55, ease: EASE }}
            />
          </span>
        </button>

        {/* ---------------- Nav links ---------------- */}
        <nav
          ref={navRef}
          id={panelId}
          aria-label="Site navigation"
          className={cn(
            'relative z-10 flex flex-1 flex-col justify-center px-7 pb-10',
            'transition-opacity duration-200',
            open ? 'pointer-events-auto' : 'pointer-events-none',
          )}
          style={{ opacity: open ? 1 : 0 }}
        >
          <ul>
            {LINKS.map((link, index) => (
              <MenuLink
                key={link.href}
                link={link}
                index={index}
                isOpen={open}
                isActive={pathname === link.href}
                onNavigate={handleMenuNavigate}
              />
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
