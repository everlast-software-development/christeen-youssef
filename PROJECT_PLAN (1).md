# Dr. Christeen Youssef — React + TypeScript Rebuild Plan

> **Goal**: Rebuild [christeenyoussef.com](https://christeenyoussef.com/) from scratch as a premium, production-ready React/TypeScript single-page application with superior UI/UX, cinematic animations, and identical content to the original WordPress/Elementor site.

---

## 1. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **React 18** + **TypeScript** | Type safety, scalability |
| Build Tool | **Vite** | Fast dev, optimised production builds |
| Styling | **Plain CSS** (CSS Modules per component + shared stylesheets) | Zero-dependency, full control, scoped styles |
| Animation | **Framer Motion** | Scroll-triggered reveals, page transitions, micro-interactions |
| Icons | **React Icons** (Feather set) | Matches original icon style |
| Routing | **React Router v6** | Multi-page navigation (Home, About, Gallery, Blog, Contact) |
| Forms | **React Hook Form** + **Zod** | Validated contact/appointment forms |
| Carousel/Slider | **Swiper React** | Testimonials, blog cards, image gallery |
| Counter Animation | **react-countup** | Animated stats section |
| Intersection Observer | **react-intersection-observer** | Trigger animations on scroll |
| Image Optimisation | **vite-plugin-image-optimizer** | WebP, lazy loading |
| Linting/Format | **ESLint** + **Prettier** | Code quality |
| Deployment | **Vercel** or **Netlify** | Zero-config, edge CDN |

---

## 2. Design Direction

### 2.1 Aesthetic: "Luxe Medical Elegance"

A refined, editorial feel that communicates trust, expertise, and modern sophistication — inspired by high-end dermatology clinics and luxury magazine layouts.

- **Color Palette**:
  - Primary: `#C99928` (gold — carried from the original)
  - Dark: `#0F1117` (deep charcoal, near-black)
  - Surface: `#16181D` (card backgrounds in dark mode)
  - Light Surface: `#F8F6F1` (warm off-white for light sections)
  - Accent Gradient: `linear-gradient(135deg, #C99928 0%, #E8C86A 50%, #C99928 100%)`
  - Body Text: `#A0A6B5` (muted slate)
  - Headings: `#FFFFFF` on dark / `#1A1D23` on light

- **Typography**:
  - Display / Headings: **Playfair Display** (serif, elegant, medical-luxury)
  - Body / UI: **DM Sans** (geometric sans, modern, excellent readability)
  - Accent / Labels: **Manrope** (technical, clean)

- **Visual Language**:
  - Neumorphic card shadows on dark surfaces (subtle inner glow + outer shadow)
  - Gold accent lines, dividers, and hover underlines
  - Generous white space, asymmetric layouts with overlapping elements
  - Frosted glass (backdrop-filter: blur) for header and modal overlays
  - Grain/noise texture overlay on hero section for editorial depth
  - Soft parallax on hero background image

### 2.2 UX Enhancements Over Original

| Original Issue | Enhancement |
|---|---|
| Generic Elementor template feel | Custom-designed components with unique personality |
| No page transitions | Smooth Framer Motion page transitions (fade + slide) |
| Basic scroll animations (AOS) | Choreographed staggered reveals per section |
| Static navigation | Glassmorphism sticky nav with scroll progress indicator |
| Basic testimonial slider | 3D perspective carousel with auto-play and drag |
| Flat service cards | Hover-lift cards with icon morph and gold accent border |
| No loading state | Elegant loading screen with logo animation |
| No dark/light toggle | The site defaults to dark theme (matching original) with optional light toggle |
| Basic footer | Rich mega-footer with map, quick links, social, newsletter |
| Mobile hamburger is plain | Full-screen overlay menu with staggered link animations |

---

## 3. Content Map (Exact Content From Original)

### 3.1 Navigation Links

```
Home | About Me | My Gallery (dropdown: Before & After, Publications) | Case Study | Testimonials | Blog | Reach Me
```

### 3.2 Section-by-Section Content

#### SECTION 1: Hero

- **Heading**: `DR. CHRISTEEN YOUSSEF`
- **Subtitle**: `MSC, MBBS`
- **Animated Headline** (rotating/typewriter):
  - `Aesthetic Dermatologist`
  - `And`
  - `Consultant`
- **CTA Button**: `Make an Appointment` → links to `/appointment`
- **Background**: Full-bleed professional photo with dark overlay + grain texture

#### SECTION 2: About Me (Homepage Summary)

- **Subtitle badge**: `About Me`
- **Heading**: `DR. CHRISTEEN YOUSSEF`
- **Image**: Professional portrait photo (left column)
- **Body Text**:
  > Motivational keynote speaker and subject matter expert for 12 strong years in the field of Aesthetic Medicine. Efficient communicator who engages with diverse audience through insightful presentations on emerging topics in the complex areas of Aesthetics and Dermatology. Active member of the international healthcare community with a passion on furthering standards of excellence in Aesthetic Dermatology spearheading clinically proven and safe best practices. Dynamic mentor dedicated to influencing positive change as a peer adviser, consultant, and healthcare educator.
- **CTA Button**: `Learn More` → links to `/about-me`

#### SECTION 3: Special Facilities

- **Subtitle badge**: `Special Facilities`
- **Heading**: `Special Facilities For My Patients`
- **3 Feature Cards** (icon + title + description):
  1. **Follow-Up Care** — "Dedicated post-treatment support and guidance to monitor progress and ensure satisfaction."
  2. **Customized Treatment Plans** — "Tailored solutions for individual skin concerns, ensuring personalized care for each patient. Rapid Diagnostics: Utilizing cutting-edge tools for swift and accurate diagnoses, enabling prompt treatment."
  3. **Advanced Therapies** — "Providing innovative treatments such as laser therapy, PRP, or targeted medications for effective results."

#### SECTION 4: Stats / Counters

| Label | Value |
|---|---|
| PATIENT TOTAL | 22,000+ |
| CONFERENCE SPEAKER | 30+ |
| AWARDS | 20+ |
| FOLLOWERS | 3,000+ |

#### SECTION 5: Aesthetic & Medical Services

- **Heading**: `Aesthetic & Medical Services`
- **6 Service Cards** (icon + title + description):
  1. **Acne Treatment** — "Tailored acne solutions integrating topical, oral, and innovative therapies for all acne types and severities, ensuring clear and healthy skin."
  2. **Cosmetic Dermatology** — "Transform and refresh your appearance through safe, natural-looking procedures like Botox, fillers, chemical peels, and laser treatments, emphasizing rejuvenation and scar reduction for enhanced confidence."
  3. **Eczema and Psoriasis Management** — "Customized management plans addressing eczema and psoriasis with personalized treatments, lifestyle adjustments, and innovative therapies, aiming for long-term skin health."
  4. **Hair Loss Treatment** — "Expert diagnosis and diverse treatment options, including PRP therapy, medications, and transplantation, restoring hair and confidence for both men and women."
  5. **Skin Rejuvenation and Anti-Aging** — "Reveal youthful skin with microdermabrasion, microneedling, and laser treatments, effectively reducing fine lines, improving texture, and boosting collagen production."
  6. **Allergy Testing and Treatment** — "Precision allergy testing for skin allergens, coupled with personalized treatment plans including medication, allergen avoidance strategies, and discussions on long-term immunotherapy for effective and patient-centered relief."

#### SECTION 6: Testimonials Carousel

- **Testimonial 1** — **Ms. Nawal Khalid** (Thread Lifting Patient, Mar 4, 2020): "An active member of the international healthcare community with a passion for furthering standards of excellence in Aesthetic Dermatology spearheading clinically proven and safe best practices. Dynamic mentor dedicated to influencing positive change as a peer adviser, consultant, and healthcare educator."
- **Testimonial 2** — **Eman Yassin**: "Thank you for my birthday gift, Thank you dr. Christine it's amazing skin poster with Monica🌸 Very nice center I love it."
- **Testimonial 3** — **Rita S.**: "Thank you so much Dr. Christine for the wonderful birthday gift! The skincare treatment was such a thoughtful and perfect choice—I truly appreciate your kindness and the effort you put into making my day special. My skin feels amazing, and I'm so grateful for your generosity. Thanks again for making my birthday even more memorable!"
- **Testimonial 4** — **Lamy S**: "Dr. Christine's hands are very gentle, and she works quickly. Thank you, Dr. Christine, for your efforts and care. God willing, any future cosmetic procedure I have will definitely be with her."
- **Testimonial 5** — **Alaa M**: "big thank you to Dr. Christine for her patience and kindness"

#### SECTION 7: Weekly Schedule

- **Subtitle**: `Weekly 6 Days`
- **Heading**: `My Regular Schedule`
- **Schedule Card**:
  - **Clinic**: EVERLAST WELLNESS MEDICAL CENTER
  - **Role**: Dermatologist
  - **Address**: Abu Dhabi, UAE
  - **Working Days**: Sunday, Monday, Tuesday, Wednesday, Thursday and Friday
  - **Visiting Hour**: 11am - 6pm
  - **Contact No**: +971 600 551615
  - **CTA**: `Call For Appointment (+971 600551615)`

#### SECTION 8: Blog / Latest News

- **Heading**: `Latest News`
- Display latest blog posts as cards (title, date, excerpt, read time, category tag)
- Blog posts include articles like:
  - "From Wounds to Wellness: Dr. Christeen Youssef Redefines Scar Healing..." (CONFERENCE, 5 min read, 22/10/2025)
  - "Dr. Christeen on 'Sabah Al Emarat': Revolutionary Scar-Free Burn Healing" (01/06/2025)

#### SECTION 9: CTA Banner

- **Heading**: `Need a Family Doctor for Check-up?`
- **Subtext**: `Just Make an appointment & you are done.`

#### SECTION 10: Footer

- **Quick Links**: HOME, ABOUT ME, MY GALLERY, CASE STUDY, TESTIMONIALS, BLOG, REACH ME
- **Email**: christeen.youssef@everlastwellness.com
- **Address**: 446 Al Khaleej Al Arabi St - Al Bateen - Abu Dhabi - UAE
- **Social Icons**: Facebook, LinkedIn, Instagram, Snapchat, TikTok, WhatsApp, YouTube

### 3.3 About Me Page (`/about-me`) — Full Content

- **Bio paragraphs** (6 bullet-style paragraphs about Dr. Christeen's background)
- **Career Timeline** (2006–2023):
  1. **Medical Director of Everlast Academy** (2018 – Present)
  2. **Zagazig University — Associate Professor of Dermatology** (2015 – Present)
  3. **Everlast Wellness Medical Center — Founder / Medical Director**
  4. **First Medical Center — Head of Dermatology** (2011 – 2015)
  5. **Gulf Diagnostic Center Hospital — Dermatologist** (2009 – 2011)
  6. **Cosmesurge Emirates Hospital — Dermatologist** (2006 – 2009)
- Each career entry has a full description paragraph (see original content)

### 3.4 Other Pages (Stubbed)

- `/before-and-after` — Before & After gallery page
- `/publications` — Publications page
- `/blog` — Blog listing
- `/reach-me` — Contact form page
- `/appointment` — Appointment booking page

---

## 4. Project Structure

```
dr-christeen-youssef/
├── public/
│   ├── images/                    # All site images (hero, about, services, blog, logo)
│   │   ├── logo.webp
│   │   ├── logo-mobile.webp
│   │   ├── hero-bg.webp
│   │   ├── about-portrait.webp
│   │   ├── services/
│   │   │   ├── acne.webp
│   │   │   ├── cosmetic.webp
│   │   │   ├── eczema.webp
│   │   │   ├── hair-loss.webp
│   │   │   ├── rejuvenation.webp
│   │   │   └── allergy.webp
│   │   ├── blog/
│   │   └── testimonials/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   └── fonts/                 # Self-hosted font files
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx         # Glassmorphism sticky header + mobile menu
│   │   │   ├── Header.module.css
│   │   │   ├── Footer.tsx         # Rich mega-footer
│   │   │   ├── Footer.module.css
│   │   │   ├── MobileMenu.tsx     # Full-screen animated overlay
│   │   │   ├── MobileMenu.module.css
│   │   │   ├── ScrollProgress.tsx # Top progress bar
│   │   │   ├── ScrollProgress.module.css
│   │   │   └── PageTransition.tsx # Framer Motion page wrapper
│   │   ├── ui/
│   │   │   ├── Button.tsx         # Reusable CTA button (gold gradient)
│   │   │   ├── Button.module.css
│   │   │   ├── SectionBadge.tsx   # "About Me", "Special Facilities" labels
│   │   │   ├── SectionBadge.module.css
│   │   │   ├── SectionHeading.tsx # Consistent heading component
│   │   │   ├── SectionHeading.module.css
│   │   │   ├── Card.tsx           # Neumorphic card wrapper
│   │   │   ├── Card.module.css
│   │   │   ├── Counter.tsx        # Animated number counter
│   │   │   ├── Counter.module.css
│   │   │   ├── AnimatedText.tsx   # Typewriter / rotating text
│   │   │   ├── GrainOverlay.tsx   # SVG noise texture overlay
│   │   │   ├── GrainOverlay.module.css
│   │   │   ├── BackToTop.tsx      # Scroll-to-top button
│   │   │   └── BackToTop.module.css
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── HeroSection.module.css
│   │   │   ├── AboutSection.tsx
│   │   │   ├── AboutSection.module.css
│   │   │   ├── FacilitiesSection.tsx
│   │   │   ├── FacilitiesSection.module.css
│   │   │   ├── StatsSection.tsx
│   │   │   ├── StatsSection.module.css
│   │   │   ├── ServicesSection.tsx
│   │   │   ├── ServicesSection.module.css
│   │   │   ├── TestimonialsSection.tsx
│   │   │   ├── TestimonialsSection.module.css
│   │   │   ├── ScheduleSection.tsx
│   │   │   ├── ScheduleSection.module.css
│   │   │   ├── BlogSection.tsx
│   │   │   ├── BlogSection.module.css
│   │   │   ├── CTASection.tsx
│   │   │   └── CTASection.module.css
│   │   └── pages/
│   │       ├── HomePage.tsx
│   │       ├── AboutPage.tsx
│   │       ├── AboutPage.module.css
│   │       ├── GalleryPage.tsx
│   │       ├── BlogPage.tsx
│   │       ├── ContactPage.tsx
│   │       └── AppointmentPage.tsx
│   ├── data/
│   │   ├── services.ts            # Services array with icons, titles, descriptions
│   │   ├── testimonials.ts        # Testimonials data
│   │   ├── schedule.ts            # Schedule data
│   │   ├── stats.ts               # Counter values
│   │   ├── navigation.ts          # Nav links with submenus
│   │   ├── career.ts              # Career timeline entries (About page)
│   │   ├── blog.ts                # Blog post entries
│   │   └── socials.ts             # Social media links
│   ├── hooks/
│   │   ├── useScrollPosition.ts
│   │   ├── useIntersectionObserver.ts
│   │   └── useMediaQuery.ts
│   ├── styles/
│   │   ├── globals.css            # CSS variables, reset, base typography, font imports
│   │   └── animations.css         # Custom @keyframes animations
│   ├── types/
│   │   └── index.ts               # Shared TypeScript interfaces
│   ├── utils/
│   │   └── motion.ts              # Framer Motion variant presets
│   ├── App.tsx                    # Router + Layout wrapper
│   ├── main.tsx                   # Entry point
│   └── vite-env.d.ts
├── index.html
├── tsconfig.json
├── vite.config.ts
├── package.json
└── README.md
```

---

## 5. Implementation Phases

### Phase 1: Project Scaffolding

1. `npm create vite@latest dr-christeen-youssef -- --template react-ts`
2. Install dependencies:
   ```bash
   npm install react-router-dom framer-motion swiper react-countup react-intersection-observer react-icons react-hook-form @hookform/resolvers zod
   ```
3. Create `src/styles/globals.css` with:
   - `@import` for Google Fonts: Playfair Display, DM Sans, Manrope
   - CSS custom properties (`:root`) for all design tokens (colors, fonts, spacing, shadows, border-radius, transitions)
   - CSS reset / base styles (box-sizing, margin, padding, body defaults)
   - Base typography rules (font-family, line-height, color)
4. Create `src/styles/animations.css` with all `@keyframes` definitions
5. Import both stylesheets in `main.tsx`
6. Create Framer Motion variant presets in `utils/motion.ts`

#### CSS Custom Properties Reference (`globals.css`)

```css
:root {
  /* Colors */
  --color-primary: #C99928;
  --color-primary-light: #E8C86A;
  --color-dark: #0F1117;
  --color-surface: #16181D;
  --color-light-surface: #F8F6F1;
  --color-body-text: #A0A6B5;
  --color-heading-dark: #FFFFFF;
  --color-heading-light: #1A1D23;
  --gradient-gold: linear-gradient(135deg, #C99928 0%, #E8C86A 50%, #C99928 100%);

  /* Typography */
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
  --font-accent: 'Manrope', system-ui, sans-serif;

  /* Spacing scale */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;
  --space-3xl: 4rem;
  --space-4xl: 6rem;

  /* Shadows */
  --shadow-card: 0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  --shadow-card-hover: 0 12px 40px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  --shadow-gold-glow: 0 0 20px rgba(201, 153, 40, 0.3);

  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-xl: 24px;

  /* Transitions */
  --transition-fast: 0.2s ease;
  --transition-base: 0.3s ease;
  --transition-slow: 0.5s ease;

  /* Layout */
  --container-max: 1280px;
  --header-height: 80px;
}
```

### Phase 2: Layout Components

1. **Header.tsx** + `Header.module.css`
   - Sticky header with `backdrop-filter: blur(16px)` glassmorphism
   - Logo on left, nav links centered/right
   - Gold underline on hover with `transform-origin` transition (pure CSS)
   - Dropdown for "My Gallery" sub-menu
   - Scroll-based background opacity (transparent → frosted on scroll, toggled via JS class)
   - Mobile: hamburger icon triggers `MobileMenu`

2. **MobileMenu.tsx** + `MobileMenu.module.css`
   - Full-screen overlay with dark background
   - Links animate in with `staggerChildren` (Framer Motion)
   - Close button with rotate animation
   - Social links at bottom

3. **Footer.tsx** + `Footer.module.css`
   - 4-column CSS Grid: Brand/Description, Quick Links, Contact Info, Social
   - Gold accent divider line at top
   - Social icon hover: scale + gold color transition (CSS `transition` + `:hover`)
   - Copyright at bottom

4. **ScrollProgress.tsx** + `ScrollProgress.module.css`
   - Fixed top bar showing scroll progress (gold gradient fill)

5. **PageTransition.tsx**
   - Wraps each page with `AnimatePresence` + fade/slide variants

### Phase 3: Shared UI Components

1. **Button.tsx** + `Button.module.css` — Two variants: `primary` (gold gradient bg, white text) and `outline` (gold border, gold text). Hover: subtle scale + glow. All via CSS `:hover` and `transition`.
2. **SectionBadge.tsx** + `SectionBadge.module.css` — Small uppercase label with gold left border or underline.
3. **SectionHeading.tsx** + `SectionHeading.module.css` — `h2` with Playfair Display, optional subtitle badge above.
4. **Card.tsx** + `Card.module.css` — Dark surface bg, neumorphic shadow (`var(--shadow-card)`), hover-lift (`translateY(-8px)` + `var(--shadow-card-hover)`). Gold top-border accent on `:hover`.
5. **Counter.tsx** + `Counter.module.css` — Uses `react-countup` + `react-intersection-observer` to trigger on scroll.
6. **AnimatedText.tsx** — Rotating/typewriter headlines using Framer Motion `AnimatePresence`.
7. **GrainOverlay.tsx** + `GrainOverlay.module.css` — SVG `<filter>` noise rendered as fixed overlay with `mix-blend-mode: overlay` and low opacity.
8. **BackToTop.tsx** + `BackToTop.module.css` — Appears after scrolling 300px, gold circle with up-arrow, smooth scroll.

### Phase 4: Homepage Sections

#### 4.1 HeroSection.tsx + `HeroSection.module.css`
- Full viewport height (`height: 100vh`)
- Background image with dark gradient overlay + grain texture
- Content centered vertically with CSS Flexbox
- `h1`: "DR. CHRISTEEN YOUSSEF" — fade-up with letter-spacing animation
- `h2`: "MSC, MBBS" — fade-up with delay
- `AnimatedText` cycling: "Aesthetic Dermatologist" / "And" / "Consultant"
- CTA button: "Make an Appointment" — scale-in with delay
- Subtle parallax on background (scroll-based `translateY` via JS)
- Decorative: floating gold particles or subtle diagonal line pattern

#### 4.2 AboutSection.tsx + `AboutSection.module.css`
- Two-column layout using CSS Grid (`grid-template-columns: 1fr 1fr`)
- Image: fade-in from left with slight rotation, wrapped in a card with neumorphic shadow
- Gold decorative frame/border offset behind image
- Text: staggered fade-up (badge → heading → paragraph → button)

#### 4.3 FacilitiesSection.tsx + `FacilitiesSection.module.css`
- Section heading centered with badge
- 3-column CSS Grid card layout
- Each card: icon (Feather), title, description
- Animation: cards stagger in from bottom
- Hover: card lifts (CSS `transform` + `transition`), icon gets gold color, top border slides in

#### 4.4 StatsSection.tsx + `StatsSection.module.css`
- Full-width dark section with subtle background pattern
- 4 stat counters in a row using CSS Flexbox
- Each: large animated number + label below
- Numbers animate when scrolled into view
- Gold number color (`color: var(--color-primary)`), white label
- Separator lines between stats using CSS borders or pseudo-elements

#### 4.5 ServicesSection.tsx + `ServicesSection.module.css`
- Section heading
- 3×2 CSS Grid of service cards
- Each card: relevant medical icon, title, description
- Hover: card scales slightly, gold gradient border appears
- Staggered scroll-triggered entrance

#### 4.6 TestimonialsSection.tsx + `TestimonialsSection.module.css`
- Swiper carousel with `coverflow` or `cards` effect
- Each slide: quote icon, testimonial text, patient name, treatment type, date
- Star rating display
- Auto-play with pause on hover
- Navigation dots + prev/next arrows styled in gold via Swiper CSS variable overrides

#### 4.7 ScheduleSection.tsx + `ScheduleSection.module.css`
- Two-column CSS Grid: left = section info, right = schedule card
- Schedule card with neumorphic style using CSS custom properties
- Working days displayed as pill badges (`border-radius: 999px` + padding)
- CTA: "Call For Appointment" button

#### 4.8 BlogSection.tsx + `BlogSection.module.css`
- Section heading: "Latest News"
- 2–3 blog post cards in a CSS Grid row
- Each card: image, category badge, title, date, read time, excerpt
- Hover: image zoom (`transform: scale(1.05)` with `overflow: hidden`), card lift

#### 4.9 CTASection.tsx + `CTASection.module.css`
- Full-width gold gradient background (`background: var(--gradient-gold)`)
- Heading and subtext centered
- CTA button with dark background on gold section

### Phase 5: About Me Page (`/about-me`) + `AboutPage.module.css`

- Hero banner with title "About Me"
- Bio section with portrait image and 6 descriptive paragraphs
- Career Timeline:
  - Vertical timeline with alternating left/right cards using CSS Grid + pseudo-elements for the gold line and dot connectors
  - Each entry: year range, title, organisation, description
  - Scroll-triggered staggered reveal via Framer Motion

### Phase 6: Additional Pages (Stubs)

- `/before-and-after` — Masonry grid gallery with lightbox (placeholder images)
- `/publications` — List/card layout for publications
- `/blog` — Blog listing with filters
- `/blog/:slug` — Individual blog post template
- `/reach-me` — Contact form (name, email, phone, message) + clinic info + embedded map
- `/appointment` — Appointment booking form (date, time, service selection)

### Phase 7: Animation System (`utils/motion.ts`)

Define reusable Framer Motion variants:

```typescript
// Fade up (default section entrance)
export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

// Fade in from left
export const fadeLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

// Fade in from right
export const fadeRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

// Stagger children container
export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
};

// Scale in (for buttons, badges)
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

// Page transition
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};
```

### Phase 8: Responsive Design & Polish

- **Breakpoints** (written as plain CSS `@media` queries inside each `.module.css` file):
  - Mobile-first default (< 640px)
  - `@media (min-width: 640px)` — sm
  - `@media (min-width: 768px)` — md
  - `@media (min-width: 1024px)` — lg
  - `@media (min-width: 1280px)` — xl
- Mobile: single column, hamburger nav, smaller headings, swipeable carousels
- Tablet: 2-column grids, condensed header
- Desktop: full layouts, hover effects active, parallax enabled
- Performance: lazy load images, code-split routes, preload critical fonts
- Accessibility: semantic HTML, ARIA labels, focus states, skip-to-content link, sufficient contrast ratios
- SEO: `<title>`, meta description, Open Graph tags per page, structured data (JSON-LD for `Physician`)

### Phase 9: Final QA

- Cross-browser testing (Chrome, Safari, Firefox, Edge)
- Mobile testing (iOS Safari, Android Chrome)
- Lighthouse audit: target 90+ in Performance, Accessibility, Best Practices, SEO
- Animation performance: ensure 60fps (use `will-change`, `transform` only, avoid layout thrash)
- Form validation testing
- All links and navigation verified
- Dark theme consistency check
- Image optimisation check (all WebP, lazy loaded)

---

## 6. Image Assets Required

> **Note**: The agent should download/reference these from the original site or use placeholder images marked for replacement.

| Asset | Source URL (from original) | Usage |
|---|---|---|
| Logo | `/wp-content/uploads/2024/01/Dr.-CY-Logo-FINAL-023-scaled.webp` | Header |
| Logo (mobile) | `/wp-content/uploads/2024/01/s-e1704383352984.webp` | Mobile menu |
| About Portrait | `/wp-content/uploads/2024/01/Untitled-design.webp` | About section |
| Hero Background | Hero section background image | Hero |
| Favicon | `/wp-content/uploads/2024/01/cropped-Untitled-design2-32x32.webp` | Favicon |
| Blog Post Images | Various blog post featured images | Blog cards |
| Service Icons | Use React Icons (Feather set) — no image files needed | Services |

---

## 7. Key TypeScript Interfaces (`types/index.ts`)

```typescript
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
```

---

## 8. Data Files Summary

All content is extracted from the live site. Each data file exports a typed array/object:

- **`data/navigation.ts`** — 7 main nav items, "My Gallery" has 2 children
- **`data/services.ts`** — 6 services with full descriptions
- **`data/testimonials.ts`** — 5 testimonials with names
- **`data/stats.ts`** — 4 counters (22000, 30, 20, 3000)
- **`data/schedule.ts`** — Single clinic schedule object
- **`data/career.ts`** — 6 career entries with full description paragraphs
- **`data/blog.ts`** — Blog post entries (at least 2 from original)
- **`data/socials.ts`** — 7 social platform links

---

## 9. Execution Order for Claude Agent

```
1.  Scaffold Vite + React + TypeScript project
2.  Install all dependencies (no Tailwind — see Section 1 for full list)
3.  Create src/styles/globals.css with Google Font imports, CSS custom properties, reset, and base styles
4.  Create src/styles/animations.css with all @keyframes
5.  Import both stylesheets in main.tsx
6.  Create types/index.ts
7.  Create all data files (data/*.ts)
8.  Create utils/motion.ts
9.  Create custom hooks (hooks/*.ts)
10. Build UI components (components/ui/*.tsx) each with its own .module.css
11. Build layout components (Header, Footer, MobileMenu, ScrollProgress, PageTransition) each with its own .module.css
12. Build each homepage section in order (Hero → About → Facilities → Stats → Services → Testimonials → Schedule → Blog → CTA) each with its own .module.css
13. Assemble HomePage.tsx
14. Build AboutPage.tsx with career timeline and AboutPage.module.css
15. Build remaining page stubs (Gallery, Blog, Contact, Appointment)
16. Set up React Router in App.tsx
17. Wire main.tsx entry point
18. Test and polish responsive design (media queries in each .module.css)
19. Optimise: lazy routes, image loading, performance
20. Final build and deploy verification
```

---

## 10. Quality Checklist

- [ ] All original content is present and accurate
- [ ] Navigation works across all pages
- [ ] Animations are smooth (60fps) and don't cause layout shift
- [ ] Mobile responsive at all breakpoints
- [ ] Forms validate properly
- [ ] Images are optimised and lazy loaded
- [ ] Lighthouse scores ≥ 90 across all categories
- [ ] No TypeScript errors (`tsc --noEmit` passes)
- [ ] No console errors in browser
- [ ] All social links point to correct URLs
- [ ] Contact info (phone, email, address) is correct
- [ ] SEO meta tags are set per page
- [ ] Favicon is set
- [ ] Scroll-to-top works
- [ ] Page transitions are smooth
- [ ] Header becomes sticky with glassmorphism on scroll
- [ ] Counters animate on scroll into view
- [ ] Testimonials carousel is draggable and auto-plays
- [ ] Career timeline animates on scroll (About page)
- [ ] No Tailwind classes, configuration, or dependencies present anywhere in the project
- [ ] All styling uses plain CSS only (CSS Modules + shared stylesheets in `src/styles/`)

---

*This plan contains everything needed to rebuild the site. Follow the execution order strictly. Reference the content map for exact copy. Follow the design direction for consistent aesthetics.*
