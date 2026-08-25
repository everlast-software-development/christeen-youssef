import { Award, Clock, Users } from 'lucide-react';
import type { Stat } from '@/types';

export const stats: Stat[] = [
  {
    label: 'Patients Transformed',
    value: 22,
    suffix: 'K+',
    icon: Users,
  },
  {
    label: 'Industry Awards',
    value: 20,
    suffix: '+',
    icon: Award,
  },
  {
    label: 'Years Experience',
    value: 12,
    suffix: '+',
    icon: Clock,
  },
];
