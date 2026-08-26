'use client';

import { useState } from 'react';
import Image from 'next/image';
import { TransitionLink } from '@/components/ui/transition-link';
import { motion } from 'motion/react';
import { LiquidMenu } from '@/components/layout/liquid-menu';
import { CtaPill } from '@/components/ui/cta-pill';
import { ScrollProgress } from '@/components/layout/scroll-progress';
import { cn } from '@/lib/utils';
import { usePageTransition } from '@/components/providers/page-transition';
import { useHeaderSurface } from '@/components/layout/use-header-surface';
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
  const onDark = useHeaderSurface(menuOpen, phase);

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
            'pointer-events-none absolute inset-0 backdrop-blur-md transition-colors duration-500 lg:hidden',
            onDark ? 'bg-ink/45' : 'bg-cream/55',
          )}
        />

        <div className="relative flex h-18 items-center justify-between px-5 md:px-8">
          {/* ---------------- Logo ---------------- */}
          <TransitionLink
            href="/"
            aria-label="Dr. Christeen Youssef — home"
            className="relative shrink-0 transition-opacity duration-300 hover:opacity-80"
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
            <div aria-hidden className="h-12 w-[8.75rem]" />
          </div>
        </div>
      </motion.header>

      <LiquidMenu open={menuOpen} onOpenChange={setMenuOpen} onDark={onDark} />
    </>
  );
}
