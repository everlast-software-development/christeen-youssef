import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Check, Link2 } from 'lucide-react';
import { FaLinkedinIn } from 'react-icons/fa6';
import { SiFacebook, SiWhatsapp } from 'react-icons/si';
import { SOCIAL_BUTTON, SOCIAL_TONE } from '@/components/site/social-links';
import { SITE_URL } from '@/lib/site';
import { cn } from '@/lib/utils';

const noSubscribe = () => () => {};

/**
 * The article's address. The prerender has no window, so it writes SITE_URL;
 * in the browser it is the origin actually being read, without a hydration
 * mismatch (useSyncExternalStore hydrates with the server value, then updates).
 */
function useShareUrl(path: string) {
  const origin = useSyncExternalStore(
    noSubscribe,
    () => window.location.origin,
    () => SITE_URL,
  );
  return `${origin}${path}`;
}

/**
 * Copy link, WhatsApp, LinkedIn and Facebook as the footer's round social
 * buttons. `rail` stacks them for the sticky column beside the article; the
 * default is the row at its end. Copying shows a "Copied" toast beside the
 * button (and announces it).
 */
export function ArticleShare({
  path,
  title,
  layout = 'row',
  className,
}: {
  path: string;
  title: string;
  layout?: 'row' | 'rail';
  className?: string;
}) {
  const url = useShareUrl(path);
  const [copied, setCopied] = useState(false);
  const timer = useRef<number>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // No clipboard permission (or an old browser): select-and-copy fallback.
      const field = document.createElement('textarea');
      field.value = url;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.append(field);
      field.select();
      document.execCommand('copy');
      field.remove();
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  };

  const encoded = encodeURIComponent(url);
  const links = [
    { name: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`, icon: SiWhatsapp },
    { name: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`, icon: FaLinkedinIn },
    { name: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`, icon: SiFacebook },
  ];

  const button = cn(SOCIAL_BUTTON, SOCIAL_TONE.light);
  const rail = layout === 'rail';

  return (
    <div className={cn('flex items-center gap-4', rail && 'flex-col items-start', className)}>
      <p className="m-0 type-eyebrow text-caption-strong">Share</p>
      <ul className={cn('m-0 flex list-none gap-2.5 p-0', rail && 'flex-col')}>
        <li className="relative">
          <button type="button" onClick={copy} aria-label="Copy link to this article" className={button}>
            {copied ? <Check aria-hidden className="size-4" /> : <Link2 aria-hidden className="size-4" />}
          </button>
          <span
            role="status"
            className={cn(
              'pointer-events-none absolute top-1/2 left-[calc(100%+10px)] -translate-y-1/2 rounded-full bg-ink px-3 py-1.5 type-small whitespace-nowrap text-white transition-opacity duration-200',
              !rail && 'top-auto bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 translate-y-0',
              copied ? 'opacity-100' : 'opacity-0',
            )}
          >
            {copied ? 'Copied' : ''}
          </span>
        </li>
        {links.map(({ name, href, icon: Icon }) => (
          <li key={name}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Share on ${name}`}
              className={button}
            >
              <Icon aria-hidden focusable="false" className="size-4" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
