import { Component, OnInit } from '@angular/core';
import { InternshipOfferSimple } from '../../models/internship-offer.model';
import { InternshipOfferService } from '../../services/internship-offer.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Company } from '../../models/company.model';
import { HttpClient } from '@angular/common/http';

import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HomeService } from '../../services/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.scss',
  standalone: true,
  imports: [ CommonModule, FormsModule, RouterModule],
})
export class Home implements OnInit {
  offers: InternshipOfferSimple[] = [];
  topCompanies: Company[] = [];
  showAll = false;

  clippyPhrases: string[] = [
    'Welcome to SkillBridge!',
    'Find your dream internship here!',
    'Check out the top companies!',
    'Need help? Contact us!',
    'Explore new opportunities!',
    'Apply now and boost your career!'
  ];
  currentClippyPhrase: string = this.clippyPhrases[0];
  private clippyInterval: any;

  constructor(
    private offerService: InternshipOfferService,
    private homeService: HomeService 
  ) {}

  ngOnInit(): void {
    this.offerService.getTop8Offers().subscribe({
      next: (data) => {
        this.offers = data;
      },
      error: (err) => {
        console.error('Erro ao buscar ofertas:', err);
      }
    });

    // Search top 6 companies using HomeService
    this.homeService.getTop6Companies().subscribe({
      next: (data) => {
        this.topCompanies = data;
      },
      error: (err) => {
        console.error('Erro ao buscar empresas:', err);
      }
    });

    // Clippy phrase rotation
    let idx = 0;
    this.clippyInterval = setInterval(() => {
      idx = (idx + 1) % this.clippyPhrases.length;
      this.currentClippyPhrase = this.clippyPhrases[idx];
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.clippyInterval) {
      clearInterval(this.clippyInterval);
    }
  }
}