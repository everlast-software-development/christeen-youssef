import type { NavItem } from '../types';

export const navigationItems: NavItem[] = [
  {
    label: 'Home',
    href: '/'
  },
  {
    label: 'About Me',
    href: '/about-me'
  },
  {
    label: 'My Gallery',
    href: '#',
    children: [
      {
        label: 'Before & After',
        href: '/before-and-after'
      },
      {
        label: 'Publications',
        href: '/publications'
      }
    ]
  },
  /* Case Study and Testimonials removed from primary navigation at user's request */
  {
    label: 'Blog',
    href: '/blog'
  },
  {
    label: 'Reach Me',
    href: '/reach-me'
  }
];
