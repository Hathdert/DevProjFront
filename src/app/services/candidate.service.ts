import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Candidate } from '../models/candidate.model';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  private apiUrlToken = 'http://localhost:8080/api/candidates/profile';
  private apiUrlId = 'http://localhost:8080/api/candidates/{id}';  

  constructor(private http: HttpClient) {}

    getCandidateByToken(): Observable<Candidate> {
        const token = localStorage.getItem('jwtToken');
        if (!token) throw new Error('Token não encontrado no localStorage.');
    
        const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
        });
    
        return this.http.get<Candidate>(this.apiUrlToken, { headers });
    }
    getCandidateById(id: number): Observable<Candidate> {
        const url = this.apiUrlId.replace('{id}', id.toString());
        return this.http.get<Candidate>(url);
    }
}