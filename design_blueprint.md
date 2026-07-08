# SiteSight — Design Blueprint

## Design System: "Rollin" Theme

Inspired by the "BAKE" aesthetic — chunky rounded typography, floating card containers,
dual-tone canvas, and pill-shaped interactive elements that feel tactile and premium.

---

## Color Tokens

```css
/* globals.css — CSS custom properties */

:root {
  /* Light Mode ("Rollin Cream") */
  --color-canvas:       #FDF8F1;   /* Warm cream page background */
  --color-card:         #FFFFFF;   /* Floating section cards */
  --color-border:       #2D1B14;   /* Dark brown card borders */
  --color-text-primary: #1A0A00;   /* Near-black body text */
  --color-text-muted:   #7A6A60;   /* Muted labels, captions */
  --color-accent:       #1A6B3C;   /* Forest green — CTAs, links, scores */
  --color-accent-hover: #145530;   /* Darker green on hover */
  --color-warn:         #D97706;   /* Amber — warning audit items */
  --color-fail:         #DC2626;   /* Red — failed audit items */
  --color-pass:         #16A34A;   /* Green — passed audit items */
}

.dark {
  /* Dark Mode ("Deep Startup") */
  --color-canvas:       #0D0D0D;
  --color-card:         #1A1A1A;
  --color-border:       #2E2E2E;
  --color-text-primary: #F5F0E8;
  --color-text-muted:   #888888;
  --color-accent:       #34D399;   /* Emerald green in dark mode */
  --color-accent-hover: #10B981;
  --color-warn:         #FBBF24;
  --color-fail:         #F87171;
  --color-pass:         #4ADE80;
}
```

---

## Typography

```html
<!-- In layout.tsx — import from Google Fonts -->

Display / Headings:  'Bricolage Grotesque' — weight 900, used for all hero and section titles
Body:                'Inter' — weight 400/500, used for all body text, labels, audit items
Accent / Handwritten: 'Caveat' — weight 600, used only for small hand-drawn annotation labels
```

**Type Scale:**
```
Hero headline:     text-7xl md:text-8xl  font-black  (Bricolage Grotesque)
Section headline:  text-4xl md:text-5xl  font-black  (Bricolage Grotesque)
Card title:        text-2xl              font-bold   (Bricolage Grotesque)
Body:              text-base             font-normal (Inter)
Label / Caption:   text-sm               font-medium (Inter)
Annotation:        text-sm               font-semibold (Caveat)
```

---

## Container System

Every major section is a **"floating card"** with these shared classes:

```tsx
// Reusable section card wrapper
const SectionCard = ({ children, className }) => (
  <div className={`
    rounded-[3rem]
    border-2 border-[var(--color-border)]
    bg-[var(--color-card)]
    px-8 py-12 md:px-16 md:py-20
    ${className}
  `}>
    {children}
  </div>
);
```

Page canvas background: `bg-[var(--color-canvas)]`
Section gap between cards: `space-y-6` or `gap-6`
Max content width: `max-w-6xl mx-auto px-4`

---

## Button System

All buttons are pill-shaped with a 3D "sticker" bottom-border effect.

```tsx
// Primary CTA button
<button className="
  rounded-full
  bg-[var(--color-accent)]
  text-white
  font-bold
  px-8 py-4
  border-2 border-[var(--color-border)]
  border-b-[5px]                          /* The 3D sticker effect */
  active:border-b-2 active:translate-y-[2px]  /* Press down on click */
  transition-all duration-100
  hover:bg-[var(--color-accent-hover)]
">
  Check Website →
</button>

// Secondary / ghost button
<button className="
  rounded-full
  bg-transparent
  text-[var(--color-text-primary)]
  font-bold
  px-8 py-4
  border-2 border-[var(--color-border)]
  border-b-[5px]
  active:border-b-2 active:translate-y-[2px]
  transition-all duration-100
">
  Learn More
</button>
```

---

## Landing Page Architecture

### Section 1 — Hero
```
┌─────────────────────────────────────────────────────┐
│  [Annotation: "Free. No signup."]                   │
│                                                     │
│  Your Website's SEO,                                │  ← text-8xl Bricolage
│  Laid Bare in                                       │
│  30 Seconds.                                        │
│                                                     │
│  [Sub] Stop guessing. Enter any URL and get a       │
│  full audit — meta, performance, content, trust.    │
│                                                     │
│  ┌─────────────────────────────────┐ [Check →]      │  ← Pill input + button
│  │  https://yourwebsite.com        │                 │
│  └─────────────────────────────────┘                │
│                                                     │
│         [Floating pill mockup of result card]       │
└─────────────────────────────────────────────────────┘
```

### Section 2 — Trust Signal Marquee
```
┌─────────────────────────────────────────────────────┐
│  Trusted by teams at  ← ← ← scrolling logos → → →  │
└─────────────────────────────────────────────────────┘
```
- CSS `animation: marquee linear infinite` — no JS needed
- Use text-based logos (company names in bold) if image assets aren't available

