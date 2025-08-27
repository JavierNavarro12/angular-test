// Interfaces para análisis web

export interface WebAnalysisRequest {
  url: string;
  strategy?: 'mobile' | 'desktop';
}

export interface LighthouseScore {
  performance: number;
  accessibility: number;
  'best-practices': number;
  seo: number;
  pwa: number;
}

export interface CoreWebVitals {
  lcp: {
    score: number;
    value: number;
    unit: string;
  };
  fid: {
    score: number;
    value: number;
    unit: string;
  };
  cls: {
    score: number;
    value: number;
    unit: string;
  };
}

export interface PageMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  speedIndex: number;
  totalSize: number;
  requestsCount: number;
}

export interface SEOMetrics {
  title: string;
  metaDescription: string;
  h1Count: number;
  h2Count: number;
  imagesWithoutAlt: number;
  linksWithoutHref: number;
  canonicalUrl: string;
  robotsMeta: string;
}

export interface SecurityMetrics {
  httpsEnabled: boolean;
  hasSecurityHeaders: boolean;
  mixedContent: boolean;
  sslCertificateValid: boolean;
}

export interface MobileMetrics {
  isMobileFriendly: boolean;
  viewportConfigured: boolean;
  fontSizeReadable: boolean;
  tapTargetsAppropriate: boolean;
}

export interface WebAnalysisResult {
  url: string;
  timestamp: Date;
  lighthouse: LighthouseScore;
  coreWebVitals: CoreWebVitals;
  pageMetrics: PageMetrics;
  seoMetrics: SEOMetrics;
  securityMetrics: SecurityMetrics;
  mobileMetrics: MobileMetrics;
  status: 'success' | 'error';
  errorMessage?: string;
}

export interface AnalysisSummary {
  overallScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  keyIssues: string[];
  recommendations: string[];
}

export interface ComparisonData {
  current: WebAnalysisResult;
  previous?: WebAnalysisResult;
  improvements: string[];
  regressions: string[];
}
