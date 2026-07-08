import { LinkAnalysis, AuditItem } from '../../types/analysis';
import * as cheerio from 'cheerio';

/**
 * Analyzes the anchor (<a>) tags on the page to count internal and external links.
 * 
 * @param $ - The loaded Cheerio instance representing the parsed HTML.
 * @param origin - The base origin URL (e.g. https://example.com) to differentiate internal vs external.
 * @returns A LinkAnalysis object containing link counts and structured audit items.
 */
export function analyzeLinks($: cheerio.CheerioAPI, origin: string): { links: LinkAnalysis, auditItems: AuditItem[] } {
  const auditItems: AuditItem[] = [];
  const links: LinkAnalysis = {
    internal: 0,
    external: 0
  };

  const anchorElements = $('a[href]');
  
  anchorElements.each((_, el) => {
    const href = $(el).attr('href') || '';
    
    // Basic detection for internal vs external
    if (href.startsWith('http://') || href.startsWith('https://')) {
      if (href.startsWith(origin)) {
        links.internal!++;
      } else {
        links.external!++;
      }
    } else if (href.startsWith('/') || href.startsWith('.') || href.startsWith('#')) {
       // Relative paths or anchor links are internal
       links.internal!++;
    } else if (!href.startsWith('mailto:') && !href.startsWith('tel:')) {
       // Other unknown relative formats
       links.internal!++;
    }
  });

  const totalLinks = (links.internal || 0) + (links.external || 0);

  if (links.internal === 0) {
    auditItems.push({ status: 'warn', label: 'Internal Links', detail: 'No internal links found on this page.' });
  } else {
    auditItems.push({ status: 'pass', label: 'Internal Links', detail: `Found ${links.internal} internal links.` });
  }

  if (totalLinks > 100) {
    auditItems.push({ status: 'warn', label: 'Link Volume', detail: `Found ${totalLinks} total links. Pages with too many links may appear spammy.` });
  } else {
    auditItems.push({ status: 'pass', label: 'Link Volume', detail: `Found ${totalLinks} total links (healthy volume).` });
  }

  return { links, auditItems };
}
