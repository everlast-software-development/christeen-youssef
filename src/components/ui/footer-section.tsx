'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { usePathname } from 'next/navigation';
import type { ComponentProps, ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { TransitionLink } from '@/components/ui/transition-link';
import { SocialIcon, type SocialPlatform } from '@/components/icons/social-icon';
import { socialLinks } from '@/data/socials';
import { schedule } from '@/data/schedule';
import logo from '@/assets/logo-light.webp';

type FooterLink = {
  title: string;
  href: string;
  /**
   * Set on the social column only. The upstream component reached for
   * `FacebookIcon` and friends from lucide-react — those do not exist here:
   * Lucide 1.x dropped every brand icon, which is exactly why
   * components/icons/social-icon.tsx exists. They are not missing imports,
   * they resolve to `undefined`, so `link.icon && …` would have silently
   * rendered a social column with no marks at all.
   */
  platform?: SocialPlatform;
};

type FooterSection = {
  label: string;
  links: FooterLink[];
};

/**
 * Routes whose last section is dark, where the backdrop below is ink instead of
 * cream.
 *
 * It must stay opaque either way. Transparent was the obvious idea — let the
 * page's own background show through — and it is wrong: a page painting its
 * backdrop on a negative-z-index layer loses to this strip, because negative
 * z-index children paint *below* in-flow block backgrounds, not above them. The
 * strip fell through to the document's white instead, which is visible as a band
 * wherever the panel is still offset by its reveal.
 *
 * A route list rather than a prop because the footer is mounted once in the root
 * layout, which is a server component and cannot read the pathname.
 */
const DARK_BACKDROP_ROUTES = new Set(['/reach-me']);

/** Digits only — `tel:` will not dial through the spaces in the source data. */
const TEL = `tel:${schedule.phone.replace(/\s+/g, '')}`;

/** Derived from the one address in the data, so the two can never disagree. */
const DIRECTIONS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  schedule.address,
)}`;

// The upstream Product / Company / Resources columns were demo content for a
// SaaS marketing page — none of those routes exist here. These are the real
// ones, read off data/navigation.ts and the app directory.
const footerLinks: FooterSection[] = [
  {
    label: 'Explore',
    links: [
      { title: 'Home', href: '/' },
      { title: 'About Me', href: '/about-me' },
      { title: 'Before & After', href: '/before-and-after' },
      { title: 'Blog', href: '/blog' },
      { title: 'Reach Me', href: '/reach-me' },
    ],
  },
  {
    label: 'Visit',
    links: [
      { title: 'Book an Appointment', href: '/reach-me' },
      { title: schedule.phone, href: TEL },
      { title: 'Directions', href: DIRECTIONS },
    ],
  },
  {
    label: 'Follow',
    links: socialLinks.map((social) => ({
      title: social.platform,
      href: social.url,
      platform: social.platform,
    })),
  },
];

/**
 * Internal routes go through the ink curtain like every other link on the site;
 * `tel:` and off-site URLs are handed to the browser.
 */
function FooterAnchor({ link }: { link: FooterLink }) {
  const className =
    'inline-flex items-center gap-2.5 text-cream/65 transition-colors duration-300 hover:text-cream';

  const label = (
    <>
      {link.platform && <SocialIcon platform={link.platform} className="size-[1.15em]" />}
      {link.title}
    </>
  );

  if (link.href.startsWith('/')) {
    return (
      <TransitionLink href={link.href} className={className}>
        {label}
      </TransitionLink>
    );
  }

  const offsite = link.href.startsWith('http');

  return (
    <a
      href={link.href}
      className={className}
      target={offsite ? '_blank' : undefined}
      rel={offsite ? 'noopener noreferrer' : undefined}
    >
      {label}
    </a>
  );
}

export function Footer() {
  const revealRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  // Lenis drives real window scroll, so Motion's useScroll reads it without a
  // bridge — the same arrangement as the rail in the Principles section.
  //
  // The offsets scope the reveal to the footer's own arrival: progress 0 is the
  // moment its top edge reaches the bottom of the screen, progress 1 the moment
  // its bottom edge does, which is the end of the document. So the panel is
  // always exactly home by the time the page stops scrolling — there is no
  // window where it has finished early and sits there, or has not finished at
  // all and leaves a band of cream under it.
  const { scrollYProgress } = useScroll({
    target: revealRef,
    offset: ['start end', 'end end'],
  });

  // Held down a quarter of its own height and released as you scroll, so the
  // panel rises into place rather than arriving with the page. A percentage of
  // itself, not a pixel figure: the footer is a different height at every
  // breakpoint and the travel should scale with it.
  //
  // Reduced motion collapses the range to nothing rather than skipping the
  // hook — hooks cannot be called conditionally, and a flat 0%→0% transform is
  // free.
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [shouldReduceMotion ? '0%' : '25%', '0%'],
  );

  return (
    // The backdrop is what the panel uncovers as it rises, and once it is home
    // only the two rounded top corners still show it. It has to be here at all
    // because the footer sits outside <main>, where the document background is
    // white — without it the corners, and the reveal offset above them, cut
    // straight to white.
    <div
      ref={revealRef}
      className={
        DARK_BACKDROP_ROUTES.has(pathname)
          ? 'relative z-20 w-full bg-ink'
          : 'relative z-20 w-full bg-cream'
      }
    >
      {/* Full-bleed: the ink runs edge to edge like every other section, with
          the gutters and the inner measure below holding the content. The
          corners are rounded only at the top — the panel runs flush to the
          bottom of the document, so there is nothing down there to round
          against. overflow-hidden is load-bearing here: without it the bloom
          layer below squares the corners straight back off. */}
      <motion.footer
        style={{ y }}
        // The panel is ink on every route; the strip behind it is not, which is
        // why the marker sits here rather than on the wrapper.
        data-header-surface="dark"
        className="relative w-full overflow-hidden rounded-t-4xl border-t border-cream/10 bg-ink px-5 py-20 text-cream md:px-8 lg:rounded-t-[3rem] lg:px-12 lg:py-28 xl:px-20"
      >
        {/* Upstream this was `theme(backgroundColor.white/8%)`, which is
            Tailwind v3 syntax — v4 dropped the dot-path `theme()` function, so
            it would have resolved to nothing. Rewritten as a plain rgba in
            gold, matching the bloom every other section on this page uses. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(35%_128px_at_50%_0%,rgba(201,153,40,0.12),transparent)]"
        />

        {/* The soft catch of light along the top edge. */}
        <div
          aria-hidden
          className="absolute top-0 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/40 blur"
        />

        {/* Wider than the max-w-7xl every other section uses, on purpose: a
            footer is a directory rather than a column of prose, so it takes a
            longer measure without becoming hard to read. */}
        <div className="relative mx-auto grid w-full max-w-[100rem] gap-10 xl:grid-cols-3 xl:gap-16">
          <AnimatedContainer className="space-y-5">
            <Image
              src={logo}
              alt="Dr. Christeen Youssef"
              className="h-11 w-auto lg:h-14"
              sizes="320px"
            />

            <div className="space-y-1.5 font-body text-base text-cream/60">
              <p className="text-cream/75">{schedule.clinicName}</p>
              <p>{schedule.address}</p>
              <p>
                {schedule.workingDays[0]} &ndash;{' '}
                {schedule.workingDays[schedule.workingDays.length - 1]} &middot;{' '}
                {schedule.hours}
              </p>
            </div>

            <p className="font-body text-[0.95rem] text-cream/45">
              &copy; {new Date().getFullYear()} Dr. Christeen Youssef. All rights
              reserved.
            </p>
          </AnimatedContainer>

          <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-3 xl:col-span-2 xl:mt-0">
            {footerLinks.map((section, index) => (
              <AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
                <div className="mb-10 md:mb-0">
                  <h3 className="font-body text-[0.8rem] tracking-[0.22em] text-gold uppercase">
                    {section.label}
                  </h3>

                  <ul className="mt-6 space-y-3.5 font-body text-base">
                    {section.links.map((link) => (
                      <li key={link.title}>
                        <FooterAnchor link={link} />
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedContainer>
            ))}
          </div>
        </div>
      </motion.footer>
    </div>
  );
}

type ViewAnimationProps = {
  delay?: number;
  className?: ComponentProps<typeof motion.div>['className'];
  children: ReactNode;
};

function AnimatedContainer({
  className,
  delay = 0.1,
  children,
}: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    // A plain div, not bare `children`. Upstream returned the children alone,
    // which drops `className` — and with it the brand column's `space-y-5`, so
    // that column collapsed into an unspaced block for exactly the users who
    // had asked for less movement, not less layout.
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
      whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
