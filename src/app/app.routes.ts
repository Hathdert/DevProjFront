
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { AuthGuard } from './app/auth/auth-guard';
import { Home } from './pages/home/home';
import { RegisterComponent } from './pages/register/register';
import { CompanyProfileCompany } from './pages/company-profile/company-profile';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: Home, canActivate: [AuthGuard] },
  { path: 'profile-company', component: CompanyProfileCompany },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
