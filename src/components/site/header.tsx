import { useEffect, useRef, useState } from 'react';
import { Image } from '@/components/ui/image';
import { useLocation } from 'react-router';
import { TransitionLink } from '@/components/ui/transition-link';
import { Container } from '@/components/site/layout';
import { Button } from '@/components/site/button';
import { MobileMenu } from '@/components/site/mobile-menu';
import { navigationItems } from '@/data/navigation';
import { isActivePath } from '@/components/site/active-path';
import { cn } from '@/lib/utils';
import logoLight from '@/assets/logo-light.webp';

/** Past this many pixels the header takes its compact, solid state. */
const SCROLLED_AT = 40;

/**
 * Fixed to the top of every page. Over the opening band it is transparent and
 * 88px tall, exactly as the heroes are laid out for; once the page has moved
 * 40px it turns to a blurred ink bar 64px tall (no line under it), so the
 * same light type stays legible over cream and page sections too. Reads
 * window.scrollY once per frame and re-checks on every route.
 *
 * Sits above the page (z-100) but under the mobile menu (120), the lightbox
 * (110+) and the preloader (500).
 */
export function SiteHeader() {
  const pathname = useLocation().pathname;
  const [scrolled, setScrolled] = useState(false);
  const frame = useRef(0);

  // window.scrollY, at most once per frame, from a passive listener.
  useEffect(() => {
    const check = () => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        setScrolled(window.scrollY >= SCROLLED_AT);
      });
    };

    // The state on mount and after every route change — a page opened or
    // reloaded halfway down starts compact.
    check();
    window.addEventListener('scroll', check, { passive: true });
    return () => {
      window.removeEventListener('scroll', check);
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    };
  }, [pathname]);

  return (
    <header
      data-scrolled={scrolled ? 'true' : 'false'}
      // Both states come from the attribute. The colour is a literal rgba —
      // not an opacity modifier, which compiles to color-mix() and is dropped
      // (leaving the bar transparent) by browsers that lack it.
      className="group/header fixed inset-x-0 top-0 z-[100] bg-transparent pt-[env(safe-area-inset-top)] transition-[background-color,backdrop-filter,-webkit-backdrop-filter] duration-300 ease-out data-[scrolled=true]:bg-[rgba(23,21,15,0.85)] data-[scrolled=true]:backdrop-blur-[12px] data-[scrolled=true]:backdrop-saturate-[1.4]"
    >
      <Container className="flex h-[88px] items-center justify-between gap-5 transition-[height] duration-300 ease-out group-data-[scrolled=true]/header:h-16">
        <TransitionLink
          href="/"
          aria-label="Dr. Christeen Youssef — home"
          className="animate-fade-down shrink-0 rounded-sm"
        >
          <Image
            src={logoLight}
            alt=""
            priority
            sizes="160px"
            className="h-10 w-auto origin-left transition-transform duration-300 ease-out group-data-[scrolled=true]/header:scale-90"
          />
        </TransitionLink>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-[34px]">
            {navigationItems.map((item, index) => {
              const active = isActivePath(pathname, item.href);

              return (
                <li
                  key={item.href}
                  className="animate-fade-down"
                  style={{ animationDelay: `${140 + index * 70}ms` }}
                >
                  <TransitionLink
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'group relative inline-block py-2 type-nav transition-colors duration-300',
                      'text-white/72 hover-fine:text-white aria-[current=page]:text-white',
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className="absolute inset-x-0 bottom-0.5 h-px origin-left scale-x-0 bg-gold transition-transform duration-500 ease-[var(--ease-brand)] group-hover-fine:scale-x-100 group-aria-[current=page]:scale-x-100"
                    />
                  </TransitionLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div
          className="animate-fade-down hidden lg:block"
          style={{ animationDelay: '520ms' }}
        >
          <Button href="/reach-me" variant="gold" className="h-11">
            Book a consultation
          </Button>
        </div>

        <MobileMenu />
      </Container>
    </header>
  );
}
