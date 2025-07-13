import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { InternshipOfferSimple } from '../models/internship-offer.model';
import { InternshipOfferCreate } from '../models/internship-offer-create.model';
import { CompanyOffer } from '../models/company-offer.model';

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
          vacancies: offer.vacancies,
          company: offer.company ?? null,
          isOffer: offer.isOffer ?? false,
          applications: offer.applications ?? []
        }))
      )
    );
  }

  getOffersByCompanyId(companyId: number): Observable<InternshipOfferSimple[]> {
    return this.http.get<InternshipOfferSimple[]>(`${this.apiUrlfindByCompant}`.replace('{companyId}', companyId.toString()));
  }

  createOffer(offer: InternshipOfferCreate): Observable<any> {
    return this.http.post(this.apiUrl, offer);
  }

  getOfferById(id: number): Observable<InternshipOfferSimple> {
  return this.http.get<InternshipOfferSimple>(`http://localhost:8080/api/internshipoffers/${id}`);
}

getCompanyByOfferId(offerId: number): Observable<CompanyOffer> {
  return this.http.get<CompanyOffer>(`http://localhost:8080/api/companies/by-offer/${offerId}`);
}
}