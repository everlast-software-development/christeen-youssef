# Dr. Christeen Youssef

Aesthetic dermatology & wellness practice site — Abu Dhabi, UAE.

## Stack

| Layer         | Choice                                                        |
| ------------- | ------------------------------------------------------------- |
| App           | React 19 SPA, built with Vite 8                               |
| Routing       | React Router 7                                                |
| Prerendering  | Every route rendered to static HTML at build time (`scripts/prerender.ts`) |
| Head / SEO    | react-helmet-async (React 19 hoisting), BreadcrumbList JSON-LD, sitemap.xml, robots.txt |
| Styling       | Tailwind CSS v4 (`@tailwindcss/vite`, CSS-first config)       |
| Components    | shadcn/ui (`base-nova` style, on Base UI)                     |
| Images        | vite-imagetools: AVIF + WebP srcsets and blur placeholders    |
| Fonts         | Fontsource — Cormorant Garamond 500 / 500 italic, Manrope (variable) |
| UI motion     | Motion                                                        |
| Scroll FX     | GSAP + ScrollTrigger                                          |
| Smooth scroll | Lenis (driven by GSAP's ticker)                               |
| Icons         | Lucide, react-icons (social marks)                            |
| Forms         | react-hook-form + Zod                                         |
| Server        | Express 5: `/api/contact` (Nodemailer, rate-limited), `/api/country`, static hosting |

## Getting started

```bash
npm install
cp .env.example .env         # then fill in SMTP credentials
npm run dev                  # http://localhost:3000 — app + API, hot reload
```

In development Vite renders the app in the browser; the production build
serves prerendered HTML that React hydrates. Check the real thing with
`npm run preview` (build, then start).

## Scripts

| Script              | Purpose                                                          |
| ------------------- | ---------------------------------------------------------------- |
| `npm run dev`       | Express + Vite dev middleware (app and API on one port)          |
| `npm run build`     | Client build → SSR build → prerender every route to `dist/client` |
| `npm start`         | Express serving `dist/client` and the API (`PORT`, default 3000) |
| `npm run preview`   | `build` then `start`                                             |
| `npm run lint`      | ESLint (typescript-eslint + react-hooks)                         |
| `npm run typecheck` | `tsc --noEmit` (app, server and scripts)                         |

## Layout

```
index.html            # HTML shell: boot scripts, <!--app-head--> / <!--app-html--> slots
vite.config.ts        # Vite, Tailwind, imagetools (the `asset` image format)
src/
├── main.tsx          # browser entry: hydrates prerendered HTML
├── entry-server.tsx  # render(url) + the list of routes to prerender
├── App.tsx           # chrome (header, footer, preloader) + routes + legacy redirects
├── pages/            # one component per route (home, about, blog, blog-post, …)
├── components/
│   ├── ui/           # shadcn primitives + Image (next/image replacement)
│   ├── providers/    # SmoothScroll (Lenis + GSAP bridge), ScrollMotion
│   ├── site/         # design system: layout, buttons, header, footer, Seo, cards
├── data/             # content: blog, services, testimonials, schedule…
├── lib/              # gsap registry, email template, cn()
├── styles/globals.css
└── types/
server/               # Express: index (static + redirects + scanner block), contact, country
scripts/prerender.ts  # static HTML per route, 404.html, sitemap.xml, robots.txt
_legacy/              # pre-redesign components, reference only
```

Adding a page: create it in `src/pages/`, give it a `<Seo path=… />`, add the
`<Route>` in `App.tsx` and its URL to `ROUTES` in `entry-server.tsx` (blog
posts are picked up from `src/data/blog.ts` automatically).

### Design tokens

Brand values live in `src/styles/globals.css` as CSS variables, exposed to
Tailwind through `@theme inline` — so `bg-page`, `bg-cream`, `text-ink`,
`text-soft`, `border-line`, `text-gold`, `font-display` and `container-site`
are real utilities.

| Token            | Value                   | Use                                   |
| ---------------- | ----------------------- | ------------------------------------- |
| Page             | `#ECE6DC`               | Main background                       |
| Cream            | `#F7F3ED`               | Light sections, cards                 |
| Ink              | `#17150F`               | Dark sections, primary text on light  |
| Text / Soft      | `#1E1B16` / `#55504A`   | Headings / body                       |
| Muted            | `#857E74`               | Hairline icons, decoration            |
| Muted text       | `#6A655D`               | Small captions & eyebrows on light    |
| Line             | `#E2DBD0`               | Hairlines on light (dark: white 13%)  |
| Gold / Gold lt   | `#B8892A` / `#D9B566`   | Accents without text: numbers on dark, hairlines, icons, progress bars, glows |
| Gold deep        | `#96701F` (hover `#84621B`) | Every gold surface with text on it   |
| Gold text        | `#81601D`               | Small gold text on light              |
| Eyebrow on dark  | `#C9B98F`               |                                       |
| Khaki            | `#A79E8C`               |                                       |

Muted and gold are under 4.5:1 on the light surfaces, so small type on light
uses the two "text" shades instead.

Any gold surface that carries text — the primary button, the featured award
card, avatars, chips, checked boxes, the rotating badge, the skip link — is
`bg-gold-deep` with white text and white icons (4.5:1, AA for small text);
secondary text inside it is `text-white/80`. The brighter `#B8892A` /
`#D9B566` stay for accents that carry no text.

Type is Cormorant Garamond 500 / 500 italic (display) and Manrope (body), self-hosted
with Fontsource; the latin cuts are preloaded in the prerendered HTML.

#### Type scale

One utility per text role (`src/styles/globals.css`, values from the home page).
Each sets family, size, line-height and tracking; colour is applied per
surface, and body roles leave weight free so `font-medium` / `font-semibold`
still layer on top.

| Utility           | Family    | Size                       | Weight | Line-height | Tracking / case     | Used for                         |
| ----------------- | --------- | -------------------------- | ------ | ----------- | ------------------- | -------------------------------- |
| `type-display`    | Cormorant | clamp(50px, 6.6vw, 104px)  | 500    | 0.98        | −0.01em             | Home hero headline               |
| `type-h1`         | Cormorant | clamp(3rem, 6.5vw, 5.5rem) | 500    | 1.02        | −0.01em             | Inner-page hero title (PageHero) |
| `type-h2`         | Cormorant | clamp(34px, 3.4vw, 50px)   | 500    | 1.08        | —                   | Section headings                 |
| `type-h3`         | Cormorant | 22px                       | 500    | 1.15        | —                   | Card and list titles             |
| `type-eyebrow`    | Manrope   | 12px                       | 600    | 1.4         | 0.18em, uppercase   | Eyebrows, breadcrumb, meta       |
| `type-lead`       | Manrope   | 17px                       | —      | 1.7         | —                   | Hero intro, article prose        |
| `type-body`       | Manrope   | 15.5px                     | —      | 1.75        | —                   | Paragraphs, form inputs          |
| `type-small`      | Manrope   | 13.5px                     | —      | 1.5         | —                   | Captions, labels, meta           |
| `type-stat`       | Cormorant | clamp(34px, 3vw, 46px)     | 500    | 1           | —                   | Stat numbers                     |
| `type-stat-label` | Manrope   | 13.5px                     | —      | 1.5         | —                   | Stat labels                      |
| `type-quote`      | Cormorant | clamp(22px, 2vw, 28px)     | 500    | 1.35        | —                   | Quotes and pull statements       |
| `type-nav`        | Manrope   | 14.5px                     | 500    | inherit     | —                   | Header and footer links          |
| `type-button`     | Manrope   | 14.5px                     | 600    | inherit     | —                   | Button and link labels           |

Form inputs use `type-body` but stay at 16px below `md`, so iOS does not zoom
into them.
Shared building blocks live in `src/components/site/` (layout primitives,
`Button` — whose shape and arrow defaults are set once in `BUTTON_DEFAULTS` —
header, footer, carousel, cards, CTA band). Scroll motion is declared with
`data-reveal*` attributes and run from `providers/scroll-motion.tsx`; it only
ever moves content, never hides it.

## Notes

- `_legacy/` is excluded from `tsconfig.json` and ESLint. It is kept only as a
  markup and copy reference during the rebuild, and does not compile.
- Images: import a photo from `src/assets` as usual
  (`import x from '@/assets/a.webp'`) and pass it to `<Image>` — the build cuts it
  to AVIF + WebP widths up to the original and adds a blur placeholder.
- Old URLs (`/gallery`, `/publications`, `/appointment`, `/blogs/:slug`) answer
  301 from Express; trailing slashes redirect to the canonical URL; scanner
  probes (`/wp-login.php`, `.env`, …) get a 9-byte 404.
- `/api/contact` allows 5 messages per visitor per 15 minutes,
  `/api/country` 30 lookups per minute.

## Deployment (Railway)

Railway runs `npm ci --include=dev && npm run build`, then `npm start`
(`railway.json`, `nixpacks.toml`). Express listens on `$PORT` and serves the
prerendered `dist/client` with the API on the same origin.

Environment variables (see `.env.example`): `EMAIL_HOST`, `EMAIL_PORT`,
`EMAIL_SECURE`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_TO` — unchanged from the
Next.js version.
