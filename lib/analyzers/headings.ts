import { HeadingAnalysis, AuditItem } from '../../types/analysis';
import * as cheerio from 'cheerio';

/**
 * Analyzes heading tags (H1-H6) for logical structure and SEO best practices.
 * 
 * @param $ - The loaded Cheerio instance representing the parsed HTML.
 * @returns A HeadingAnalysis object containing counts, hierarchy validity, and structured audit items.
 */
export function analyzeHeadings($: ReturnType<typeof cheerio.load>): { headings: HeadingAnalysis, auditItems: AuditItem[] } {
  const auditItems: AuditItem[] = [];
  const headings: HeadingAnalysis = {
    h1Count: 0,
    hierarchyValid: true
  };

  // Extract all headings in document order
  const headingElements = $('h1, h2, h3, h4, h5, h6');
  
  let h1Count = 0;
  let previousLevel = 0;
  let hierarchyValid = true;
  let h2BeforeH1 = false;

  headingElements.each((_, el) => {
    if (el.type !== 'tag') return;
    const tagName = (el as { tagName: string }).tagName.toLowerCase();
    const level = parseInt(tagName.replace('h', ''), 10);

    if (level === 1) h1Count++;
    if (level === 2 && h1Count === 0) h2BeforeH1 = true;

    // Check logical hierarchy: level shouldn't jump by more than 1 (e.g. h1 -> h3 is bad)
    if (previousLevel > 0 && level - previousLevel > 1) {
      hierarchyValid = false;
    }
    
    previousLevel = level;
  });

  headings.h1Count = h1Count;
  headings.hierarchyValid = hierarchyValid;

  // Audit H1 tag
  if (h1Count === 0) {
    auditItems.push({ status: 'fail', label: 'H1 Tag', detail: 'No H1 tag found. Pages should have exactly one H1.' });
  } else if (h1Count === 1) {
    auditItems.push({ status: 'pass', label: 'H1 Tag', detail: 'Exactly one H1 tag found.' });
  } else {
    auditItems.push({ status: 'fail', label: 'H1 Tag', detail: `Found ${h1Count} H1 tags. Pages should have exactly one H1.` });
  }

  // Audit heading order
  if (h2BeforeH1) {
    auditItems.push({ status: 'warn', label: 'Heading Order', detail: 'An H2 tag appears before the H1 tag.' });
  }

  // Audit hierarchy
  if (!hierarchyValid) {
    auditItems.push({ status: 'warn', label: 'Heading Hierarchy', detail: 'Skipped heading levels (e.g., jumping from H1 to H3).' });
  } else {
    auditItems.push({ status: 'pass', label: 'Heading Hierarchy', detail: 'Logical heading structure maintained.' });
  }

  return { headings, auditItems };
}
