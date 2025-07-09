// src/app/app.ts

import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';           
import { HttpClientModule } from '@angular/common/http'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,              
  imports: [RouterOutlet, FormsModule, HttpClientModule, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected title = 'skillbridge-frontend';
  public navBarValue: string | null = null;

  ngOnInit() {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      this.navBarValue = this.getNavBarFromToken(token);
    }
  }

  getNavBarFromToken(token: string): string | null {
    try {
      const payload = token.split('.')[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const obj = JSON.parse(jsonPayload);
      return obj.navBar || null;
    } catch (e) {
      return null;
    }
  }
}