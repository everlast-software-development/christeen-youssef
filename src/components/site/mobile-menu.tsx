import { useState } from 'react';
import { Image } from '@/components/ui/image';
import { useLocation } from 'react-router';
import { Dialog } from '@base-ui/react/dialog';
import { Clock, Phone, X } from 'lucide-react';
import { TransitionLink } from '@/components/ui/transition-link';
import { Button } from '@/components/site/button';
import { isActivePath } from '@/components/site/active-path';
import { navigationItems } from '@/data/navigation';
import { schedule } from '@/data/schedule';
import { cn } from '@/lib/utils';
import logoLight from '@/assets/logo-light.webp';

const TEL = `tel:${schedule.phone.replace(/\s+/g, '')}`;
const HOURS = `${schedule.workingDays[0]} – ${
  schedule.workingDays[schedule.workingDays.length - 1]
} · ${schedule.hours}`;

/**
 * Full-screen ink overlay that wipes down from the top (clip-path), with the
 * links staggering in behind it. Base UI's Dialog supplies the focus trap,
 * Escape, scroll lock and focus return; the wipe is a CSS transition keyed to
 * its data-starting-style / data-ending-style, so reduced motion (which zeroes
 * every transition) simply makes it appear.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = useLocation().pathname;

  const close = () => setOpen(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        aria-label="Open menu"
        className={cn(
          'animate-fade-down flex size-[46px] items-center justify-center rounded-full border transition-colors duration-300 lg:hidden',
          'border-white/30 text-white hover-fine:border-white',
        )}
      >
        {/* Two lines, the lower one shorter and set right, as in the reference. */}
        <span aria-hidden className="flex flex-col gap-[5px]">
          <span className="block h-[1.5px] w-[18px] bg-current" />
          <span className="ml-1.5 block h-[1.5px] w-3 bg-current" />
        </span>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Popup
          className={cn(
            'group/menu fixed inset-0 z-[120] flex flex-col overflow-y-auto bg-ink pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] text-white',
            '[clip-path:inset(0_0_0_0)] transition-[clip-path] duration-700 ease-[var(--ease-brand)]',
            'data-[starting-style]:[clip-path:inset(0_0_100%_0)] data-[ending-style]:[clip-path:inset(0_0_100%_0)] data-[ending-style]:duration-500',
          )}
        >
          <Dialog.Title className="sr-only">Site menu</Dialog.Title>

          {/* Warm glow, the same device as the hero. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[60%]"
            style={{
              background:
                'radial-gradient(60% 60% at 50% 0%, rgba(184,137,42,0.22), transparent 70%)',
            }}
          />

          <div className="container-site relative flex h-[88px] shrink-0 items-center justify-between">
            <Image src={logoLight} alt="" sizes="160px" className="h-10 w-auto" />
            <Dialog.Close
              aria-label="Close menu"
              className="flex size-[46px] items-center justify-center rounded-full border border-white/30 text-white transition-colors hover-fine:border-white"
            >
              <X aria-hidden strokeWidth={1.6} className="size-5" />
            </Dialog.Close>
          </div>

          <nav
            aria-label="Primary"
            className="container-site relative flex flex-1 flex-col justify-center py-10"
          >
            <ol className="flex flex-col gap-2">
              {navigationItems.map((item, index) => {
                const active = isActivePath(pathname, item.href);

                return (
                  <li
                    key={item.href}
                    className="transition-[transform,opacity] duration-700 ease-[var(--ease-brand)] group-data-[starting-style]/menu:translate-y-8 group-data-[starting-style]/menu:opacity-0"
                    style={{ transitionDelay: `${180 + index * 70}ms` }}
                  >
                    <TransitionLink
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      onBeforeNavigate={close}
                      onClick={() => {
                        if (active) close();
                      }}
                      className="group flex items-baseline gap-5 border-b border-white/12 py-4"
                    >
                      <span className="type-eyebrow w-6 text-gold">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span
                        className={cn(
                          'font-display text-[clamp(36px,9vw,52px)] leading-none transition-colors',
                          active ? 'text-white' : 'text-white/80 hover-fine:text-white',
                        )}
                      >
                        {item.label}
                      </span>
                    </TransitionLink>
                  </li>
                );
              })}
            </ol>
          </nav>

          <div
            className="container-site relative shrink-0 pb-10 transition-[transform,opacity] duration-700 ease-[var(--ease-brand)] group-data-[starting-style]/menu:translate-y-6 group-data-[starting-style]/menu:opacity-0"
            style={{ transitionDelay: '560ms' }}
          >
            <div onClickCapture={close}>
              <Button href="/reach-me" variant="gold" className="w-full sm:w-auto">
                Book a consultation
              </Button>
            </div>

            <ul className="mt-8 flex flex-col gap-3 text-[14.5px] text-white/75 sm:flex-row sm:gap-8">
              <li className="flex items-center gap-3">
                <Phone aria-hidden strokeWidth={1.6} className="size-4 text-gold-light" />
                <a href={TEL} className="hover-fine:text-white">
                  {schedule.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock aria-hidden strokeWidth={1.6} className="size-4 text-gold-light" />
                {HOURS}
              </li>
            </ul>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
