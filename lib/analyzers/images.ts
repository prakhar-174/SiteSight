import { ImageAnalysis, AuditItem } from '../../types/analysis';
import * as cheerio from 'cheerio';

/**
 * Analyzes image tags on the page for SEO best practices, primarily focusing on alt attributes.
 * 
 * @param $ - The loaded Cheerio instance representing the parsed HTML.
 * @returns An ImageAnalysis object containing total count, missing alt count, and structured audit items.
 */
export function analyzeImages($: ReturnType<typeof cheerio.load>): { images: ImageAnalysis, auditItems: AuditItem[] } {
  const auditItems: AuditItem[] = [];
  const images: ImageAnalysis = {
    totalImages: 0,
    missingAlt: 0
  };

  const imageElements = $('img');
  const missingAltExamples: string[] = [];

  imageElements.each((_, el) => {
    images.totalImages!++;
    
    // Alt attribute can be empty (alt=""), which is valid for decorative images. 
    // We check if the attribute is missing entirely.
    const altAttr = $(el).attr('alt');
    if (altAttr === undefined) {
      images.missingAlt!++;
      const src = $(el).attr('src') || 'unknown src';
      if (missingAltExamples.length < 3) {
        missingAltExamples.push(src);
      }
    }
  });

  if (images.totalImages === 0) {
    auditItems.push({ status: 'pass', label: 'Images', detail: 'No images found on page.' });
  } else if (images.missingAlt === 0) {
    auditItems.push({ status: 'pass', label: 'Image Alt Attributes', detail: `All ${images.totalImages} images have an alt attribute.` });
  } else {
    const examples = missingAltExamples.join(', ');
    auditItems.push({ 
      status: 'fail', 
      label: 'Image Alt Attributes', 
      detail: `${images.missingAlt} out of ${images.totalImages} images are missing alt attributes. Examples: ${examples}` 
    });
  }

  return { images, auditItems };
}
