export type AuditStatus = 'pass' | 'warn' | 'fail';

export interface AuditItem {
  status: AuditStatus;
  label: string;
  detail: string;
  learnMore?: string;
}

export interface MetaAnalysis {
  title?: string;
  description?: string;
  ogImage?: string;
  twitterCard?: string;
  [key: string]: unknown;
}

export interface HeadingAnalysis {
  h1Count?: number;
  hierarchyValid?: boolean;
  [key: string]: unknown;
}

export interface ImageAnalysis {
  totalImages?: number;
  missingAlt?: number;
  [key: string]: unknown;
}

export interface LinkAnalysis {
  internal?: number;
  external?: number;
  broken?: number;
  [key: string]: unknown;
}

export interface TechnicalAnalysis {
  https?: boolean;
  robotsTxt?: boolean;
  sitemap?: boolean;
  canonical?: boolean;
  [key: string]: unknown;
}

export interface ContentAnalysis {
  wordCount?: number;
  readability?: string;
  [key: string]: unknown;
}

export interface PerformanceAnalysis {
  pageSpeedScore?: number;
  lcp?: string;
  fid?: string;
  cls?: string;
  [key: string]: unknown;
}

export interface ScoreBreakdown {
  technical: number;
  onPage: number;
  performance: number;
  content: number;
  overall: number;
}

export interface AnalysisResult {
  status: 'complete';
  url: string;
  analyzedAt: string;
  scores: ScoreBreakdown;
  meta: MetaAnalysis;
  headings: HeadingAnalysis;
  images: ImageAnalysis;
  links: LinkAnalysis;
  technical: TechnicalAnalysis;
  content: ContentAnalysis;
  performance: PerformanceAnalysis;
  items: {
    meta: AuditItem[];
    headings: AuditItem[];
    images: AuditItem[];
    links: AuditItem[];
    technical: AuditItem[];
    content: AuditItem[];
    performance: AuditItem[];
  };
}

export interface JobStatus {
  status: 'processing' | 'complete' | 'error';
  result?: AnalysisResult;
  error?: string;
}
