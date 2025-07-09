import { Component } from '@angular/core';
import { AuthService } from '../../auth';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';  
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    HttpClientModule  
  ],
  templateUrl: './login.html',
  providers: [AuthService]  
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

onSubmit() {
  this.auth.login(this.username, this.password).subscribe({
    next: () => {
      this.errorMessage = '';
      alert('Login realizado com sucesso!');
      this.router.navigate(['/home']);
    },
    error: () => {
      this.errorMessage = 'Usuário ou senha inválidos.';
      alert(this.errorMessage); // ou mostrar em uma div com ngIf
    }
  });
  }
}
