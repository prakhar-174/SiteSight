# SiteSight — Project Context

## What This Project Is

SiteSight is a stateless, on-the-fly SEO auditor inspired by Woorank. A user enters any website URL, the system crawls and analyzes it server-side, and returns a structured SEO report with a scored breakdown. No user accounts, no persistent database, no stored reports.

This is a **Next.js 14 full-stack project** — the frontend and all backend API logic live in a single repository, deployed to Vercel.

---

## Developer Context (Important)

- The developer is a **frontend-focused engineer** with strong React experience (hooks, Tailwind CSS, component architecture, REST API integration).
- This is their **first Next.js project** and **first full-stack project**.
- All backend/API logic should be written with clear comments explaining Next.js-specific patterns (App Router, Route Handlers, server vs. client components).
- Avoid over-engineering. Prefer readable, well-commented code over clever abstractions.
- The developer is comfortable with: React 18, Tailwind CSS, TypeScript basics, REST API calls via fetch/axios.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| HTML Crawling | axios + cheerio |
| Performance Data | Google PageSpeed Insights API (free) |
| Job State | In-memory Map (sufficient for assessment) |
| Deployment | Vercel (free tier) |

---

## Repository Structure

```
sitesight/
├── app/
│   ├── page.tsx                  # Landing page (SiteSight hero + analyzer UI)
│   ├── layout.tsx                # Root layout, font imports, theme provider
│   ├── globals.css               # Tailwind base + custom CSS variables
│   └── api/
│       ├── analyze/
│       │   └── route.ts          # POST /api/analyze — starts crawl, returns jobId
│       └── results/
│           └── [id]/
│               └── route.ts      # GET /api/results/:id — returns analysis result
├── lib/
│   ├── crawler.ts                # Core crawl logic: fetches URL HTML via axios
│   ├── analyzers/
│   │   ├── meta.ts               # Title, description, OG tags, Twitter meta
│   │   ├── headings.ts           # H1–H6 structure, hierarchy validation
│   │   ├── images.ts             # Alt tag audit
│   │   ├── links.ts              # Internal + external link counts
│   │   ├── technical.ts          # HTTPS, robots.txt, sitemap, canonical, redirects
│   │   └── content.ts            # Word count, keyword density, readability estimate
│   ├── scorer.ts                 # Aggregates analyzer results → 5 category scores + overall
│   ├── pageSpeed.ts              # Calls Google PageSpeed Insights API
│   └── jobStore.ts               # In-memory Map for job state management
├── components/
│   ├── ui/
│   │   ├── Gauge.tsx             # SVG arc gauge for SEO CIBIL score display
│   │   ├── ScoreCard.tsx         # Individual category score card
│   │   ├── AuditItem.tsx         # Pass/Warn/Fail row item
│   │   └── Marquee.tsx           # Scrolling trust signal bar
│   ├── sections/
│   │   ├── Hero.tsx              # Section 1: Story-driven hero + URL input
│   │   ├── TrustBar.tsx          # Section 2: Scrolling partner/seen-in logos
│   │   ├── HowItWorks.tsx        # Section 3: 3-step explainer
│   │   ├── ScorePreview.tsx      # Section 4: SEO CIBIL Score interactive preview
│   │   ├── Testimonials.tsx      # Section 5: Social proof
│   │   └── FinalCTA.tsx          # Section 6: Join waitlist / Get Started
│   ├── AnalyzerPanel.tsx         # The live analysis UI — input, loading, results
│   ├── ReportView.tsx            # Full structured report rendered from API response
│   └── Navbar.tsx                # Top nav with theme toggle
├── hooks/
│   └── useAnalysis.ts            # Custom hook: POST → poll → return result
├── store/
│   └── themeStore.ts             # Zustand store for light/dark theme switching
├── types/
│   └── analysis.ts               # TypeScript interfaces for all API response shapes
├── .env.local                    # PAGESPEED_API_KEY (never commit)
├── .env.example                  # Safe template to commit
└── README.md
```

---

## API Contract

### POST /api/analyze
**Request body:**
```json
{ "url": "https://example.com" }
```
**Response:**
```json
{ "jobId": "uuid-string", "status": "processing" }
```

### GET /api/results/:id
**Response (processing):**
```json
{ "status": "processing" }
```
**Response (complete):**
```json
{
  "status": "complete",
  "url": "https://example.com",
  "analyzedAt": "ISO timestamp",
  "scores": {
    "technical": 78,
    "onPage": 85,
    "performance": 62,
    "content": 70,
    "overall": 74
  },
  "meta": { ... },
  "headings": { ... },
  "images": { ... },
  "links": { ... },
  "technical": { ... },
  "content": { ... },
  "performance": { ... }
}
```

---

## Scoring System

Each category score is 0–100. Overall = weighted average.

| Category | Weight | Key Signals |
|---|---|---|
| Technical SEO | 25% | HTTPS, robots.txt, sitemap, canonical, redirects |
| On-Page SEO | 30% | Title length, meta description, H1 presence, OG tags |
| Performance | 20% | PageSpeed score, LCP, FID, CLS from PSI API |
| Content | 15% | Word count, heading hierarchy, keyword presence |
| Trust & Meta | 10% | OG image, Twitter card, structured data presence |

Deductions are additive — each failed check subtracts a fixed number of points from that category's base of 100.

---

## Environment Variables

```env
# .env.local
PAGESPEED_API_KEY=your_google_pagespeed_api_key_here
```

Get a free key at: https://developers.google.com/speed/docs/insights/v5/get-started

---

## Key Constraints & Decisions

- **No database.** Job results live in a server-side `Map`. Sufficient for an assessment; note this in README as a known limitation with a suggested upgrade path (Redis/Upstash).
- **No Woorank API.** All analysis is custom-built using open-source libraries only.
- **CORS solved by server-side fetch.** axios in API routes fetches target URLs from the server, not the browser.
- **Lighthouse replaced by PageSpeed Insights API.** Lighthouse CLI is incompatible with Vercel serverless functions. PSI API returns equivalent Core Web Vitals data and is explicitly free.
- **robots.txt respect.** Before crawling, the crawler checks `{domain}/robots.txt` and aborts with a clear error if the user-agent is disallowed.
- **Rate limiting.** A simple per-IP check (using request headers) prevents abuse.
- **Error handling.** Unreachable URLs, 404s, bot-blocked sites all return structured error responses, never raw crashes.