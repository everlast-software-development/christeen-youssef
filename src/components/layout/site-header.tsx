'use client';

import { useState } from 'react';
import Image from 'next/image';
import { TransitionLink } from '@/components/ui/transition-link';
import { motion } from 'motion/react';
import { LiquidMenu } from '@/components/layout/liquid-menu';
import { TextReveal } from '@/components/ui/cascade-text';
import { ScrollProgress } from '@/components/layout/scroll-progress';
import { cn } from '@/lib/utils';
import logo from '@/assets/Dr.-CY-Logo-FINAL-023-scaled (1).webp';

const EASE = [0.22, 1, 0.36, 1] as const;

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <ScrollProgress />

      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div className="flex h-18 items-center justify-between px-5 md:px-8">
          {/* ---------------- Logo ---------------- */}
          <TransitionLink
            href="/"
            aria-label="Dr. Christeen Youssef — home"
            className="shrink-0 transition-opacity duration-300 hover:opacity-80"
          >
            <Image
              src={logo}
              alt=""
              priority
              className="h-8 w-auto object-contain md:h-10"
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
              <TransitionLink
                href="/reach-me"
                tabIndex={menuOpen ? -1 : 0}
                className={cn(
                  'group relative flex h-12 items-center overflow-hidden rounded-full px-6',
                  'group-hover:[--cascade:1] hover:[--cascade:1]',
                  'border border-ink/15 bg-white/40 backdrop-blur-md',
                  'font-body text-sm tracking-[0.14em] whitespace-nowrap text-ink uppercase',
                  'transition-colors duration-500',
                )}
              >
                {/* Gold fill sweeps up from the base on hover */}
                <span
                  aria-hidden
                  className="absolute inset-0 origin-bottom scale-y-0 bg-gradient-gold transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100"
                />
                <TextReveal text="Let's talk" className="relative" />
              </TransitionLink>
            </motion.div>

            {/* Reserves the footprint of the closed menu pill, which is
                position-fixed so it can morph free of this flex row. */}
            <div aria-hidden className="h-12 w-[8.75rem]" />
          </div>
        </div>
      </motion.header>

      <LiquidMenu open={menuOpen} onOpenChange={setMenuOpen} />
    </>
  );
}
