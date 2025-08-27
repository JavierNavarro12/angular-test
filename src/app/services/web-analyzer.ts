import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface WebAnalysisResult {
  url: string;
  basicInfo: {
    title: string;
    description: string;
    statusCode: number;
    responseTime: number;
    contentLength: number;
    lastModified?: string;
  };
  performance: {
    pageSpeedScore: number;
    coreWebVitals: {
      lcp: number; // Largest Contentful Paint
      fid: number; // First Input Delay
      cls: number; // Cumulative Layout Shift
    };
    lighthouse: {
      performance: number;
      accessibility: number;
      bestPractices: number;
      seo: number;
    };
  };
  seo: {
    metaTags: {
      title: string;
      description: string;
      keywords: string[];
      ogTags: { [key: string]: string };
    };
    headings: {
      h1: number;
      h2: number;
      h3: number;
    };
    images: {
      total: number;
      withAlt: number;
      withoutAlt: number;
    };
  };
  technical: {
    serverInfo: {
      server: string;
      technology: string[];
    };
    security: {
      ssl: boolean;
      securityHeaders: { [key: string]: string };
    };
    mobile: {
      viewport: boolean;
      mobileFriendly: boolean;
    };
  };
  links: {
    total: number;
    internal: number;
    external: number;
    broken: number;
  };
  analyzedAt: Date;
}

