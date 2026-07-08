import axios from 'axios';
import { PerformanceAnalysis, AuditItem } from '../types/analysis';

/**
 * Calls the Google PageSpeed Insights API to get Core Web Vitals and performance scores.
 * 
 * @param url - The URL to analyze.
 * @returns A promise resolving to a PerformanceAnalysis object and AuditItems.
 */
export async function getPageSpeedData(url: string): Promise<{ performance: PerformanceAnalysis, auditItems: AuditItem[] }> {
  const auditItems: AuditItem[] = [];
  const performance: PerformanceAnalysis = {
    pageSpeedScore: 0,
    lcp: 'N/A',
    fid: 'N/A', // Using TBT as proxy
    cls: 'N/A'
  };

  const apiKey = process.env.PAGESPEED_API_KEY;

  if (!apiKey) {
    auditItems.push({
      status: 'warn',
      label: 'Performance Analysis',
      detail: 'PageSpeed API key not configured. Performance metrics were skipped.'
    });
    return { performance, auditItems };
  }

  try {
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile&key=${apiKey}`;
    const response = await axios.get(apiUrl, { timeout: 45000 }); // PSI can be slow, 45s timeout
    
    const lighthouseResult = response.data?.lighthouseResult;
    if (!lighthouseResult) {
      throw new Error('Invalid response from PageSpeed API');
    }

    // 1. Performance Score (0-100)
    const score = lighthouseResult.categories?.performance?.score;
    performance.pageSpeedScore = score !== undefined ? Math.round(score * 100) : 0;

    // 2. LCP (Largest Contentful Paint)
    const lcpMetric = lighthouseResult.audits?.['largest-contentful-paint'];
    const lcpValueStr = lcpMetric?.displayValue || 'N/A';
    const lcpNumeric = lcpMetric?.numericValue; // typically in milliseconds

    performance.lcp = lcpValueStr;

    if (lcpNumeric) {
      const lcpSecs = lcpNumeric / 1000;
      if (lcpSecs <= 2.5) {
        auditItems.push({ status: 'pass', label: 'LCP (Largest Contentful Paint)', detail: `${lcpValueStr} (Good: ≤2.5s)` });
      } else if (lcpSecs <= 4.0) {
        auditItems.push({ status: 'warn', label: 'LCP (Largest Contentful Paint)', detail: `${lcpValueStr} (Needs Improvement: ≤4.0s)` });
      } else {
        auditItems.push({ status: 'fail', label: 'LCP (Largest Contentful Paint)', detail: `${lcpValueStr} (Poor: >4.0s)` });
      }
    }

    // 3. TBT / FID Proxy (Total Blocking Time)
    const tbtMetric = lighthouseResult.audits?.['total-blocking-time'];
    const tbtValueStr = tbtMetric?.displayValue || 'N/A';
    const tbtNumeric = tbtMetric?.numericValue; // ms

    performance.fid = tbtValueStr;

    if (tbtNumeric !== undefined) {
      if (tbtNumeric <= 200) {
        auditItems.push({ status: 'pass', label: 'TBT (Total Blocking Time)', detail: `${tbtValueStr} (Good: ≤200ms)` });
      } else if (tbtNumeric <= 600) {
        auditItems.push({ status: 'warn', label: 'TBT (Total Blocking Time)', detail: `${tbtValueStr} (Needs Improvement: ≤600ms)` });
      } else {
        auditItems.push({ status: 'fail', label: 'TBT (Total Blocking Time)', detail: `${tbtValueStr} (Poor: >600ms)` });
      }
    }

    // 4. CLS (Cumulative Layout Shift)
    const clsMetric = lighthouseResult.audits?.['cumulative-layout-shift'];
    const clsValueStr = clsMetric?.displayValue || 'N/A';
    const clsNumeric = clsMetric?.numericValue;

    performance.cls = clsValueStr;

    if (clsNumeric !== undefined) {
      if (clsNumeric <= 0.1) {
        auditItems.push({ status: 'pass', label: 'CLS (Cumulative Layout Shift)', detail: `${clsNumeric.toFixed(3)} (Good: ≤0.1)` });
      } else if (clsNumeric <= 0.25) {
        auditItems.push({ status: 'warn', label: 'CLS (Cumulative Layout Shift)', detail: `${clsNumeric.toFixed(3)} (Needs Improvement: ≤0.25)` });
      } else {
        auditItems.push({ status: 'fail', label: 'CLS (Cumulative Layout Shift)', detail: `${clsNumeric.toFixed(3)} (Poor: >0.25)` });
      }
    }

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('PageSpeed API Error:', msg);
    auditItems.push({
      status: 'fail',
      label: 'Performance Analysis',
      detail: 'Failed to fetch PageSpeed insights data. The request might have timed out.'
    });
  }

  return { performance, auditItems };
}
