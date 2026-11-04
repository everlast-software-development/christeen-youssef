import { Link } from 'react-router';
import type { ComponentProps } from 'react';
import { usePageNavigation } from '@/components/site/preloader';

type TransitionLinkProps = Omit<ComponentProps<typeof Link>, 'to'> & {
  /** The destination — named `href` like every other link on the site. */
  href: string;
  /** Runs before the transition starts — e.g. closing the menu. */
  onBeforeNavigate?: () => void;
};

/**
 * A Link that routes through the short ink fade (see site/preloader.tsx).
 *
 * Still renders a real anchor, so middle-click and open-in-new-tab keep
 * working — modified clicks are handed back to the browser untouched.
 */
export function TransitionLink({
  href,
  onBeforeNavigate,
  onClick,
  ...props
}: TransitionLinkProps) {
  const { navigate } = usePageNavigation();

  return (
    <Link
      to={href}
      onClick={(event) => {
        onClick?.(event);

        // Let the browser handle new-tab / new-window / download intents.
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }

        event.preventDefault();
        onBeforeNavigate?.();
        navigate(href);
      }}
      {...props}
    />
  );
}
