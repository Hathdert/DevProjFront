import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './private-company-profile.html',
  styleUrls: ['./private-company-profile.scss'],
})
export class PrivateCompanyProfileComponent {
  company: Company | null = null;
  companyImageUrl: string | null = null;
  offers: InternshipOfferSimple[] = [];
  offerStatusFilter: 'all' | 'active' | 'inactive' = 'all';
  isEditing = false;
  editCompanyData: Company = {} as Company;
  showDeleteConfirm = false;
  deletePassword = '';

  constructor(
    private router: Router,
    private companyService: CompanyService,
    private documentService: DocumentService,
    private offerService: InternshipOfferService
  ) { }

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
      return this.offers.filter((o) => o.offer);
    if (this.offerStatusFilter === 'inactive')
      return this.offers.filter((o) => !o.offer);
    return this.offers;
  }

  startEdit() {
    this.isEditing = true;
    this.editCompanyData = {
      ...(this.company as Company),
      name: this.company?.name ?? '',
      email: this.company?.email ?? '',
      phone: this.company?.phone ?? '',
      nipc: this.company?.nipc ?? 0,
      area: this.company?.area ?? '',
      address: this.company?.address ?? '',
      description: this.company?.description ?? '',
    };
  }

  cancelEdit() {
    this.isEditing = false;
  }

  saveEdit() {
    this.companyService.editCompany(this.editCompanyData).subscribe({
      next: (updated: Company) => {
        this.company = updated;
        this.isEditing = false;
      },
      error: () => alert('Failed to update company'),
    });
  }

  changeOfferStatus(offerId: number, status: boolean) {
    this.offerService.changeOfferStatus(offerId, status).subscribe({
      next: (updatedOffer: InternshipOfferSimple) => {
        const index = this.offers.findIndex((o) => o.id === updatedOffer.id);
        if (index !== -1) {
          this.offers[index] = updatedOffer;
        }
      },
      error: () => alert('Failed to change offer status'),
    });

  }

deleteCompany(password: string) {
  this.companyService.deleteCompanyByToken(password).subscribe({
    next: () => {
      localStorage.removeItem('jwtToken');
      this.router.navigate(['/login']);
    },
    error: (err) => {
      if (err.status === 200 || err.status === 204) {
        localStorage.removeItem('jwtToken');
        this.router.navigate(['/login']);
      } else {
        console.error('Error deleting company:', err);
        alert('Failed to delete company. Check your password.');
      }
    },
  });
}
}
