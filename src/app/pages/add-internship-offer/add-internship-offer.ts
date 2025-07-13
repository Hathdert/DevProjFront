import { Component } from '@angular/core';
import { InternshipOfferService } from '../../services/internship-offer.service';
import { InternshipOfferCreate } from '../../models/internship-offer-create.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-internship-offer',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-internship-offer.html',
  styleUrls: ['./add-internship-offer.scss']
  
})
export class AddInternshipOfferComponent {
  offer: InternshipOfferCreate = {
    title: '',
    description: '',
    requirements: '',
    area: '',
    startDate: '',
    endDate: '',
    vacancies: 1,
    company: { id: 1 },
    isOffer: true
  };
  success = false;
  error = '';

  constructor(private offerService: InternshipOfferService, private router: Router) {}

  submit() {
    this.offerService.createOffer(this.offer).subscribe({
      next: () => {
        this.success = true;
        this.error = '';
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 2500); // tempo igual ao da animação
      },
      error: err => {
        this.success = false;
        this.error = 'Erro ao adicionar oferta';
      }
    });
  }
}
