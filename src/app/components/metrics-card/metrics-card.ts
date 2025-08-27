import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MetricData } from '../../services/analytics';

@Component({
  selector: 'app-metrics-card',
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './metrics-card.html',
  styleUrl: './metrics-card.scss'
})
export class MetricsCard {
  @Input() metric!: MetricData;

  getTrendIcon(): string {
    switch (this.metric.trend) {
      case 'up': return 'trending_up';
      case 'down': return 'trending_down';
      default: return 'trending_flat';
    }
  }

  getTrendColor(): string {
    switch (this.metric.trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }

  formatValue(value: number, label: string): string {
    if (label === 'Revenue') {
      return `$${value.toLocaleString()}`;
    }
    if (label === 'Tasa de Conversión') {
      return `${value.toFixed(1)}%`;
    }
    return value.toLocaleString();
  }

  formatChange(change: number): string {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  }
}
