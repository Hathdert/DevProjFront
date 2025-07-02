import { Component } from '@angular/core';
import { AuthService } from '../auth';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';  

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

  constructor(private auth: AuthService) {}

  //Faz o LOGIN
  onSubmit() {
    //Chama a função Auth.login para fazer o login, envia username e password
    this.auth.login(this.username, this.password).subscribe({
      next: () => {
        this.errorMessage = '';
        alert('Login realizado com sucesso!');
      },
      error: () => {
        this.errorMessage = 'Usuário ou senha inválidos.';
      }
    });
  }
}
