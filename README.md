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
│   └── dev/          # scaffolding, removed as the rebuild lands
├── data/             # content: blog, services, testimonials, schedule…
├── lib/              # gsap registry, email template, cn()
└── types/
_legacy/              # pre-migration Vite components, reference only
```

### Design tokens

Brand values live in `src/app/globals.css` as CSS variables, exposed to
Tailwind through `@theme inline`. That means `text-gold`, `bg-cream`,
`text-ink`, `font-display` and `container-brand` are real utilities.

| Token   | Value     |
| ------- | --------- |
| Gold    | `#C99928` |
| Gold lt | `#E8C86A` |
| Cream   | `#F8F6F1` |
| Ink     | `#0F1117` |
| Slate   | `#7A8094` |

Gold buttons use ink text, not white — white on gold is only ~2.3:1.

## Notes

- `_legacy/` is excluded from `tsconfig.json` and ESLint. It is kept only as a
  markup and copy reference during the rebuild, and does not compile.
- `server/` is the retired Express API, now superseded by the route handlers in
  `src/app/api/`. Safe to delete once its credentials are confirmed migrated.
- Deployment (Railway) runs `npm ci && npm run build`, then `npm start`.
  `EMAIL_*` variable names are unchanged from the Express setup.
