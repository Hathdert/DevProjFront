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

  private apiUrl2 = 'http://localhost:8080/api/internshipoffers/top6-by-applications';

  constructor(private http: HttpClient) {}

  getAllOffers(): Observable<InternshipOfferSimple[]> {
    return this.http.get<InternshipOfferSimple[]>(`${this.apiUrl}`);
  }

  getTop8Offers(): Observable<InternshipOfferSimple[]> {
    return this.http.get<any[]>(this.apiUrl2).pipe(
      map(offers =>
        offers.map(offer => ({
          id: offer.id,
          title: offer.title,
          description: offer.description,
          requirements: offer.requirements,
          area: offer.area,
          startDate: offer.startDate,
          endDate: offer.endDate,
          vacancies: offer.vacancies
        }))
      )
    );
  }

  getOffersByCompanyId(companyId: number): Observable<InternshipOfferSimple[]> {
    return this.http.get<InternshipOfferSimple[]>(`${this.apiUrlfindByCompant}`.replace('{companyId}', companyId.toString()));
  }

}