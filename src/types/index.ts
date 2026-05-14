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
  icon?: string;
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
  image: string;
  content?: string;
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
  platform: string;
  url: string;
  icon: string;
}
