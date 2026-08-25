import type { StaticImageData } from 'next/image';
import type { LucideIcon } from 'lucide-react';
import type { SocialPlatform } from '@/components/icons/social-icon';

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface Service {
  id: string;
  icon: string; // React Icon component name
  title: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  date?: string;
  content: string;
  rating?: number;
}

export interface Stat {
  label: string;
  value: number;
  suffix?: string;
  icon?: LucideIcon;
}

export interface CareerEntry {
  id: string;
  title: string;
  organisation: string;
  period: string;
  description: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  image: StaticImageData;
  content?: string;
  /**
   * Extra artwork shown as a strip inside the article. These used to be written
   * into `content` as `![alt](${imported})` — inside a template literal that
   * interpolated the imported object, so the src rendered as "[object Object]"
   * and the images never appeared. A real field cannot fail that way.
   */
  gallery?: StaticImageData[];
}

export interface ScheduleInfo {
  clinicName: string;
  role: string;
  address: string;
  workingDays: string[];
  hours: string;
  phone: string;
}

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
}
