import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

//Autentica o usuário, cria o Token e salva o Token no localStorage (Like a cookie)
export class AuthService {

  //Url da API
  private baseUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) { }

  //Faz login com usuário e senha | Salva o token
  login(username: string, password: string): Observable<{ token: string }> {

    //Salva o token no local storage se conseguir fazer login, 
    return this.http.post<{ token: string }>(`${this.baseUrl}/login`, { username, password }).pipe(
      tap(response => {
        localStorage.setItem('jwtToken', response.token);
        localStorage.setItem('UserName', username);
        console.log(localStorage.getItem('UserName'));
      })
    );
  }

  //Retorna  o Token que está no localStorage
  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  // Apaga o Token que está no localStorage
  logout() {
    localStorage.removeItem('jwtToken');
  }
}
