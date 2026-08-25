import { TransitionLink } from '@/components/ui/transition-link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Temporary scaffold for routes not yet rebuilt. Also doubles as a smoke test
 * that fonts, brand tokens, shadcn and Lucide are all wired correctly.
 */
export function RoutePlaceholder({
  title,
  route,
  note,
}: {
  title: string;
  route: string;
  note?: string;
}) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-cream px-6">
      <div className="container-brand max-w-2xl text-center">
        <p className="font-body text-xs tracking-[0.25em] text-gold uppercase">
          Pending rebuild
        </p>

        <h1 className="mt-6 font-display text-display-md text-ink">{title}</h1>

        <p className="mt-4 font-body text-slate">
          {note ?? 'This route is scaffolded. Content and motion come next.'}
        </p>

        <code className="mt-6 inline-block rounded-md bg-cream-dark px-3 py-1.5 font-mono text-sm text-ink-soft">
          {route}
        </code>

        <div className="mt-10">
          <Button nativeButton={false} render={<TransitionLink href="/" />}>
            <ArrowLeft />
            Back home
          </Button>
        </div>
      </div>
    </main>
  );
}
