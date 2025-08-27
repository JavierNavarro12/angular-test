import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  joinDate: Date;
  lastLogin: Date;
  preferences: {
    theme: 'light' | 'dark';
    language: string;
    notifications: boolean;
  };
  stats: {
    loginCount: number;
    actionsPerformed: number;
    reportsGenerated: number;
  };
}

@Component({
  selector: 'app-user-profile-panel',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatChipsModule
  ],
  templateUrl: './user-profile-panel.html',
  styleUrl: './user-profile-panel.scss'
})
export class UserProfilePanel {
  @Input() maxHeight: string = '600px';
  @Output() logout = new EventEmitter<void>();
  @Output() editProfile = new EventEmitter<void>();
  @Output() closePanel = new EventEmitter<void>();

  user: User = {
    id: '1',
    name: 'Admin User',
    email: 'admin@analyticspro.com',
    avatar: '',
    role: 'Administrador',
    joinDate: new Date('2024-01-15'),
    lastLogin: new Date(),
    preferences: {
      theme: 'light',
      language: 'es',
      notifications: true
    },
    stats: {
      loginCount: 147,
      actionsPerformed: 892,
      reportsGenerated: 23
    }
  };

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  getRoleColor(role: string): string {
    switch (role.toLowerCase()) {
      case 'administrador': return '#ef4444';
      case 'manager': return '#f59e0b';
      case 'user': return '#10b981';
      default: return '#6b7280';
    }
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  onLogout(): void {
    this.logout.emit();
  }

  onEditProfile(): void {
    this.editProfile.emit();
  }

  onClosePanel(): void {
    this.closePanel.emit();
  }
}
