'use client';

import { useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { TransitionLink } from '@/components/ui/transition-link';
import { motion } from 'motion/react';
import { LiquidMenu } from '@/components/layout/liquid-menu';
import { CtaPill } from '@/components/ui/cta-pill';
import { BlogSearchField } from '@/components/layout/blog-search-field';
import { ScrollProgress } from '@/components/layout/scroll-progress';
import { cn } from '@/lib/utils';
import { usePageTransition } from '@/components/providers/page-transition';
import { useHeaderSurface } from '@/components/layout/use-header-surface';
import { useScrolled } from '@/components/layout/use-scrolled';
import logoInk from '@/assets/Dr.-CY-Logo-FINAL-023-scaled (1).webp';
import logoCream from '@/assets/logo-light.webp';

const EASE = [0.22, 1, 0.36, 1] as const;

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Held while the menu is open: the panel covers the probe point, so the
  // header would otherwise flip as the panel expands over it.
  //
  // The transition phase is passed in so the surface is re-read at each stage of
  // a route change — covering, loading, revealing, idle. Without it the reading
  // only refreshed on scroll, so arriving on a dark page from a link left the
  // ink logo sitting on ink until you moved.
  const { phase } = usePageTransition();
  const surfaceDark = useHeaderSurface(menuOpen, phase);

  // The blog listing opens on a full-height dark carousel and then runs into a
  // long cream grid, so the header has nothing consistent to sit on. From the
  // first scroll it gets a field of its own instead. Scoped to that route: the
  // home page is composed around a sticky hero the header is meant to sit over,
  // and a bar there would cover the thing it is sitting on.
  const pathname = usePathname();
  const scrolled = useScrolled(40);
  const solid = pathname === '/blog' && scrolled;

  // While the bar is up the header is over white, whatever the probe found
  // underneath it. Without this the logo would stay on its cream cut over the
  // carousel and simply vanish into the bar — elementsFromPoint reports what
  // painted at that pixel, and the bar itself carries no surface marker, so it
  // is skipped and the dark slide below still wins the reading.
  const onDark = surfaceDark && !solid;

  return (
    <>
      <ScrollProgress />

      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
        className="fixed inset-x-0 top-0 z-50"
      >
        {/* Mobile only. The row is fixed at every width, but below lg it has
            no field, so the logo sits directly on whatever is scrolling under
            it. This gives it one, tinted to match the surface the probe already
            reports — cream over the light sections, ink over the dark ones. At
            lg the composition is open by design and the pills carry their own
            glass. */}
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 backdrop-blur-md transition-[opacity] duration-500 lg:hidden',
            // A gradient, not a flat tint. On /blog this field is 132px tall —
            // the row plus the search row — and a flat fill ended in a hard
            // horizontal edge straight across the photograph. Fading out at the
            // base gives the logo and the field their contrast without drawing a
            // line under themselves.
            onDark
              ? 'bg-gradient-to-b from-ink/70 via-ink/45 to-transparent'
              : 'bg-gradient-to-b from-cream/80 via-cream/55 to-transparent',
            // Hands over to the white bar below rather than tinting it.
            solid && 'opacity-0',
          )}
        />

        {/* The white bar. A second layer rather than a variant of the one above
            so it can cross-fade at every breakpoint: switching that one between
            `lg:hidden` and visible is a display change, which does not
            transition, and the bar would pop in on desktop. Kept mounted at
            opacity 0 for the same reason. */}
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 border-b border-ink/8 bg-white/95 shadow-[0_14px_34px_-26px_rgba(15,17,23,0.5)] backdrop-blur-xl transition-opacity duration-500',
            solid ? 'opacity-100' : 'opacity-0',
          )}
        />

        <div className="relative flex h-18 items-center justify-between px-5 md:px-8">
          {/* ---------------- Logo ---------------- */}
          <TransitionLink
            href="/"
            aria-label="Dr. Christeen Youssef — home"
            className="relative inline-flex shrink-0 transition-opacity duration-300 hover:opacity-80"
          >
            {/* Two files, crossfaded, rather than one recoloured with a filter.
                The wordmark has to change colour but the gold CY monogram must
                not, and no filter does one without the other. Both are stacked
                so the swap has nothing to lay out — the ink cut holds the box
                and the cream one sits over it. */}
            <Image
              src={logoInk}
              alt=""
              priority
              className={cn(
                'h-8 w-auto object-contain transition-opacity duration-500 md:h-10',
                onDark ? 'opacity-0' : 'opacity-100',
              )}
            />
            <Image
              src={logoCream}
              alt=""
              priority
              aria-hidden
              className={cn(
                'absolute inset-0 h-8 w-auto object-contain transition-opacity duration-500 md:h-10',
                onDark ? 'opacity-100' : 'opacity-0',
              )}
            />
          </TransitionLink>

          {/* ---------------- Right cluster ---------------- */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Only on /blog, where it filters the grid — see
                layout/blog-search-store.ts for how the term reaches the listing
                from outside its tree. Not wrapped in the motion.div below: that
                one animates out with `x`, and a field the reader may be mid-word
                in should not slide.
                
                lg and up only. Below that it gets the row underneath, because
                this row already carries the logo and the fixed menu pill's
                reserve and there is no width left for a third thing. */}
            <BlogSearchField
              onDark={onDark}
              hidden={menuOpen}
              className="hidden lg:flex lg:w-64 lg:focus-within:w-80 lg:transition-[width,background-color,border-color,box-shadow] xl:w-72"
            />

            {/* Fades out as the panel expands over it */}
            <motion.div
              initial={false}
              animate={{
                opacity: menuOpen ? 0 : 1,
                x: menuOpen ? 12 : 0,
              }}
              transition={{ duration: 0.45, ease: EASE }}
              className={cn('hidden sm:block', menuOpen && 'pointer-events-none')}
            >
              {/* Moved into CtaPill so the page-level CTAs are the same
                  component, not a second copy of the same hover choreography. */}
              <CtaPill
                href="/reach-me"
                label="Let's talk"
                tabIndex={menuOpen ? -1 : 0}
                onDark={onDark}
              />
            </motion.div>

            {/* Reserves the footprint of the closed menu pill, which is
                position-fixed so it can morph free of this flex row. */}
            <div aria-hidden className="h-12 w-[8.75rem] min-w-0" />
          </div>
        </div>

        {/* The blog search below lg, full width on a line of its own. The
            backdrop layers above are inset-0, so they cover this row too and it
            sits on the same field as the row it hangs from.
            
            Gated on the route rather than left to the field's own null return:
            off /blog this wrapper would still contribute its padding, and the
            header would be 12px taller on every page for nothing. */}
        {pathname === '/blog' && (
          <div className="relative px-5 pb-3 md:px-8 lg:hidden">
            <BlogSearchField
              onDark={onDark}
              hidden={menuOpen}
              className="w-full"
            />
          </div>
        )}
      </motion.header>

      <LiquidMenu open={menuOpen} onOpenChange={setMenuOpen} onDark={onDark} />
    </>
  );
}
