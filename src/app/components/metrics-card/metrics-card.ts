import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MetricData } from '../../services/analytics';

@Component({
  selector: 'app-metrics-card',
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './metrics-card.html',
  styleUrl: './metrics-card.scss'
})
export class MetricsCard implements OnInit, OnChanges {
  @Input() metric!: MetricData;

  // Almacenar los valores de altura para evitar recalcularlos
  private sparklineHeights: number[] = [];

  ngOnInit() {
    // Generar alturas fijas para el sparkline
    this.generateSparklineHeights();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Si cambia la métrica, regenerar las alturas del sparkline
    if (changes['metric'] && !changes['metric'].firstChange) {
      this.generateSparklineHeights();
    }
  }

  private generateSparklineHeights(): void {
    try {
      // Generar 7 valores fijos de altura para el sparkline
      // NOTA: Usamos valores fijos en lugar de Math.random() en el template
      // para evitar errores ExpressionChangedAfterItHasBeenCheckedError (NG0100)
      this.sparklineHeights = [];
      for (let i = 0; i < 7; i++) {
        this.sparklineHeights.push(Math.floor(Math.random() * 60) + 30);
      }
    } catch (error) {
      console.error('Error generando alturas del sparkline:', error);
      // Valores por defecto en caso de error
      this.sparklineHeights = [40, 60, 35, 75, 45, 55, 65];
    }
  }

  getTrendIcon(): string {
    if (!this.metric) return 'trending_flat';
    switch (this.metric.trend) {
      case 'up': return 'trending_up';
      case 'down': return 'trending_down';
      default: return 'trending_flat';
    }
  }

  getTrendColor(): string {
    if (!this.metric) return 'trend-neutral';
    switch (this.metric.trend) {
      case 'up': return 'trend-positive';
      case 'down': return 'trend-negative';
      default: return 'trend-neutral';
    }
  }

  formatValue(value: number, label: string): string {
    if (!value || !label) return '0';
    try {
      if (label === 'Revenue') {
        return `$${value.toLocaleString()}`;
      }
      if (label === 'Tasa de Conversión') {
        return `${value.toFixed(1)}%`;
      }
      return value.toLocaleString();
    } catch (error) {
      console.error('Error formateando valor:', error);
      return '0';
    }
  }

  formatChange(change: number): string {
    if (change === null || change === undefined) return '0.0%';
    try {
      const sign = change >= 0 ? '+' : '';
      return `${sign}${change.toFixed(1)}%`;
    } catch (error) {
      console.error('Error formateando cambio:', error);
      return '0.0%';
    }
  }

  getMetricIcon(label: string): string {
    if (!label) return 'analytics';
    switch (label) {
      case 'Usuarios Activos': return 'people';
      case 'Páginas Vistas': return 'visibility';
      case 'Tasa de Conversión': return 'trending_up';
      case 'Revenue': return 'attach_money';
      default: return 'analytics';
    }
  }

  getSparklineHeight(index: number): number {
    try {
      // Devolver altura fija en lugar de generar aleatoria cada vez
      // Esto evita el error ExpressionChangedAfterItHasBeenCheckedError
      // porque Angular no detecta cambios inesperados en el DOM
      if (!this.sparklineHeights || this.sparklineHeights.length === 0) {
        // Si no hay alturas generadas, generarlas ahora
        this.generateSparklineHeights();
      }
      return this.sparklineHeights[index] || 50;
    } catch (error) {
      console.error('Error obteniendo altura del sparkline:', error);
      return 50; // Valor por defecto
    }
  }
}
