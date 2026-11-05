import type { IconType } from 'react-icons';
import { FaLinkedinIn } from 'react-icons/fa6';
import {
  SiFacebook,
  SiInstagram,
  SiSnapchat,
  SiTiktok,
  SiWhatsapp,
  SiYoutube,
} from 'react-icons/si';
import { socialLinks } from '@/data/socials';
import type { SocialPlatform } from '@/types';
import { cn } from '@/lib/utils';

// Simple Icons dropped the LinkedIn mark at LinkedIn's request, so that one
// glyph comes from Font Awesome's brand set instead.
const ICONS: Record<SocialPlatform, IconType> = {
  Instagram: SiInstagram,
  Facebook: SiFacebook,
  LinkedIn: FaLinkedinIn,
  TikTok: SiTiktok,
  YouTube: SiYoutube,
  WhatsApp: SiWhatsapp,
  Snapchat: SiSnapchat,
};

const ORDER: SocialPlatform[] = [
  'Instagram',
  'Facebook',
  'LinkedIn',
  'TikTok',
  'YouTube',
  'WhatsApp',
  'Snapchat',
];

/** Every social link on the site: name, href and icon, in display order. */
export const SOCIALS = ORDER.flatMap((name) => {
  const link = socialLinks.find((entry) => entry.platform === name);
  return link ? [{ name, href: link.url, icon: ICONS[name] }] : [];
});

export const SOCIAL_TONE = {
  light: 'border-line text-ink',
  dark: 'border-white/13 text-cream',
} as const;

/** One round icon button: the footer's social links and an article's share row. */
export const SOCIAL_BUTTON = cn(
  'tap-target relative flex size-10 cursor-pointer items-center justify-center rounded-full border bg-transparent transition-colors duration-200',
  'hover-fine:border-gold-deep hover-fine:bg-gold-deep hover-fine:text-white',
  'focus-visible:border-gold-deep focus-visible:bg-gold-deep focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
);

/**
 * The row of social links used everywhere: 40px outlined circles with the
 * brand glyph at 16px, filling gold-deep with a white glyph on hover or
 * keyboard focus. `tone` matches the surface they sit on.
 */
export function SocialLinks({
  tone = 'light',
  className,
}: {
  tone?: keyof typeof SOCIAL_TONE;
  className?: string;
}) {
  return (
    <ul className={cn('m-0 flex list-none flex-wrap gap-2.5 p-0', className)}>
      {SOCIALS.map(({ name, href, icon: Icon }) => (
        <li key={name}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Dr. Christeen Youssef on ${name}`}
            className={cn(SOCIAL_BUTTON, SOCIAL_TONE[tone])}
          >
            <Icon aria-hidden focusable="false" className="size-4" />
          </a>
        </li>
      ))}
    </ul>
  );
}
