import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InternshipOfferService } from '../../services/internship-offer.service';
import { InternshipOfferSimple } from '../../models/internship-offer.model';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { CompanyOffer } from '../../models/company-offer.model';
import { FormsModule } from '@angular/forms';

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
  application = {
    pitch: '',
    documentId: 1, // valor padrão ou defina conforme necessário
    candidateId: 1 // defina conforme o usuário logado
  };

  constructor(
    private route: ActivatedRoute,
    private offerService: InternshipOfferService,
    private location: Location
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
  }

  goBack() {
    this.location.back();
  }

  submitApplication() {
    if (!this.offer) return;
    const body = {
      candidate: { id: this.application.candidateId },
      document: { id: this.application.documentId },
      pitch: this.application.pitch,
      state: 0,
      internshipOffer: { id: this.offer.id }
    };
    this.offerService.createApplication(body).subscribe({
      next: () => {
        this.success = true;
        this.error = '';
        setTimeout(() => {
          this.showBack = false;
          this.success = false;
        }, 2000);
      },
      error: () => {
        this.error = 'Error sending application!';
        this.success = false;
      }
    });
  }
}
