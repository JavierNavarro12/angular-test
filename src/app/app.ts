import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { Analytics, MetricData } from './services/analytics';
import { MetricsCard } from './components/metrics-card/metrics-card';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatGridListModule,
    MatIconModule,
    MetricsCard
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
  title = 'Dashboard de Analytics en Tiempo Real';
  metrics: MetricData[] = [];
  private subscription = new Subscription();

  constructor(private analyticsService: Analytics) {}

  ngOnInit(): void {
    // Suscribirse a las métricas en tiempo real
    this.subscription.add(
      this.analyticsService.getRealTimeMetrics().subscribe(metrics => {
        this.metrics = metrics;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