### Section 3 — How It Works
```
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  01 Enter URL │  │ 02 We Analyze │  │  03 Get Score │
│  Any public   │  │ 40+ SEO checks│  │  Full report  │
│  website URL  │  │ in seconds    │  │  + PDF export │
└───────────────┘  └───────────────┘  └───────────────┘
```
- Three mini cards in a row (stack on mobile)
- Each card: large number, title, one-line description

### Section 4 — SEO CIBIL Score Preview (Interactive)
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   Your SEO Score                                    │
│                                                     │
│         ╭──────────────╮                            │
│        ╱  74 / 100      ╲    ← SVG Arc Gauge        │
│       │   ████████░░░░   │                          │
│        ╲________________╱                            │
│                                                     │
│   [Technical 78] [On-Page 85] [Perf 62] [Content 70]│
│    ← four mini pill score badges below gauge →      │
│                                                     │
└─────────────────────────────────────────────────────┘
```
- Animate gauge arc on scroll-into-view using Framer Motion
- Use demo/mock data on landing page; real data in analyzer results

### Section 5 — Testimonials
```
┌──────────────────────────┐  ┌──────────────────────────┐
│ "Fixed our title tags in │  │ "Finally understand why  │
│  10 minutes."            │  │  we rank low."           │
│  — @handle, Startup CTO  │  │  — @handle, Indie Hacker │
└──────────────────────────┘  └──────────────────────────┘
```
- Two cards side by side (stack on mobile)
- Use realistic but fictional personas

### Section 6 — Final CTA
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│         Ready to see your real SEO score?           │
│                                                     │
│   ┌────────────────────────┐  [Get My Free Report →]│
│   │  https://...           │                        │
│   └────────────────────────┘                        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Analyzer Panel (The Live Tool UI)

When a user submits a URL, the landing page transitions to the results view. This is a
separate component (`AnalyzerPanel.tsx`) that handles three states:

**State 1 — Loading:**
```
┌─────────────────────────────────────────────────────┐
│  Analyzing example.com...                           │
│  [Animated progress bar or pulsing dots]            │
│  Checking meta tags · Crawling links · Scoring...   │
└─────────────────────────────────────────────────────┘
```

**State 2 — Results:**
```
┌──────────────────┐  ┌─────────────────────────────┐
│   Overall: 74    │  │  Technical SEO         78   │
│   [Gauge]        │  │  ██████████░░ ✓ HTTPS       │
│                  │  │             ✓ robots.txt    │
│                  │  │             ✗ sitemap.xml   │
└──────────────────┘  └─────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  On-Page SEO                                   85   │
│  ✓ Title tag present (58 chars — Good)              │
│  ✓ Meta description present (142 chars — Good)      │
│  ✗ Missing H1 tag                                   │
│  ✓ Open Graph tags present                          │
└─────────────────────────────────────────────────────┘
```

Each audit item uses `AuditItem.tsx`:
- Green checkmark = Pass
- Amber warning = Present but suboptimal
- Red X = Fail

**State 3 — Error:**
```
┌─────────────────────────────────────────────────────┐
│  ⚠ Could not reach this URL                        │
│  The site may be down, blocking bots, or the URL    │
│  may be incorrect. Check and try again.             │
└─────────────────────────────────────────────────────┘
```

---

## Animation Directives (Framer Motion)

```tsx
// Standard scroll-pop animation — use on every SectionCard
const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

<motion.div
  variants={cardVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-80px" }}
>
  <SectionCard>...</SectionCard>
</motion.div>

// Gauge arc animation — animate strokeDashoffset from 0 to target value on mount
// Stagger children in score category row — delay: index * 0.1
```

---

## Theme Toggle (Zustand)

```tsx
// store/themeStore.ts
import { create } from 'zustand';

interface ThemeStore {
  theme: 'light' | 'dark';
  toggle: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'light',
  toggle: () => set((state) => ({
    theme: state.theme === 'light' ? 'dark' : 'light'
  })),
}));

// In layout.tsx — apply theme class to <html>
// <html className={theme}>
```

---

## Responsive Rules

- All section cards: `rounded-[3rem] md:rounded-[3rem] rounded-[1.5rem]` — reduce radius on mobile but never remove it
- Hero headline: `text-5xl md:text-7xl lg:text-8xl`
- Three-column how-it-works: `grid grid-cols-1 md:grid-cols-3`
- Score cards: `grid grid-cols-2 md:grid-cols-4`
- Testimonials: `grid grid-cols-1 md:grid-cols-2`
- Analyzer panel: full-width single column on mobile, two-column on desktop

---

## Audit Item Component Spec

```tsx
// types/analysis.ts
type AuditStatus = 'pass' | 'warn' | 'fail';

interface AuditItem {
  status: AuditStatus;
  label: string;        // e.g. "Title tag present"
  detail: string;       // e.g. "58 characters — within recommended range"
  learnMore?: string;   // Optional URL to MDN/Google docs
}
```

Color mapping:
- `pass` → `var(--color-pass)` with ✓ icon
- `warn` → `var(--color-warn)` with ⚠ icon  
- `fail` → `var(--color-fail)` with ✗ icon