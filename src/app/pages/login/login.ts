import { Component } from '@angular/core';
import { AuthService } from '../../auth';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';  
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    HttpClientModule,
    CommonModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})

export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  success = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.auth.login(this.username, this.password).subscribe({
      next: () => {
        this.errorMessage = '';
        this.success = true;
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1500); // tempo igual ao da animação (2.5s)
      },
      error: () => {
        this.errorMessage = 'Usuário ou senha inválidos.';
        alert(this.errorMessage);
      }
    });
  }
}
