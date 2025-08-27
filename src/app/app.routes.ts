import { Routes } from '@angular/router';
import { WebAnalyzer } from './components/web-analyzer/web-analyzer';

export const routes: Routes = [
  {
    path: '',
    component: WebAnalyzer
  },
  {
    path: '**',
    redirectTo: ''
  }
];
