import { Component } from '@angular/core';
import { InternshipOfferSimple } from '../../models/internship-offer.model';
import { InternshipOfferService } from '../../services/internship-offer.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-internship-offers',
  imports: [CommonModule, FormsModule],
  templateUrl: './internship-offers.html',
  styleUrl: './internship-offers.scss'
})
export class InternshipOffers {
  offers: InternshipOfferSimple[] = [];
  filteredOffers: InternshipOfferSimple[] = [];
  showAll = false;
  searchTerm: string = '';

  constructor(private offerService: InternshipOfferService) {}

  ngOnInit(): void {
    this.offerService.getAllSimpleOffers().subscribe({
      next: (data) => {
        this.offers = data;
        this.updateFilteredOffers();
      },
      error: (err) => {
        console.error('Erro ao buscar ofertas:', err);
      }
    });
  }

  updateFilteredOffers(): void {
    const term = this.searchTerm?.toLowerCase() || '';
    let filtered = this.offers.filter(o =>
      !term || o.title.toLowerCase().includes(term)
    );
    this.filteredOffers = this.showAll ? filtered : filtered.slice(0, 6);
  }

  onSearchTermChange(): void {
    this.updateFilteredOffers();
  }
}
