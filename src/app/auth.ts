import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

//Authenticates the user, creates the Token and saves the Token in localStorage (like a cookie)
export class AuthService {
  tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('jwtToken'));
  token$ = this.tokenSubject.asObservable();

  //API URL
  private baseUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) { }

  //Logs in with username and password | Saves the token
  login(username: string, password: string): Observable<{ token: string }> {

    //Saves the token in local storage if login is successful
    return this.http.post<{ token: string }>(`${this.baseUrl}/login`, { username, password }).pipe(
      tap(response => {
        localStorage.setItem('jwtToken', response.token);
        this.tokenSubject.next(response.token);
      })
    );
  }

  //Returns the Token stored in localStorage
  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  //Removes the Token stored in localStorage
  logout() {
    localStorage.removeItem('jwtToken');
    this.tokenSubject.next(null);
  }
}
