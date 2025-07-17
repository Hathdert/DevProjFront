import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Application } from "../models/application.model";
import { ApplicationCreate } from "../models/application-create.model";

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  
  private apiUrl = 'http://localhost:8080/api/applications';

  private apiUrlUpdateState = 'http://localhost:8080/api/applications/{applicationId}/change-status';

  constructor(private http: HttpClient) { }

  createApplication(application: ApplicationCreate): Observable<any> {
    return this.http.post(`${this.apiUrl}/new`, application);
  }

  getOfferById(id: number): Observable<Application> {
    return this.http.get<Application>(`${this.apiUrl}/internshipoffer/${id}`);
  }

  getApplicationsByOfferId(offerId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/internshipoffer/${offerId}`);
  }

  getApplicationsByCandidateId(candidateId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/candidate/${candidateId}`);
  }

  changeOfferStatus(applicationId: number, status: number): Observable<Application> {
    return this.http.patch<Application>(
      this.apiUrlUpdateState.replace('{applicationId}', applicationId.toString()),
      status
    );
  }
}