export interface PageSpeedResult {
  lighthouseResult: {
    categories: {
      performance: { score: number };
      accessibility: { score: number };
      'best-practices': { score: number };
      seo: { score: number };
    };
    audits: {
      'largest-contentful-paint': { numericValue: number };
      'first-input': { numericValue: number };
      'cumulative-layout-shift': { numericValue: number };
      'speed-index': { numericValue: number };
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class WebAnalyzerService {
  private readonly PAGE_SPEED_API_URL = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

  constructor(private http: HttpClient) {}

  analyzeWebsite(url: string): Observable<WebAnalysisResult> {
    // Validar URL
    if (!this.isValidUrl(url)) {
      return throwError(() => new Error('URL inválida'));
    }

    const cleanUrl = this.cleanUrl(url);

    // Ejecutar análisis en paralelo
    const pageSpeedMobile$ = this.getPageSpeedInsights(cleanUrl, 'mobile');
    const pageSpeedDesktop$ = this.getPageSpeedInsights(cleanUrl, 'desktop');
    const basicInfo$ = this.getBasicInfo(cleanUrl);

    return forkJoin({
      mobile: pageSpeedMobile$,
      desktop: pageSpeedDesktop$,
      basic: basicInfo$
    }).pipe(
      map(results => this.combineResults(cleanUrl, results.mobile, results.desktop, results.basic)),
      catchError(this.handleError)
    );
  }

  private getPageSpeedInsights(url: string, strategy: 'mobile' | 'desktop'): Observable<PageSpeedResult> {
    const apiKey = environment.googlePageSpeedApiKey;

    if (!apiKey || apiKey === '') {
      console.warn('⚠️ No Google PageSpeed API key configured, using mock data');
      return this.getMockPageSpeedData(strategy);
    }

    // 🔥 Crear URL completa con parámetros de categoría
    let requestUrl = `${this.PAGE_SPEED_API_URL}?url=${encodeURIComponent(url)}&strategy=${strategy}&key=${apiKey}`;

    // Agregar cada categoría como parámetro separado
    ['performance', 'accessibility', 'best-practices', 'seo'].forEach(category => {
      requestUrl += `&category=${category}`;
    });

    console.log(`🔍 Fetching PageSpeed data for ${strategy} strategy:`, url);
    console.log(`🔑 Using API key: ${apiKey.substring(0, 10)}...`);
    console.log(`📋 Requesting categories: performance, accessibility, best-practices, seo`);
    console.log(`🌐 Full request URL:`, requestUrl);

    return this.http.get<PageSpeedResult>(requestUrl).pipe(
      catchError(error => {
        console.warn(`❌ PageSpeed API failed for ${strategy}:`, error);
        console.log(`📊 Using mock data for ${strategy} strategy`);
        // Retornar datos mock si la API falla
        return this.getMockPageSpeedData(strategy);
      })
    );
  }

  private getBasicInfo(url: string): Observable<any> {
    return this.http.get(url, {
      observe: 'response',
      responseType: 'text'
    }).pipe(
      map(response => ({
        statusCode: response.status,
        headers: response.headers,
        body: response.body
      })),
      catchError(error => {
        console.warn('Basic info fetch error:', error);
        return this.getMockBasicInfo();
      })
    );
  }

  private combineResults(url: string, mobile: PageSpeedResult, desktop: PageSpeedResult, basic: any): WebAnalysisResult {
    // Debug logging to understand what's happening
    console.log('Mobile result:', mobile);
    console.log('Desktop result:', desktop);

    // Combine categories from both mobile and desktop results
    const mobileCategories = mobile.lighthouseResult?.categories || {};
    const desktopCategories = desktop.lighthouseResult?.categories || {};

    console.log('📱 Mobile categories:', Object.keys(mobileCategories));
    console.log('🖥️ Desktop categories:', Object.keys(desktopCategories));
    console.log('Mobile categories details:', mobileCategories);
    console.log('Desktop categories details:', desktopCategories);

    // 🔥 Merge categories, preferring desktop scores when available, fallback to mobile, then mock
    const lighthouse = {
      performance: desktopCategories.performance || mobileCategories.performance,
      accessibility: desktopCategories.accessibility || mobileCategories.accessibility || this.getMockCategoryScore('accessibility'),
      'best-practices': desktopCategories['best-practices'] || mobileCategories['best-practices'] || this.getMockCategoryScore('best-practices'),
      seo: desktopCategories.seo || mobileCategories.seo || this.getMockCategoryScore('seo')
    };

    // Use mobile audits as they're typically more comprehensive for Core Web Vitals
    const audits = mobile.lighthouseResult?.audits || desktop.lighthouseResult?.audits;

    console.log('🔄 Combined lighthouse categories:', lighthouse);
    console.log('Available categories after merge:', Object.keys(lighthouse).filter(key => (lighthouse as any)[key] !== undefined));

    // 🔥 Detectar si se usaron datos mock para algunas categorías
    const usedMockCategories = ['accessibility', 'best-practices', 'seo'].filter(
      cat => !(desktopCategories as any)[cat] && !(mobileCategories as any)[cat]
    );

    if (usedMockCategories.length > 0) {
      console.warn(`⚠️ Used mock data for categories: ${usedMockCategories.join(', ')}`);
      console.log('💡 This happens when Google PageSpeed API limits category responses');
    }

    console.log('Selected audits:', audits);

    return {
      url,
      basicInfo: {
        title: this.extractTitle(basic.body) || 'Título no encontrado',
        description: this.extractDescription(basic.body) || 'Descripción no encontrada',
        statusCode: basic.statusCode || 200,
        responseTime: 0, // Calcular basado en el tiempo de respuesta real
        contentLength: basic.body?.length || 0,
        lastModified: basic.headers?.get('last-modified') || undefined
      },
      performance: {
        pageSpeedScore: lighthouse?.performance?.score ?
          Math.round(lighthouse.performance.score * 100) :
          Math.round(((mobile.lighthouseResult?.categories?.performance?.score || 0) + (desktop.lighthouseResult?.categories?.performance?.score || 0)) / 2 * 100),
        coreWebVitals: {
          lcp: (audits?.['largest-contentful-paint']?.numericValue || 0) / 1000,
          fid: audits?.['first-input']?.numericValue || 0,
          cls: audits?.['cumulative-layout-shift']?.numericValue || 0
        },
        lighthouse: {
          performance: Math.round((lighthouse?.performance?.score || 0) * 100),
          accessibility: Math.round((lighthouse?.accessibility?.score || 0) * 100),
          bestPractices: Math.round((lighthouse?.['best-practices']?.score || 0) * 100),
          seo: Math.round((lighthouse?.seo?.score || 0) * 100)
        }
      },
      seo: {
        metaTags: this.extractMetaTags(basic.body),
        headings: this.extractHeadings(basic.body),
        images: this.extractImages(basic.body)
      },
      technical: {
        serverInfo: {
          server: basic.headers?.get('server') || 'Desconocido',
          technology: this.detectTechnology(basic.headers, basic.body)
        },
        security: {
          ssl: url.startsWith('https'),
          securityHeaders: this.extractSecurityHeaders(basic.headers)
        },
        mobile: {
          viewport: this.hasViewport(basic.body),
          mobileFriendly: true // Simplificado
        }
      },
      links: {
        total: this.extractLinks(basic.body).length,
        internal: 0, // Calcular basado en el dominio
        external: 0, // Calcular basado en el dominio
        broken: 0 // Requeriría análisis adicional
      },
      analyzedAt: new Date()
    };
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private cleanUrl(url: string): string {
    if (!url.startsWith('http')) {
      return `https://${url}`;
    }
    return url;
  }

  private extractTitle(html: string): string {
    const match = html?.match(/<title[^>]*>([^<]+)<\/title>/i);
    return match ? match[1] : '';
  }

  private extractDescription(html: string): string {
    const match = html?.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    return match ? match[1] : '';
  }

  private extractMetaTags(html: string): WebAnalysisResult['seo']['metaTags'] {
    return {
      title: this.extractTitle(html),
      description: this.extractDescription(html),
      keywords: this.extractKeywords(html),
      ogTags: this.extractOgTags(html)
    };
  }

  private extractKeywords(html: string): string[] {
    const match = html?.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    return match ? match[1].split(',').map(k => k.trim()) : [];
  }

  private extractOgTags(html: string): { [key: string]: string } {
    const ogTags: { [key: string]: string } = {};
    const regex = /<meta[^>]*property=["']og:([^"']+)["'][^>]*content=["']([^"']+)["'][^>]*>/gi;
    let match;

    while ((match = regex.exec(html || '')) !== null) {
      ogTags[match[1]] = match[2];
    }

    return ogTags;
  }

  private extractHeadings(html: string): WebAnalysisResult['seo']['headings'] {
    return {
      h1: (html?.match(/<h1[^>]*>/gi) || []).length,
      h2: (html?.match(/<h2[^>]*>/gi) || []).length,
      h3: (html?.match(/<h3[^>]*>/gi) || []).length
    };
  }

  private extractImages(html: string): WebAnalysisResult['seo']['images'] {
    const images = html?.match(/<img[^>]+>/gi) || [];
    const withAlt = images.filter(img => /alt=["'][^"']*["']/.test(img)).length;

    return {
      total: images.length,
      withAlt,
      withoutAlt: images.length - withAlt
    };
  }

  private extractLinks(html: string): string[] {
    const matches = html?.match(/<a[^>]+href=["']([^"']+)["'][^>]*>/gi) || [];
    return matches.map(link => {
      const match = link.match(/href=["']([^"']+)["']/);
      return match ? match[1] : '';
    }).filter(href => href);
  }

  private detectTechnology(headers: any, html: string): string[] {
    const technologies: string[] = [];

    // Detectar basado en headers
    const server = headers?.get('server');
    if (server) {
      if (server.includes('nginx')) technologies.push('Nginx');
      if (server.includes('apache')) technologies.push('Apache');
      if (server.includes('IIS')) technologies.push('IIS');
    }

    // Detectar basado en HTML
    if (html?.includes('wp-content')) technologies.push('WordPress');
    if (html?.includes('cdn.shopify.com')) technologies.push('Shopify');
    if (html?.includes('analytics.js')) technologies.push('Google Analytics');
    if (html?.includes('gtag')) technologies.push('Google Analytics 4');
    if (html?.includes('bootstrap')) technologies.push('Bootstrap');
    if (html?.includes('jquery')) technologies.push('jQuery');
    if (html?.includes('react')) technologies.push('React');
    if (html?.includes('vue')) technologies.push('Vue.js');
    if (html?.includes('angular')) technologies.push('Angular');

    return technologies;
  }

  private extractSecurityHeaders(headers: any): { [key: string]: string } {
    const securityHeaders: { [key: string]: string } = {};

    ['strict-transport-security', 'content-security-policy', 'x-frame-options',
     'x-content-type-options', 'referrer-policy', 'permissions-policy'].forEach(header => {
      const value = headers?.get(header);
      if (value) {
        securityHeaders[header] = value;
      }
    });

    return securityHeaders;
  }

  private hasViewport(html: string): boolean {
    return /<meta[^>]*name=["']viewport["'][^>]*>/.test(html || '');
  }

  private getMockPageSpeedData(strategy: string): Observable<PageSpeedResult> {
    console.log(`🎭 Generating mock PageSpeed data for ${strategy} strategy`);

    return new Observable(subscriber => {
      setTimeout(() => {
        const mockData = {
          lighthouseResult: {
            categories: {
              performance: { score: 0.85 },
              accessibility: { score: 0.92 },
              'best-practices': { score: 0.88 },
              seo: { score: 0.95 }
            },
            audits: {
              'largest-contentful-paint': { numericValue: 2500 },
              'first-input': { numericValue: 100 },
              'cumulative-layout-shift': { numericValue: 0.05 },
              'speed-index': { numericValue: 1500 }
            }
          }
        };
        console.log(`✅ Mock data generated for ${strategy}:`, mockData);
        subscriber.next(mockData);
        subscriber.complete();
      }, 1000);
    });
  }

  private getMockCategoryScore(category: string): any {
    // 🔥 Método auxiliar para proporcionar scores mock cuando las categorías faltan
    const mockScores: Record<string, { score: number }> = {
      accessibility: { score: 0.92 },
      'best-practices': { score: 0.88 },
      seo: { score: 0.95 }
    };

    console.log(`📊 Using mock score for ${category}:`, mockScores[category]);
    return mockScores[category];
  }

  private getMockBasicInfo(): Observable<any> {
    return new Observable(subscriber => {
      setTimeout(() => {
        subscriber.next({
          statusCode: 200,
          headers: new Map([
            ['server', 'nginx/1.18.0'],
            ['content-type', 'text/html; charset=UTF-8']
          ]),
          body: `
            <html>
              <head>
                <title>Ejemplo de Página Web</title>
                <meta name="description" content="Esta es una página web de ejemplo">
                <meta name="keywords" content="ejemplo, web, análisis">
                <meta name="viewport" content="width=device-width, initial-scale=1">
              </head>
              <body>
                <h1>Título Principal</h1>
                <h2>Subtítulo</h2>
                <img src="imagen.jpg" alt="Imagen de ejemplo">
                <img src="imagen2.jpg">
                <a href="/pagina-interna">Enlace interno</a>
                <a href="https://externo.com">Enlace externo</a>
              </body>
            </html>
          `
        });
        subscriber.complete();
      }, 500);
    });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('WebAnalyzerService error:', error);
    return throwError(() => new Error(
      error.error?.message || 'Error al analizar la página web. Verifica que la URL sea correcta y accesible.'
    ));
  }
}
