import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InternshipOfferService } from '../../services/internship-offer.service';
import { InternshipOfferSimple } from '../../models/internship-offer.model';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { CompanyOffer } from '../../models/company-offer.model';

@Component({
  selector: 'app-offert-view',
  imports: [CommonModule],
  templateUrl: './offert-view.html',
  styleUrls: ['./offert-view.scss']
})
export class OffertView {
  offer?: InternshipOfferSimple;
  company?: CompanyOffer;

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
}
