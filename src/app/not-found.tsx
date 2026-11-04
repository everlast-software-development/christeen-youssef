import { Button } from '@/components/site/button';
import { Eyebrow } from '@/components/site/layout';

export default function NotFound() {
  return (
    <main
      id="content"
      data-tone="ink"
      className="relative flex min-h-svh items-center justify-center overflow-hidden bg-ink px-6 pt-24 text-center text-white"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(55% 60% at 50% 0%, rgba(184,137,42,0.24), transparent 70%)',
        }}
      />
      <div className="relative">
        <Eyebrow onDark>404</Eyebrow>
        <h1 className="mt-5 type-h1 text-white">Page not found</h1>
        <p className="mx-auto mt-6 max-w-[30rem] type-body text-white/70">
          The page you are looking for has moved or no longer exists.
        </p>
        <div className="mt-10">
          <Button href="/" variant="gold">
            Back home
          </Button>
        </div>
      </div>
    </main>
  );
}
