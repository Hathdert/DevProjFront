// src/app/auth/auth.guard.ts
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../../auth';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  // canActivate(): boolean {
  //   const token = this.auth.getToken();
  //   if (token) {
  //     return true;
  //   } else {
  //     // alert('Você precisa estar logado para acessar essa página.');
  //     this.router.navigate(['/login']);
  //     return false;
  //   }
  // }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const allowedRoles = route.data['roles'] as number[];
    const token = this.auth.getToken();
    const userRole = this.getUser();

    if (userRole === null) {
      this.router.navigate(['/login']);
      return false;
    }

    if (allowedRoles.includes(userRole)) {
      return true;
    } else {
      this.router.navigate(['/home']);
      return false;
    }
  }

  getUser(): number | null {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      return null;
    }
    try {
      const payload = token.split('.')[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const obj = JSON.parse(jsonPayload);
      const navBarValue = obj.navBar;
      return navBarValue !== undefined ? Number(navBarValue) : null;
    } catch (e) {
      console.error('Error decoding token:', e);
      return null;
    }
  }
}
