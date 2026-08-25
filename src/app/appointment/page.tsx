import type { Metadata } from 'next';
import { RoutePlaceholder } from '@/components/dev/route-placeholder';

export const metadata: Metadata = {
  title: 'Book an Appointment',
  description: 'Request a consultation with Dr. Christeen Youssef in Abu Dhabi.',
};

export default function Page() {
  return <RoutePlaceholder title="Book an Appointment" route="/appointment" />;
}
