
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { AuthGuard } from './app/auth/auth-guard';
import { Home } from './pages/home/home';
import { RegisterComponent } from './pages/register/register';
import { PrivateCompanyProfileComponent } from './pages/private-company-profile/private-company-profile';
import { CompanyProfileComponent } from './pages/company-profile/company-profile';
import { Admin } from './pages/admin/admin';
import { InternshipOffers } from './pages/internship-offers/internship-offers';
import { AddInternshipOfferComponent } from './pages/add-internship-offer/add-internship-offer';
import { OffertView } from './pages/offert-view/offert-view';
import { CandidateProfile } from './pages/candidate-profile/candidate-profile';
import { OfferViewCompany } from './pages/offer-view-company/offer-view-company';
import { ViewApplication } from './pages/view-application/view-application';
import { FaqComponent } from './pages/faq/faq';

export const routes: Routes = [
  { path: 'home', component: Home},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  //, canActivate: [AuthGuard] 
  { path: 'profile-company', component: PrivateCompanyProfileComponent, canActivate: [AuthGuard], data: { roles: [2] } },
  { path: 'company/:id', component: CompanyProfileComponent},
  { path : 'profile-candidate', component:CandidateProfile, canActivate: [AuthGuard], data: { roles: [1] } },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'admin', component: Admin, canActivate: [AuthGuard], data: { roles: [0] } },
  { path: 'offers', component: InternshipOffers },
  { path: 'addoffers', component: AddInternshipOfferComponent, canActivate: [AuthGuard], data: { roles: [0, 2] } },
  { path: 'offers/:id', component: OffertView, canActivate: [AuthGuard], data: { roles: [0, 1] } },
  { path: 'company-offer/:id', component: OfferViewCompany, canActivate: [AuthGuard], data: { roles: [0, 2] } },
  { path: 'view-application/:id', component: ViewApplication, canActivate: [AuthGuard], data: { roles: [0, 2] } },
  { path: 'faq', component: FaqComponent },
  { path: '**', redirectTo: 'home' },
];
