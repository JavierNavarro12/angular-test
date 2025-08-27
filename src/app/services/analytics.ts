import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval, map, startWith } from 'rxjs';

export interface MetricData {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ChartData {
  name: string;
  value: number;
}

export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  timestamp: Date;
  location: string;
}

@Injectable({
  providedIn: 'root'
})
export class Analytics {

  private metricsSubject = new BehaviorSubject<MetricData[]>([]);
  private chartDataSubject = new BehaviorSubject<ChartData[]>([]);
  private userActivitySubject = new BehaviorSubject<UserActivity[]>([]);

  public metrics$ = this.metricsSubject.asObservable();
  public chartData$ = this.chartDataSubject.asObservable();
  public userActivity$ = this.userActivitySubject.asObservable();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    // Simular métricas que cambian cada 3 segundos
    interval(3000).pipe(
      map(() => this.generateMockMetrics())
    ).subscribe(metrics => this.metricsSubject.next(metrics));

    // Simular datos de gráficos cada 2 segundos
    interval(2000).pipe(
      map(() => this.generateMockChartData())
    ).subscribe(data => this.chartDataSubject.next(data));

    // Simular actividad de usuarios cada 5 segundos
    interval(5000).pipe(
      map(() => this.generateMockUserActivity())
    ).subscribe(activity => this.userActivitySubject.next(activity));
  }

  private generateMockMetrics(): MetricData[] {
    const now = Date.now();
    return [
      {
        label: 'Usuarios Activos',
        value: Math.floor(Math.random() * 1000) + 500,
        change: (Math.random() - 0.5) * 20,
        trend: Math.random() > 0.5 ? 'up' : 'down'
      },
      {
        label: 'Páginas Vistas',
        value: Math.floor(Math.random() * 5000) + 2000,
        change: (Math.random() - 0.5) * 15,
        trend: Math.random() > 0.6 ? 'up' : 'stable'
      },
      {
        label: 'Tasa de Conversión',
        value: Math.floor(Math.random() * 10) + 2,
        change: (Math.random() - 0.5) * 5,
        trend: Math.random() > 0.4 ? 'up' : 'down'
      },
      {
        label: 'Revenue',
        value: Math.floor(Math.random() * 50000) + 10000,
        change: (Math.random() - 0.5) * 25,
        trend: Math.random() > 0.5 ? 'up' : 'down'
      }
    ];
  }

  private generateMockChartData(): ChartData[] {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push({
        name: `${i}:00`,
        value: Math.floor(Math.random() * 100) + 20
      });
    }
    return hours;
  }

  private generateMockUserActivity(): UserActivity[] {
    const actions = ['Login', 'Page View', 'Purchase', 'Search', 'Logout'];
    const locations = ['New York', 'London', 'Tokyo', 'Berlin', 'Sydney'];

    const activities: UserActivity[] = [];
    for (let i = 0; i < 10; i++) {
      activities.push({
        id: `activity-${Date.now()}-${i}`,
        userId: `user-${Math.floor(Math.random() * 1000)}`,
        action: actions[Math.floor(Math.random() * actions.length)],
        timestamp: new Date(),
        location: locations[Math.floor(Math.random() * locations.length)]
      });
    }
    return activities;
  }

  getRealTimeMetrics(): Observable<MetricData[]> {
    return this.metrics$;
  }

  getChartData(): Observable<ChartData[]> {
    return this.chartData$;
  }

  getUserActivity(): Observable<UserActivity[]> {
    return this.userActivity$;
  }
}
