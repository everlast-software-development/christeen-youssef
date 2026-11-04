/** Whether a nav item is the current page. Home matches exactly; the rest by
 *  prefix, so an article keeps Blog lit. */
export function isActivePath(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}
