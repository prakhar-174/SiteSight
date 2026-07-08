# SiteSight

Your Website's SEO, Laid Bare in 30 Seconds. SiteSight is a powerful, modern, and lightning-fast SEO auditing tool that scrapes, analyzes, and grades any public URL across 40+ vital ranking factors including On-Page SEO, Technical health, and Core Web Vitals.

### Live Demo
[Vercel Deployment URL will be added here]

## Tech Stack

| Technology | Purpose |
| --- | --- |
| **Next.js 16 (App Router)** | Full-stack framework (React frontend + Node backend) |
| **Tailwind CSS** | Utility-first styling & layout |
| **Framer Motion** | Micro-animations and scroll reveals |
| **Zustand** | Global state management (Theme Store) |
| **Axios & Cheerio** | Server-side crawling and DOM parsing |
| **Google PageSpeed API** | Core Web Vitals & performance auditing |

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/prakhar-174/SiteSight.git
   cd sitesight
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Rename `.env.example` to `.env.local` and add your Google API Key:
   ```bash
   PAGESPEED_API_KEY=your_google_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

## Environment Variables

- `PAGESPEED_API_KEY`: A Google Cloud API Key with access to the PageSpeed Insights API. Used to calculate real-world Core Web Vitals (LCP, TBT, CLS). If omitted, the app will gracefully bypass performance scoring and issue a warning.

## Project Structure

```text
sitesight/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts       # POST route to start job
│   │   └── results/[id]/route.ts  # GET route to poll job
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css                # CSS variables & theme setup
├── components/
│   ├── ui/                        # Reusable base components (Gauge, AuditItem, Marquee)
│   ├── sections/                  # Landing page sections (Hero, HowItWorks, etc.)
│   ├── Navbar.tsx
│   ├── ReportView.tsx
│   └── ErrorBoundary.tsx
├── hooks/
│   └── useAnalysis.ts             # Orchestrates API polling loop
├── lib/
│   ├── crawler.ts                 # Axios + robots.txt validation
│   ├── scorer.ts                  # Calculates weighted SEO scores
│   ├── pageSpeed.ts               # Google API integration
│   ├── jobStore.ts                # In-memory async job queue
│   └── analyzers/                 # Cheerio parsing logic (meta, technical, etc.)
├── store/
│   └── themeStore.ts              # Zustand dark/light mode
└── types/
    └── analysis.ts                # Strict TypeScript interfaces
```

## API Documentation

### `POST /api/analyze`
Initiates an asynchronous SEO audit job.
**Request:**
```json
{ "url": "https://example.com" }
```
**Response (202 Accepted):**
```json
{
  "jobId": "uuid-v4-string",
  "status": "processing"
}
```

### `GET /api/results/:id`
Polls for the result of an ongoing job.
**Response (200 OK - Processing):**
```json
{ "status": "processing" }
```
**Response (200 OK - Complete):**
```json
{
  "status": "complete",
  "result": {
    "url": "https://example.com",
    "scores": { "overall": 81, "technical": 85, ... },
    "items": { "meta": [...], "performance": [...] }
  }
}
```

## SEO Scoring System

SiteSight uses a weighted deduction system out of 100 points. 
For a complete, in-depth breakdown of every rule, penalty, and calculation logic, please read [SCORING.md](./SCORING.md).

## Backend Architecture

```text
[ Client (Hero form) ] --(POST url)--> [ /api/analyze ]
                                          |
                                    [ JobStore (pending) ]
                                          |
                                    [ Crawler (Axios) ] --> Respects robots.txt
                                          |
                                    [ Cheerio Analyzers ] + [ PageSpeed API ]
                                          |
                                    [ Scorer ]
                                          |
                                    [ JobStore (complete) ]
                                          ^
[ Client (useAnalysis)] --(GET /id)-- (Polling every 1.5s)
```
**Stateless Design Choice:**
To ensure a snappy UX and avoid Vercel serverless function timeouts (which default to 10s on hobby plans), the analysis pipeline is decoupled from the HTTP request. It utilizes a "Fire-and-Forget" asynchronous architecture.
*Note on Limitations:* The current `jobStore.ts` uses an in-memory Node.js `Map`. Because serverless functions can spin up across different instances, in-memory polling may occasionally fail in high-traffic Vercel environments. The production upgrade path is to seamlessly swap `lib/jobStore.ts` with Upstash Redis.

## Security Measures
- **SSRF Prevention:** Rejecting localhost and private IPs in the crawler.
- **Strict Rate Limiting:** Enforcing an IP-based limit (5 reqs/min).
- **Resource Protection:** 5MB max payload size and enforced `text/html` limits on Axios.
- **Security Headers:** Enforcing `X-Content-Type-Options`, `X-Frame-Options`, and strict `Referrer-Policy` via `next.config.ts`.
- **React Error Boundaries:** Safely trapping UI crashes to gracefully recover.

---

### Developer Note
This is my first Next.js project, built as a full-stack expansion from a React frontend background. The architecture decisions were made deliberately: Next.js App Router for unified deployment, in-memory job state with a documented upgrade path, and PageSpeed Insights API as a production-grade replacement for Lighthouse CLI in serverless environments.
