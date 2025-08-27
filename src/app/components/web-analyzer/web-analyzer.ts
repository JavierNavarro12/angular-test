import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';

import { WebAnalyzerService, WebAnalysisResult } from '../../services/web-analyzer';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-web-analyzer',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatChipsModule,
    MatDividerModule,
    MatTooltipModule,
    MatExpansionModule
  ],
  templateUrl: './web-analyzer.html',
  styleUrl: './web-analyzer.scss'
})
export class WebAnalyzer implements OnInit {
  url: string = '';
  isAnalyzing: boolean = false;
  analysisResult: WebAnalysisResult | null = null;
  error: string | null = null;

  // Características que ofrecemos
  features = [
    {
      icon: 'speed',
      title: 'Análisis de Rendimiento',
      description: 'Mide la velocidad de carga, Core Web Vitals y puntuación de PageSpeed'
    },
    {
      icon: 'search',
      title: 'Análisis SEO',
      description: 'Meta tags, headings, estructura de contenido y optimización para motores de búsqueda'
    },
    {
      icon: 'security',
      title: 'Seguridad Web',
      description: 'Certificado SSL, headers de seguridad y vulnerabilidades detectadas'
    },
    {
      icon: 'phone_android',
      title: 'Compatibilidad Móvil',
      description: 'Viewport, responsive design y experiencia móvil'
    },
    {
      icon: 'code',
      title: 'Tecnologías Detectadas',
      description: 'Frameworks, librerías y servidor utilizados en el sitio'
    },
    {
      icon: 'accessibility',
      title: 'Accesibilidad',
      description: 'Cumplimiento de estándares de accesibilidad web'
    }
  ];

  constructor(private webAnalyzerService: WebAnalyzerService) {}

  ngOnInit(): void {
    // Limpiar resultados al inicializar
    this.clearResults();
  }

  analyzeWebsite(): void {
    if (!this.url.trim()) {
      this.error = 'Por favor ingresa una URL válida';
      return;
    }

    this.isAnalyzing = true;
    this.error = null;
    this.analysisResult = null;

    this.webAnalyzerService.analyzeWebsite(this.url.trim()).subscribe({
      next: (result) => {
        this.analysisResult = result;
        this.isAnalyzing = false;
        console.log('Análisis completado:', result);
      },
      error: (error) => {
        this.error = error.message || 'Error al analizar la página web';
        this.isAnalyzing = false;
        console.error('Error en análisis:', error);
      }
    });
  }

  clearResults(): void {
    this.analysisResult = null;
    this.error = null;
    this.url = '';
  }

  // Métodos helper para el template
  getPerformanceColor(score: number): string {
    if (score >= 90) return 'performance-excellent';
    if (score >= 70) return 'performance-good';
    if (score >= 50) return 'performance-needs-improvement';
    return 'performance-poor';
  }

  getPerformanceLabel(score: number): string {
    if (score >= 90) return 'Excelente';
    if (score >= 70) return 'Bueno';
    if (score >= 50) return 'Necesita Mejoras';
    return 'Deficiente';
  }

  formatCoreWebVitals(value: number, unit: string = 's'): string {
    if (unit === 's') {
      return `${(value).toFixed(2)}s`;
    }
    if (unit === 'ms') {
      return `${Math.round(value)}ms`;
    }
    return value.toString();
  }

  getTechnologyColor(tech: string): string {
    const colors: { [key: string]: string } = {
      'React': 'tech-react',
      'Angular': 'tech-angular',
      'Vue.js': 'tech-vue',
      'WordPress': 'tech-wordpress',
      'Shopify': 'tech-shopify',
      'Nginx': 'tech-nginx',
      'Apache': 'tech-apache'
    };
    return colors[tech] || 'tech-other';
  }

  getSecurityStatus(): 'secure' | 'warning' | 'insecure' {
    if (!this.analysisResult) return 'insecure';

    const hasSSL = this.analysisResult.technical.security.ssl;
    const securityHeaders = Object.keys(this.analysisResult.technical.security.securityHeaders);

    if (hasSSL && securityHeaders.length >= 3) return 'secure';
    if (hasSSL && securityHeaders.length >= 1) return 'warning';
    return 'insecure';
  }

  getSecurityStatusText(): string {
    const status = this.getSecurityStatus();
    switch (status) {
      case 'secure': return 'Seguro';
      case 'warning': return 'Requiere Atención';
      case 'insecure': return 'Inseguro';
      default: return 'Desconocido';
    }
  }

  getSecurityStatusColor(): string {
    const status = this.getSecurityStatus();
    switch (status) {
      case 'secure': return 'security-secure';
      case 'warning': return 'security-warning';
      case 'insecure': return 'security-insecure';
      default: return 'security-unknown';
    }
  }

  getMobileScore(): number {
    if (!this.analysisResult) return 0;

    let score = 0;
    if (this.analysisResult.technical.mobile.viewport) score += 40;
    if (this.analysisResult.technical.mobile.mobileFriendly) score += 30;
    if (this.analysisResult.performance.lighthouse.performance >= 70) score += 30;

    return Math.min(score, 100);
  }

  getAccessibilityScore(): number {
    return this.analysisResult?.performance.lighthouse.accessibility || 0;
  }

  getSeoScore(): number {
    return this.analysisResult?.performance.lighthouse.seo || 0;
  }

  getBestPracticesScore(): number {
    return this.analysisResult?.performance.lighthouse.bestPractices || 0;
  }

  getPerformanceScore(): number {
    return this.analysisResult?.performance.lighthouse.performance || 0;
  }

  // Método helper para object keys
  objectKeys(obj: any): string[] {
    return Object.keys(obj || {});
  }

  // Método para gradientes de scores
  getScoreGradient(score: number): string {
    if (score >= 90) return 'conic-gradient(#4caf50 0deg, #66bb6a 360deg)';
    if (score >= 70) return 'conic-gradient(#ff9800 0deg, #ffb74d 360deg)';
    return 'conic-gradient(#f44336 0deg, #ef5350 360deg)';
  }
}
