
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { AuthGuard } from './app/auth/auth-guard';
import { Home } from './pages/home/home';
import { RegisterComponent } from './pages/register/register';
import { PrivateCompanyProfileComponent } from './pages/private-company-profile/private-company-profile';
import { CompanyProfileComponent } from './pages/company-profile/company-profile';
import { Admin } from './pages/admin/admin';
import { InternshipOffers } from './pages/internship-offers/internship-offers';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: Home, canActivate: [AuthGuard] },
  { path: 'profile-company', component: PrivateCompanyProfileComponent },
  { path: 'company/:id', component: CompanyProfileComponent},
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'admin', component: Admin },
  { path: 'offers', component: InternshipOffers },
  { path: '**', redirectTo: 'login' },
];
