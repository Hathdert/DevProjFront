import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InternshipOfferService } from '../../services/internship-offer.service';
import { InternshipOfferSimple } from '../../models/internship-offer.model';
import { ApplicationService } from '../../services/application.service';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { CompanyOffer } from '../../models/company-offer.model';
import { FormsModule } from '@angular/forms';
import { App } from '../../app';
import { ApplicationCreate } from '../../models/application-create.model';
import { CandidateService } from '../../services/candidate.service';
import { Document } from '../../models/document.model';
import { DocumentService } from '../../services/document.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-offert-view',
  imports: [CommonModule, FormsModule],
  templateUrl: './offert-view.html',
  styleUrls: ['./offert-view.scss']
})
export class OffertView {
  offer?: InternshipOfferSimple;
  company?: CompanyOffer;
  showBack = false;
  success = false;
  error = '';
  applicationDocument: File | null = null;
  application: ApplicationCreate = {
    candidate: { id: 0 },
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
    this.offerService.getOfferById(id).subscribe({
      next: (data) => {
        this.offer = data;
        this.offerService.getCompanyByOfferId(id).subscribe({
          next: (companyData) => this.company = companyData,
          error: (err) => console.error('Erro ao buscar empresa:', err)
        });
      },
      error: (err) => console.error('Erro ao buscar oferta:', err)
    });
    this.candidateService.getCandidateByToken().subscribe({
      next: (candidate) => {
        this.application.candidate.id = candidate.id;
        this.application.internshipOffer.id = this.offer?.id || 0;
      },
      error: (err) => console.error('Erro ao buscar candidato:', err)
    });
  }

  goBack() {
    this.location.back();
  }

  onDocumentSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.applicationDocument = input.files[0];
      console.log(`Selected document: ${this.applicationDocument}`);
    }
  }

  uploadDocument(applicationId: number) {
    const formData = new FormData();
    formData.append('file', this.applicationDocument!);
    formData.append('applicationId', applicationId.toString());
  
    this.http
      .post('http://localhost:8080/api/documents/upload/application', formData)
      .subscribe({
        next: (response) => {
          console.log('Document uploaded successfully:', response);
        },
        error: (err) => {
          console.error('Document upload error:', err);
          this.error = 'Error uploading document!';
        },
      });
  }
  

  submitApplication() {
    this.applicationService.createApplication(this.application).subscribe({
      next: (createdApp) => {
        const appId = createdApp.id;
        console.log('Application created:', createdApp);
  
        if (this.applicationDocument && appId) {
          this.uploadDocument(appId);  // Upload only after app creation
        }
  
        this.success = true;
        this.error = '';
        setTimeout(() => {
          this.showBack = false;
          this.success = false;
        }, 2000);
      },
      error: () => {
        this.error = 'Error creating application!';
        console.error('[APPLICATION ERROR]', this.error);
        console.error('[APPLICATION ERROR]', this.application);
        this.success = false;
      }
    });
  }
  

}
