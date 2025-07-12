import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CandidateADM {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  birthDate: string;
  registrationDate: string;
  registrationTime: string;
}

export interface CompanyADM {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  registrationDate: string;
  registrationTime: string;
  description: string;
  area: string;
  nipc: number;
  approvalStatus: number;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private candidatesUrl = 'http://localhost:8080/api/admin/candidates';
  private companiesUrl = 'http://localhost:8080/api/admin/companies';

  constructor(private http: HttpClient) {}

  getCandidates(): Observable<CandidateADM[]> {
    return this.http.get<CandidateADM[]>(this.candidatesUrl);
  }

  getCompanies(): Observable<CompanyADM[]> {
    return this.http.get<CompanyADM[]>(this.companiesUrl);
  }
}