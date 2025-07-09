
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { AuthGuard } from './app/auth/auth-guard';
import { Home } from './pages/home/home';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: Home, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
