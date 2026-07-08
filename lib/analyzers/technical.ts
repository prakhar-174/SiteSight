import { TechnicalAnalysis, AuditItem } from '../../types/analysis';
import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Analyzes technical SEO signals such as HTTPS, robots.txt, sitemap.xml, canonical tags, and redirects.
 * Note: robots.txt is assumed to exist if the crawler reached here without error, but we can verify it.
 * 
 * @param $ - The loaded Cheerio instance representing the parsed HTML.
 * @param url - The original URL requested by the user.
 * @param finalUrl - The final URL after any redirects.
 * @returns A promise that resolves to TechnicalAnalysis and structured audit items.
 */
export async function analyzeTechnical(
  $: ReturnType<typeof cheerio.load>, 
  url: string, 
  finalUrl: string
): Promise<{ technical: TechnicalAnalysis, auditItems: AuditItem[] }> {
  
  const auditItems: AuditItem[] = [];
  const technical: TechnicalAnalysis = {
    https: false,
    robotsTxt: false,
    sitemap: false,
    canonical: false
  };

  let origin = '';
  try {
    const parsedFinalUrl = new URL(finalUrl);
    origin = parsedFinalUrl.origin;
    technical.https = parsedFinalUrl.protocol === 'https:';
  } catch (_e) {
    technical.https = false;
  }

  // 1. HTTPS Check
  if (technical.https) {
    auditItems.push({ status: 'pass', label: 'HTTPS', detail: 'Website uses secure HTTPS protocol.' });
  } else {
    auditItems.push({ status: 'fail', label: 'HTTPS', detail: 'Website does not use HTTPS. This is a negative ranking factor.' });
  }

  // 2. robots.txt Check
  try {
    const robotsRes = await axios.get(`${origin}/robots.txt`, { timeout: 3000 });
    technical.robotsTxt = robotsRes.status === 200;
  } catch (_e) {
  }

  if (technical.robotsTxt) {
    auditItems.push({ status: 'pass', label: 'robots.txt', detail: 'robots.txt file is present.' });
  } else {
    auditItems.push({ status: 'warn', label: 'robots.txt', detail: 'No robots.txt file found at the root domain.' });
  }

  // 3. sitemap.xml Check
  try {
    const sitemapRes = await axios.get(`${origin}/sitemap.xml`, { timeout: 3000 });
    technical.sitemap = sitemapRes.status === 200;
  } catch (_e) {
  }

  if (technical.sitemap) {
    auditItems.push({ status: 'pass', label: 'XML Sitemap', detail: 'sitemap.xml file is present.' });
  } else {
    auditItems.push({ status: 'fail', label: 'XML Sitemap', detail: 'No sitemap.xml found at the standard root location.' });
  }

  // 4. Canonical Tag Check
  const canonical = $('link[rel="canonical"]').attr('href');
  technical.canonical = !!canonical;

  if (technical.canonical) {
    auditItems.push({ status: 'pass', label: 'Canonical Tag', detail: `Canonical tag points to: ${canonical}` });
  } else {
    auditItems.push({ status: 'warn', label: 'Canonical Tag', detail: 'Missing canonical tag. This can cause duplicate content issues.' });
  }

  // 5. Redirect Check
  if (url !== finalUrl) {
    auditItems.push({ status: 'warn', label: 'Redirects', detail: `The requested URL redirected to ${finalUrl}.` });
  } else {
    auditItems.push({ status: 'pass', label: 'Redirects', detail: 'No redirects detected.' });
  }

  return { technical, auditItems };
}
