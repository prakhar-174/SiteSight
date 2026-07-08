import { ContentAnalysis, AuditItem, HeadingAnalysis } from '../../types/analysis';
import * as cheerio from 'cheerio';

/**
 * Analyzes the text content of the page for SEO metrics like word count and readability.
 * 
 * @param $ - The loaded Cheerio instance representing the parsed HTML.
 * @param headings - The heading analysis results to reuse hierarchy insights.
 * @returns A ContentAnalysis object and structured audit items.
 */
export function analyzeContent(
  $: cheerio.CheerioAPI,
  headings: HeadingAnalysis
): { content: ContentAnalysis, auditItems: AuditItem[] } {
  const auditItems: AuditItem[] = [];
  const content: ContentAnalysis = {};

  // Strip script and style tags to get clean text
  const bodyClone = $('body').clone();
  bodyClone.find('script, style, noscript, svg').remove();
  
  const rawText = bodyClone.text().replace(/\s+/g, ' ').trim();
  
  // 1. Word Count
  const wordCount = rawText.split(' ').filter(w => w.length > 0).length;
  content.wordCount = wordCount;

  if (wordCount < 300) {
    auditItems.push({ status: 'fail', label: 'Word Count', detail: `Low word count (${wordCount} words). Recommended minimum is 300 words.` });
  } else if (wordCount >= 300 && wordCount <= 600) {
    auditItems.push({ status: 'warn', label: 'Word Count', detail: `Fair word count (${wordCount} words). Consider adding more in-depth content.` });
  } else {
    auditItems.push({ status: 'pass', label: 'Word Count', detail: `Good word count (${wordCount} words).` });
  }

  // 2. Heading Hierarchy check reuse
  if (!headings.hierarchyValid) {
    auditItems.push({ status: 'warn', label: 'Content Structure', detail: 'Content heading structure is illogical and skips levels.' });
  } else {
    auditItems.push({ status: 'pass', label: 'Content Structure', detail: 'Content uses a logical heading structure.' });
  }

  // 3. Readability (Average Sentence Length)
  const sentences = rawText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = sentences.length;
  
  let readability = 'Unknown';
  if (sentenceCount > 0) {
    const avgSentenceLength = wordCount / sentenceCount;
    if (avgSentenceLength > 20) {
      readability = 'Hard to read (long sentences)';
      auditItems.push({ status: 'warn', label: 'Readability', detail: `Average sentence length is high (${avgSentenceLength.toFixed(1)} words/sentence).` });
    } else {
      readability = 'Good (optimal sentence length)';
      auditItems.push({ status: 'pass', label: 'Readability', detail: `Average sentence length is good (${avgSentenceLength.toFixed(1)} words/sentence).` });
    }
  } else {
    auditItems.push({ status: 'warn', label: 'Readability', detail: 'Could not detect clear sentences in the content.' });
  }
  
  content.readability = readability;

  return { content, auditItems };
}
