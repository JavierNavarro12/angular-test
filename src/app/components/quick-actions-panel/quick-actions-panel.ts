import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  action: () => void;
}

@Component({
  selector: 'app-quick-actions-panel',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule
  ],
  templateUrl: './quick-actions-panel.html',
  styleUrl: './quick-actions-panel.scss'
})
export class QuickActionsPanel {
  @Input() maxHeight: string = '500px';
  @Output() actionExecuted = new EventEmitter<string>();
  @Output() closePanel = new EventEmitter<void>();

  lastAction: string = '';

  quickActions: QuickAction[] = [
    {
      id: 'export-pdf',
      title: 'Exportar PDF',
      description: 'Generar reporte completo en formato PDF',
      icon: 'picture_as_pdf',
      color: '#e53e3e',
      action: () => this.exportPDF()
    },
    {
      id: 'export-excel',
      title: 'Exportar Excel',
      description: 'Descargar datos en formato Excel',
      icon: 'table_chart',
      color: '#38a169',
      action: () => this.exportExcel()
    },
    {
      id: 'share-dashboard',
      title: 'Compartir Dashboard',
      description: 'Generar enlace para compartir',
      icon: 'share',
      color: '#3182ce',
      action: () => this.shareDashboard()
    },
    {
      id: 'schedule-report',
      title: 'Programar Reporte',
      description: 'Configurar envío automático de reportes',
      icon: 'schedule',
      color: '#ed8936',
      action: () => this.scheduleReport()
    },
    {
      id: 'create-alert',
      title: 'Crear Alerta',
      description: 'Configurar notificaciones personalizadas',
      icon: 'add_alert',
      color: '#805ad5',
      action: () => this.createAlert()
    },
    {
      id: 'data-refresh',
      title: 'Actualizar Datos',
      description: 'Refrescar todas las métricas manualmente',
      icon: 'refresh',
      color: '#0d9488',
      action: () => this.refreshData()
    }
  ];

  onActionClick(action: QuickAction, event?: Event): void {
    action.action();
    this.lastAction = action.title;
    this.actionExecuted.emit(action.id);

    // Agregar efecto ripple temporal
    if (event) {
      const actionElement = event.target as HTMLElement;
      if (actionElement) {
        const actionItem = actionElement.closest('.action-item');
        if (actionItem) {
          actionItem.classList.add('ripple');
          setTimeout(() => {
            actionItem.classList.remove('ripple');
          }, 600);
        }
      }
    }
  }

  onClosePanel(): void {
    this.closePanel.emit();
  }

  private exportPDF(): void {
    console.log('Exportando PDF...');
    alert('Generando reporte PDF...');
  }

  private exportExcel(): void {
    console.log('Exportando Excel...');
    alert('Generando archivo Excel...');
  }

  private shareDashboard(): void {
    console.log('Compartiendo dashboard...');
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert('Enlace copiado al portapapeles: ' + url);
    });
  }

  private scheduleReport(): void {
    console.log('Programando reporte...');
    alert('Función de programación próximamente disponible');
  }

  private createAlert(): void {
    console.log('Creando alerta...');
    alert('Configurador de alertas próximamente disponible');
  }

  private refreshData(): void {
    console.log('Actualizando datos...');
    alert('Actualizando todas las métricas...');
    // Aquí iría la lógica para refrescar datos
    setTimeout(() => {
      alert('Datos actualizados correctamente');
    }, 1000);
  }
}
