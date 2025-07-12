import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyService } from '../../services/company.service';
import { Company } from '../../models/company.model';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../services/document.service';
import { InternshipOfferSimple } from '../../models/internship-offer.model';
import { InternshipOfferService } from '../../services/internship-offer.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './company-profile.html',
  styleUrls: ['./company-profile.scss'],
})
export class CompanyProfileComponent {
  id: number = parseInt(window.location.pathname.split('/').pop() || '0', 10);
  company: Company | null = null;
  companyImageUrl: string | null = null;
  offers: InternshipOfferSimple[] = [];
  offerStatusFilter: 'all' | 'active' | 'inactive' = 'all';
  showAll = false;

  constructor(
    private router: Router,
    private companyService: CompanyService,
    private documentService: DocumentService,
    private offerService: InternshipOfferService
  ) {}

  ngOnInit() {
    this.companyService.getCompanyByToken().subscribe({
      next: (data: Company) => {
        this.company = data;

        this.documentService
          .getCompanyFirstImage(this.company.id)
          .subscribe((blob) => {
            this.companyImageUrl = URL.createObjectURL(blob);
          });

        this.offerService.getOffersByCompanyId(this.company.id).subscribe({
          next: (offers: InternshipOfferSimple[]) => {
            this.offers = offers;
            console.log('Offers fetched successfully:', this.offers);
          },
          error: (err) => {
            console.error('Error fetching offers:', err);
          },
        });
      },
      error: (err) => {
        console.error('Error fetching company profile:', err);
      },
    });
  }

  get filteredOffers(): InternshipOfferSimple[] {
    if (!this.offers) return [];
    if (this.offerStatusFilter === 'all') return this.offers;
    if (this.offerStatusFilter === 'active')
      return this.offers.filter((o) => o.isOffer);
    if (this.offerStatusFilter === 'inactive')
      return this.offers.filter((o) => !o.isOffer);
    return this.offers;
  }

  goToOffer(offerId: number) {
    this.router.navigate(['/offer', offerId]);
  }

}
