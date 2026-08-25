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
  /* Was a "My Gallery" dropdown over Before & After and Publications. With
     Publications gone it is a flat link: a menu that opens to reveal one item
     is a worse version of the item. */
  {
    label: 'Before & After',
    href: '/before-and-after'
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
