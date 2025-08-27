import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

export interface Settings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
  soundEnabled: boolean;
  compactMode: boolean;
}

@Component({
  selector: 'app-settings-panel',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './settings-panel.html',
  styleUrl: './settings-panel.scss'
})
export class SettingsPanel {
  @Input() maxHeight: string = '500px';
  @Output() settingsChanged = new EventEmitter<Settings>();
  @Output() closePanel = new EventEmitter<void>();

  settings: Settings = {
    theme: 'light',
    language: 'es',
    notifications: true,
    autoRefresh: true,
    refreshInterval: 30,
    soundEnabled: false,
    compactMode: false
  };

  languages = [
    { value: 'es', label: 'Español' },
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' }
  ];

  refreshIntervals = [
    { value: 10, label: '10 segundos' },
    { value: 30, label: '30 segundos' },
    { value: 60, label: '1 minuto' },
    { value: 300, label: '5 minutos' }
  ];

  onSettingChange(): void {
    this.settingsChanged.emit(this.settings);
  }

  resetToDefaults(): void {
    this.settings = {
      theme: 'light',
      language: 'es',
      notifications: true,
      autoRefresh: true,
      refreshInterval: 30,
      soundEnabled: false,
      compactMode: false
    };
    this.onSettingChange();
  }

  onClosePanel(): void {
    this.closePanel.emit();
  }
}
