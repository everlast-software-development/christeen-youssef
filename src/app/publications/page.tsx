import type { Metadata } from 'next';
import { RoutePlaceholder } from '@/components/dev/route-placeholder';

export const metadata: Metadata = {
  title: 'Publications',
  description: 'Peer-reviewed research, conference presentations and published work by Dr. Christeen Youssef.',
};

export default function Page() {
  return <RoutePlaceholder title="Publications" route="/publications" />;
}
