import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createJob, updateJob } from '../../../lib/jobStore';
import { crawlUrl } from '../../../lib/crawler';
import { analyzeMeta } from '../../../lib/analyzers/meta';
import { analyzeHeadings } from '../../../lib/analyzers/headings';
import { analyzeImages } from '../../../lib/analyzers/images';
import { analyzeLinks } from '../../../lib/analyzers/links';
import { analyzeTechnical } from '../../../lib/analyzers/technical';
import { analyzeContent } from '../../../lib/analyzers/content';
import { getPageSpeedData } from '../../../lib/pageSpeed';
import { calculateScores } from '../../../lib/scorer';
import * as cheerio from 'cheerio';

/**
 * POST /api/analyze
 * Next.js App Router Route Handler.
 * Initiates an SEO analysis job asynchronously and returns a job ID immediately.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;

    // Validate URL existence and format
    if (!url) {
      return NextResponse.json({ error: 'URL is required.' }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        throw new Error();
      }
    } catch {
      return NextResponse.json({ error: 'Invalid URL format. Please provide a full URL including http:// or https://' }, { status: 400 });
    }

    // Generate unique job ID and initialize job
    const jobId = uuidv4();
    createJob(jobId);

    // Fire and forget: Start analysis asynchronously without awaiting
    runAnalysisPipeline(jobId, url).catch((error) => {
      console.error(`Analysis Pipeline Error for Job ${jobId}:`, error);
      updateJob(jobId, { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'An unknown error occurred during analysis.' 
      });
    });

    // Return 202 Accepted immediately with the job ID
    return NextResponse.json({ jobId, status: 'processing' }, { status: 202 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request.' }, { status: 500 });
  }
}

/**
 * Asynchronously orchestrates the entire SEO analysis pipeline.
 */
async function runAnalysisPipeline(jobId: string, url: string) {
  // 1. Crawl
  const crawlResult = await crawlUrl(url);
  const { html, finalUrl } = crawlResult;
  
  const parsedFinalUrl = new URL(finalUrl);
  const origin = parsedFinalUrl.origin;

  // 2. Parse HTML
  const $ = cheerio.load(html);

  // 3. Run Analyzers
  const metaResult = analyzeMeta($);
  const headingsResult = analyzeHeadings($);
  const imagesResult = analyzeImages($);
  const linksResult = analyzeLinks($, origin);
  const technicalResult = await analyzeTechnical($, url, finalUrl);
  const contentResult = analyzeContent($, headingsResult.headings);

  // PageSpeed is a long-running external API call
  const pageSpeedResult = await getPageSpeedData(finalUrl);

  // 4. Calculate Scores
  const scores = calculateScores({
    meta: metaResult.auditItems,
    headings: headingsResult.auditItems,
    images: imagesResult.auditItems,
    links: linksResult.auditItems,
    technical: technicalResult.auditItems,
    content: contentResult.auditItems,
    performance: pageSpeedResult.auditItems
  });

  // 5. Build final result and update job status
  const analyzedAt = new Date().toISOString();
  
  updateJob(jobId, {
    status: 'complete',
    result: {
      status: 'complete',
      url: finalUrl,
      analyzedAt,
      scores,
      meta: metaResult.meta,
      headings: headingsResult.headings,
      images: imagesResult.images,
      links: linksResult.links,
      technical: technicalResult.technical,
      content: contentResult.content,
      performance: pageSpeedResult.performance,
      items: {
        meta: metaResult.auditItems,
        headings: headingsResult.auditItems,
        images: imagesResult.auditItems,
        links: linksResult.auditItems,
        technical: technicalResult.auditItems,
        content: contentResult.auditItems,
        performance: pageSpeedResult.auditItems
      }
    }
  });
}
