import { Routes } from '@angular/router';
import { LoginComponent } from './login/login/login';
import { ReportComponent } from './report/report/report';
import { AuthGuard } from './auth/auth-guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'report', component: ReportComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];