import { Component } from '@angular/core';
import { InternshipOfferSimple } from '../../models/internship-offer.model';
import { InternshipOfferService } from '../../services/internship-offer.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-internship-offers',
  imports: [CommonModule],
  templateUrl: './internship-offers.html',
  styleUrl: './internship-offers.scss'
  
})
export class InternshipOffers {
offers: InternshipOfferSimple[] = [];
  showAll = false;

  constructor(private offerService: InternshipOfferService) {}

  ngOnInit(): void {
    this.offerService.getAllSimpleOffers().subscribe({
      next: (data) => {
        this.offers = data;
      },
      error: (err) => {
        console.error('Erro ao buscar ofertas:', err);
      }
    });
  }
}
