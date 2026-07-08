# SiteSight Scoring System

This document outlines the internal scoring logic used by SiteSight to evaluate websites. The system combines five distinct SEO pillars into a single weighted score out of 100.

## Overall Score Calculation

The overall score is a weighted average of 5 categories:

- **Technical SEO**: 25%
- **On-Page SEO**: 30%
- **Performance**: 20%
- **Content & Links**: 15%
- **Trust & Security**: 10%

Each category starts at **100 points**. For every check that returns a `warn` (warning) or `fail` (error), points are deducted from that specific category's score.

If a category's score drops below 0, it is capped at 0. The final overall score is the weighted sum of these category scores.

---

## Category Breakdown & Deductions

### 1. On-Page SEO (30% weight)
Analyzes `<title>`, `<meta>` tags, and `<h1>` through `<h6>` heading structure.

*   **Missing Title Tag (`<title>`)**: `-100 points` (Fail)
    *   *Why:* A missing title tag is disastrous for SEO and CTR.
*   **Missing Meta Description**: `-15 points` (Warn)
*   **Missing `<h1>` Tag**: `-20 points` (Fail)
*   **Multiple `<h1>` Tags**: `-10 points` (Warn)
    *   *Why:* Best practice is one distinct `<h1>` per page.
*   **Missing OpenGraph (`og:title`, `og:image`)**: `-10 points` (Warn)

### 2. Technical SEO (25% weight)
Evaluates canonicals, viewport settings, and semantic structure.

*   **Missing Viewport Meta Tag**: `-20 points` (Fail)
    *   *Why:* Without this, the site won't be responsive on mobile.
*   **Missing Canonical Link**: `-15 points` (Warn)
    *   *Why:* Can lead to duplicate content penalties.
*   **Missing Semantic HTML (`<main>`, `<header>`, `<footer>`)**: `-10 points` (Warn)

### 3. Performance (20% weight)
Powered by the Google PageSpeed Insights API, utilizing Core Web Vitals mobile metrics.

*   **LCP (Largest Contentful Paint)**:
    *   `> 4.0s` (Poor): `-20 points`
    *   `> 2.5s` (Needs Improvement): `-10 points`
*   **TBT (Total Blocking Time, proxy for FID)**:
    *   `> 600ms` (Poor): `-20 points`
    *   `> 200ms` (Needs Improvement): `-10 points`
*   **CLS (Cumulative Layout Shift)**:
    *   `> 0.25` (Poor): `-20 points`
    *   `> 0.1` (Needs Improvement): `-10 points`

*Note: The raw Google PageSpeed mobile score is also calculated but the deductions above ensure SiteSight remains strict on Core Web Vitals.*

### 4. Content & Links (15% weight)
Assesses the value of the page content, keyword stuffing, and link health.

*   **Low Word Count (< 300 words)**: `-15 points` (Warn)
    *   *Why:* Thin content struggles to rank for competitive keywords.
*   **Images Missing `alt` Attributes**: `-10 points` (Warn)
    *   *Why:* Critical for accessibility and Google Image search.
*   **Too Many Internal Links (> 150)**: `-5 points` (Warn)

### 5. Trust & Security (10% weight)
(This is intrinsically baked into the overall score; in the current iteration, this acts as a global multiplier or buffer depending on the use of HTTPS and robots.txt directives, handled at the crawler level).

---

## Example Walkthrough

Let's calculate the score for a website, `example.com`:

**1. On-Page SEO:**
- Missing Meta Description (-15)
- Multiple `<h1>` tags (-10)
- *Category Score:* 100 - 15 - 10 = **75**

**2. Technical SEO:**
- Missing Canonical Link (-15)
- *Category Score:* 100 - 15 = **85**

**3. Performance:**
- LCP is 3.0s (Needs Improvement) (-10)
- TBT is 150ms (Good) (0)
- CLS is 0.40 (Poor) (-20)
- *Category Score:* 100 - 10 - 20 = **70**

**4. Content & Links:**
- Missing `alt` tags on images (-10)
- *Category Score:* 100 - 10 = **90**

**5. Trust & Security:**
- Perfect score (100)

**Final Calculation:**
- On-Page (30%): 75 * 0.30 = 22.5
- Technical (25%): 85 * 0.25 = 21.25
- Performance (20%): 70 * 0.20 = 14
- Content (15%): 90 * 0.15 = 13.5
- Trust (10%): 100 * 0.10 = 10

**Overall Score:** 22.5 + 21.25 + 14 + 13.5 + 10 = **81 / 100**
