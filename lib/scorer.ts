import { AuditItem, ScoreBreakdown } from '../types/analysis';

/**
 * Calculates the score for a specific category based on the audit items.
 * Starts at 100, deducts points for 'fail' and 'warn' items.
 * 
 * @param items - Array of AuditItem for a specific category.
 * @returns A score out of 100.
 */
function calculateCategoryScore(items: AuditItem[]): number {
  let score = 100;
  
  for (const item of items) {
    if (item.status === 'fail') {
      score -= 15; // Deduct more for failures
    } else if (item.status === 'warn') {
      score -= 5; // Deduct less for warnings
    }
  }

  // Floor at 0
  return Math.max(0, score);
}

/**
 * Aggregates results from all analyzers and calculates the overall weighted SEO score.
 * 
 * Weights defined in project context:
 * - Technical SEO: 25%
 * - On-Page SEO (Meta + Headings + Images + Links): 30%
 * - Performance: 20%
 * - Content: 15%
 * - Trust & Meta (Open Graph, Twitter Cards): 10%
 * 
 * Note: For this function we map the provided audit items into these 5 pillars.
 * 
 * @param categories - An object grouping audit items by analyzer.
 * @returns A ScoreBreakdown object containing individual category scores and the overall weighted score.
 */
export function calculateScores(categories: {
  meta: AuditItem[],
  headings: AuditItem[],
  images: AuditItem[],
  links: AuditItem[],
  technical: AuditItem[],
  content: AuditItem[],
  performance?: AuditItem[] // Performance might come later from PageSpeed API
}): ScoreBreakdown {
  
  // Group related audit items into the 5 primary scoring pillars
  
  // 1. Technical (HTTPS, robots.txt, sitemap, canonical, redirects)
  const technicalScore = calculateCategoryScore(categories.technical);

  // 2. On-Page (Title, Meta Desc, Headings, Images, Links)
  // We split some items from meta (OG tags go to Trust)
  const onPageItems = [
    ...categories.meta.filter(i => i.label === 'Title Tag' || i.label === 'Meta Description'),
    ...categories.headings,
    ...categories.images,
    ...categories.links
  ];
  const onPageScore = calculateCategoryScore(onPageItems);

  // 3. Content (Word count, readability)
  const contentScore = calculateCategoryScore(categories.content);

  // 4. Trust & Meta (Open Graph, Twitter Card)
  const trustItems = categories.meta.filter(i => i.label === 'Open Graph' || i.label === 'Twitter Card');
  const trustScore = calculateCategoryScore(trustItems);

  // 5. Performance
  // If performance items are not yet available, we can mock it or assume 100
  const performanceScore = categories.performance ? calculateCategoryScore(categories.performance) : 100;

  // Calculate overall weighted score
  const overall = (
    (technicalScore * 0.25) +
    (onPageScore * 0.30) +
    (performanceScore * 0.20) +
    (contentScore * 0.15) +
    (trustScore * 0.10)
  );

  return {
    technical: Math.round(technicalScore),
    onPage: Math.round(onPageScore),
    performance: Math.round(performanceScore),
    content: Math.round(contentScore),
    overall: Math.round(overall)
  };
}
