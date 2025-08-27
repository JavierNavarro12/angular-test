import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    action: () => void;
  };
}

@Component({
  selector: 'app-notifications-panel',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatDividerModule
  ],
  templateUrl: './notifications-panel.html',
  styleUrl: './notifications-panel.scss'
})
export class NotificationsPanel {
  @Input() notifications: Notification[] = [];
  @Input() maxHeight: string = '400px';
  @Output() notificationRead = new EventEmitter<string>();
  @Output() notificationAction = new EventEmitter<{id: string, action: () => void}>();
  @Output() markAllRead = new EventEmitter<void>();
  @Output() closePanel = new EventEmitter<void>();

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'info': return 'info';
      case 'warning': return 'warning';
      case 'success': return 'check_circle';
      case 'error': return 'error';
      default: return 'notifications';
    }
  }

  getTypeColor(type: string): string {
    switch (type) {
      case 'info': return '#2196f3';
      case 'warning': return '#ff9800';
      case 'success': return '#4caf50';
      case 'error': return '#f44336';
      default: return '#666';
    }
  }

  markAsRead(notificationId: string): void {
    this.notificationRead.emit(notificationId);
  }

  executeAction(notification: Notification): void {
    if (notification.action) {
      this.notificationAction.emit({
        id: notification.id,
        action: notification.action.action
      });
      notification.action.action();
    }
  }

  onMarkAllRead(): void {
    this.markAllRead.emit();
  }

  onClosePanel(): void {
    this.closePanel.emit();
  }

  formatTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `Hace ${minutes}m`;
    if (hours < 24) return `Hace ${hours}h`;
    return `Hace ${days}d`;
  }
}
