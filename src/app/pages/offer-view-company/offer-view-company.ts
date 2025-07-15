import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InternshipOfferService } from '../../services/internship-offer.service';
import { InternshipOfferSimple } from '../../models/internship-offer.model';
import { ApplicationService } from '../../services/application.service';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { CompanyOffer } from '../../models/company-offer.model';
import { FormsModule } from '@angular/forms';
import { ApplicationCreate } from '../../models/application-create.model';
import { CandidateService } from '../../services/candidate.service';
import { Document } from '../../models/document.model';
import { DocumentService } from '../../services/document.service';
import { HttpClient } from '@angular/common/http';
import { Candidate } from '../../models/candidate.model';

@Component({
  selector: 'app-offert-view',
  imports: [CommonModule, FormsModule],
  templateUrl: './offer-view-company.html',
  styleUrls: ['./offer-view-company.scss']
})
export class OfferViewCompany {
  offer?: InternshipOfferSimple;
  company?: CompanyOffer;
  showBack = false;
  success = false;
  error = '';
  applicationDocument: File | null = null;

  candidate: Candidate = {
    id: 0,
    name: '',
    email: '',
    password: '',
    role: '',
    registrationDate: '',
    registrationTime: '',
    address: '',
    phone: '',
    birthDate: '',
    documents: [],
  };

  application: ApplicationCreate = {
    candidate: this.candidate,
    document: [],
    pitch: '',
    state: 0,
    internshipOffer: { id: 0 }
  };

  document: Document = {
    fileName: '', 
    fileType: '',
    filePath: '',
    uploadDate: '',
    company: null as any,
    candidate: null as any,
    application: { id: 0 }
  };

  applications: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private offerService: InternshipOfferService,
    private applicationService: ApplicationService,
    private candidateService: CandidateService,
    private documentService: DocumentService,
    private location: Location,
    private http: HttpClient
  ) {}

ngOnInit(): void {
  const id = Number(this.route.snapshot.paramMap.get('id'));
  this.offerService.getOfferByIdToken(id).subscribe({
    next: (data) => {
      this.offer = data;
      this.applications = this.offer.applications || [];

      // Para cada application, busca os detalhes do candidato usando candidateId
      this.applications.forEach((app, idx) => {
        if (app.candidateId) {
          this.candidateService.getCandidateById(app.candidateId).subscribe({
            next: (candidate) => {
              this.applications[idx].candidate = candidate;
            },
            error: (err) => console.error('Erro ao buscar candidato:', err)
          });
        }
      });
    },
    error: (err) => console.error('Erro ao buscar oferta:', err)
  });
}
  goBack() {
    this.location.back();
  }
}