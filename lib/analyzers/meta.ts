import { MetaAnalysis, AuditItem } from '../../types/analysis';
import * as cheerio from 'cheerio';

/**
 * Analyzes the meta tags of a webpage.
 * Checks for title tag, meta description, Open Graph tags, and Twitter Card.
 * 
 * @param $ - The loaded Cheerio instance representing the parsed HTML.
 * @returns A MetaAnalysis object containing the extracted data and structured audit items.
 */
export function analyzeMeta($: ReturnType<typeof cheerio.load>): { meta: MetaAnalysis, auditItems: AuditItem[] } {
  const auditItems: AuditItem[] = [];
  const meta: MetaAnalysis = {};

  // 1. Title Tag
  const title = $('title').text().trim();
  meta.title = title;
  
  if (!title) {
    auditItems.push({
      status: 'fail',
      label: 'Title Tag',
      detail: 'Missing title tag.'
    });
  } else if (title.length >= 10 && title.length <= 60) {
    auditItems.push({
      status: 'pass',
      label: 'Title Tag',
      detail: `Good length (${title.length} characters).`
    });
  } else if (title.length > 60 && title.length <= 70) {
    auditItems.push({
      status: 'warn',
      label: 'Title Tag',
      detail: `Slightly long (${title.length} characters). Optimal is 10-60.`
    });
  } else {
    auditItems.push({
      status: 'fail',
      label: 'Title Tag',
      detail: `Suboptimal length (${title.length} characters).`
    });
  }

  // 2. Meta Description
  const description = $('meta[name="description"]').attr('content')?.trim();
  meta.description = description;

  if (!description) {
    auditItems.push({
      status: 'fail',
      label: 'Meta Description',
      detail: 'Missing meta description.'
    });
  } else if (description.length >= 50 && description.length <= 160) {
    auditItems.push({
      status: 'pass',
      label: 'Meta Description',
      detail: `Good length (${description.length} characters).`
    });
  } else {
    auditItems.push({
      status: 'warn',
      label: 'Meta Description',
      detail: `Suboptimal length (${description.length} characters). Optimal is 50-160.`
    });
  }

  // 3. Open Graph Tags
  const ogTitle = $('meta[property="og:title"]').attr('content');
  const ogDescription = $('meta[property="og:description"]').attr('content');
  const ogImage = $('meta[property="og:image"]').attr('content');
  
  meta.ogTitle = ogTitle;
  meta.ogDescription = ogDescription;
  meta.ogImage = ogImage;

  if (ogTitle && ogDescription && ogImage) {
    auditItems.push({ status: 'pass', label: 'Open Graph', detail: 'Essential OG tags are present.' });
  } else if (ogTitle || ogDescription || ogImage) {
    auditItems.push({ status: 'warn', label: 'Open Graph', detail: 'Some OG tags are missing.' });
  } else {
    auditItems.push({ status: 'fail', label: 'Open Graph', detail: 'Missing all OG tags.' });
  }

  // 4. Twitter Card
  const twitterCard = $('meta[name="twitter:card"]').attr('content');
  meta.twitterCard = twitterCard;

  if (twitterCard) {
    auditItems.push({ status: 'pass', label: 'Twitter Card', detail: 'Twitter card meta tag is present.' });
  } else {
    auditItems.push({ status: 'warn', label: 'Twitter Card', detail: 'Missing Twitter card meta tag.' });
  }

  return { meta, auditItems };
}
