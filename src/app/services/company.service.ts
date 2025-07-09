import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from '../models/company.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrlToken = 'http://localhost:8080/api/companies/profile';
  private apiUrlId = 'http://localhost:8080/api/companies/{id}';

  constructor(private http: HttpClient) {}

  getCompanyByToken(): Observable<Company> {
    const token = localStorage.getItem('jwtToken');
    if (!token) throw new Error('Token não encontrado no localStorage.');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<Company>(this.apiUrlToken, { headers });
  }

  getCompanyById(id: number): Observable<Company> {
    const url = this.apiUrlId.replace('{id}', id.toString());
    return this.http.get<Company>(url);
  }
}
