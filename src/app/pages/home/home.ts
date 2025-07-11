import { Component, OnInit } from '@angular/core';
import { InternshipOfferSimple } from '../../models/internship-offer.model';
import { InternshipOfferService } from '../../services/internship-offer.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.scss',
  standalone: true,
  imports: [CommonModule],
})
export class Home implements OnInit {
  offers: InternshipOfferSimple[] = [];
  showAll = false;

  constructor(private offerService: InternshipOfferService) {}

  ngOnInit(): void {
    this.offerService.getTop8Offers().subscribe({
      next: (data) => {
        this.offers = data;
      },
      error: (err) => {
        console.error('Erro ao buscar ofertas:', err);
      }
    });
  }
}