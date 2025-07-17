import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InternshipOfferSimple } from '../models/internship-offer.model';
import { Company } from '../models/company.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  constructor(private http: HttpClient) {}

  getTop8Offers(): Observable<InternshipOfferSimple[]> {
    return this.http.get<InternshipOfferSimple[]>('http://localhost:8080/api/offers/top8');
  }

  getTop6Companies(): Observable<Company[]> {
    return this.http.get<Company[]>('http://localhost:8080/api/companies/top6-by-applications');
  }
}