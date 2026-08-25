import { TransitionLink } from '@/components/ui/transition-link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-cream px-6 text-center">
      <div>
        <p className="font-display text-display-lg text-gradient-gold">404</p>
        <h1 className="mt-4 font-display text-display-sm text-ink">
          Page not found
        </h1>
        <p className="mt-3 font-body text-slate">
          The page you are looking for has moved or no longer exists.
        </p>
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
