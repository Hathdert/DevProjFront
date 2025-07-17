import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from '../models/company.model';
import { LoginComponent } from '../pages/login/login';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrlToken = 'http://localhost:8080/api/companies/profile';

  private apiUrlId = 'http://localhost:8080/api/companies/{id}';

  constructor(private http: HttpClient) {}

  getCompanyByToken(): Observable<Company> {
    const token = localStorage.getItem('jwtToken');
    if (!token) throw new Error('Token not found on localStorage.');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<Company>(this.apiUrlToken, { headers });
  }

deleteCompanyByToken(password: string): Observable<any> {
  const token = localStorage.getItem('jwtToken');
  if (!token) throw new Error('Token não encontrado no localStorage.');

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'text/plain'
  });

  return this.http.request('delete', this.apiUrlToken, {
    headers,
    body: password
  });
}

  getCompanyById(id: number): Observable<Company> {
    const url = this.apiUrlId.replace('{id}', id.toString());
    return this.http.get<Company>(url);
  }

  editCompany(company: Company): Observable<Company> {
    const token = localStorage.getItem('jwtToken');
    if (!token) throw new Error('Token not found on localStorage.');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.put<Company>(this.apiUrlToken, company, { headers });
  }
}
