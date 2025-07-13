import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from '../models/company.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrlCompanyFirstImage = 'http://localhost:8080/api/documents/company/{companyId}/first-image';
  private apiUrlCandidateFirstImage = 'http://localhost:8080/api/documents/candidate/{candidateId}/first-image';

  constructor(private http: HttpClient) {}

  getCompanyFirstImage(companyId: number): Observable<Blob> {
    const url = this.apiUrlCompanyFirstImage.replace('{companyId}', companyId.toString());
    return this.http.get(url, { responseType: 'blob' });
  }

  getCandidateFirstImage(candidateId: number): Observable<Blob> {
    const url = this.apiUrlCandidateFirstImage.replace('{candidateId}', candidateId.toString());
    return this.http.get(url, { responseType: 'blob' });
  }

}
