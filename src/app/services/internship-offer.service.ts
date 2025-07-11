import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { InternshipOfferSimple } from '../models/internship-offer.model';

@Injectable({
  providedIn: 'root'
})
export class InternshipOfferService {
  private apiUrl = 'http://localhost:8080/api/internshipoffers';
  private apiUrlfindByCompant = 'http://localhost:8080/api/internshipoffers/companies/{companyId}';

  constructor(private http: HttpClient) {}

  getAllOffers(): Observable<InternshipOfferSimple[]> {
    return this.http.get<InternshipOfferSimple[]>(`${this.apiUrl}`);
  }

  getOffersByCompanyId(companyId: number): Observable<InternshipOfferSimple[]> {
    return this.http.get<InternshipOfferSimple[]>(`${this.apiUrlfindByCompant}`.replace('{companyId}', companyId.toString()));
  }

}