# Dr. Christeen Youssef

Aesthetic dermatology & wellness practice site — Abu Dhabi, UAE.

## Stack

| Layer      | Choice                                     |
| ---------- | ------------------------------------------ |
| Framework  | Next.js 16 (App Router, Turbopack)         |
| Styling    | Tailwind CSS v4 (CSS-first config)         |
| Components | shadcn/ui (`base-nova` style, on Base UI)  |
| UI motion  | Motion                                     |
| Scroll FX  | GSAP + ScrollTrigger                       |
| Smooth scroll | Lenis (driven by GSAP's ticker)         |
| Icons      | Lucide                                     |
| Forms      | react-hook-form + Zod                      |
| Mail       | Nodemailer (via `/api/contact`)            |

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in SMTP credentials
npm run dev                  # http://localhost:3000
```

## Scripts

| Script              | Purpose                          |
| ------------------- | -------------------------------- |
| `npm run dev`       | Dev server                       |
| `npm run build`     | Production build                 |
| `npm start`         | Serve the production build       |
| `npm run lint`      | ESLint (`eslint-config-next`)    |
| `npm run typecheck` | `tsc --noEmit`                   |

## Layout

```
src/
├── app/              # App Router: routes, layout, API handlers
│   ├── api/          # /api/contact (Nodemailer), /api/country (geo)
│   └── blog/[slug]/  # prerendered from src/data/blog.ts
├── components/
│   ├── ui/           # shadcn primitives — edit these freely
│   ├── providers/    # SmoothScroll (Lenis + GSAP bridge)
│   ├── site/         # design system: layout, buttons, header, footer, cards
├── data/             # content: blog, services, testimonials, schedule…
├── lib/              # gsap registry, email template, cn()
└── types/
_legacy/              # pre-migration Vite components, reference only
```

### Design tokens

Brand values live in `src/app/globals.css` as CSS variables, exposed to
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

Type is Cormorant Garamond 500 (display) and Manrope (body), via `next/font`.

#### Type scale

One utility per text role (`src/app/globals.css`, values from the home page).
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
- `server/` is the retired Express API, now superseded by the route handlers in
  `src/app/api/`. Safe to delete once its credentials are confirmed migrated.
- Deployment (Railway) runs `npm ci && npm run build`, then `npm start`.
  `EMAIL_*` variable names are unchanged from the Express setup.
