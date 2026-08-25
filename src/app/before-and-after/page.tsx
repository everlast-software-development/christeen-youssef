import type { Metadata } from 'next';
import { RoutePlaceholder } from '@/components/dev/route-placeholder';

export const metadata: Metadata = {
  title: 'Before & After',
  description:
    'Documented patient results across aesthetic dermatology, scar revision and regenerative treatments.',
};

export default function Page() {
  return <RoutePlaceholder title="Before & After" route="/before-and-after" />;
}
