import { Component } from '@angular/core';
import { InternshipOfferService } from '../../services/internship-offer.service';
import { InternshipOfferCreate } from '../../models/internship-offer-create.model';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-add-internship-offer',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-internship-offer.html',
  styleUrls: ['./add-internship-offer.scss']
  
})
export class AddInternshipOfferComponent {
    id: number = parseInt(window.location.pathname.split('/').pop() || '0', 10); 
    companyId: number = 0;
    today: string = new Date().toISOString().split('T')[0];

  offer: InternshipOfferCreate = {
    title: '',
    description: '',
    requirements: '',
    area: '',
    startDate: '',
    endDate: '',
    vacancies: 1,
    company: { id: 1 },
    offer: true
  };
  success = false;
  error = '';

  constructor(
    private offerService: InternshipOfferService,
    private companyService: CompanyService, 
    private router: Router
  ) {
    this.companyService.getCompanyByToken().subscribe({
      next: (company) => {
        this.companyId = company.id;
        this.offer.company.id = company.id; 
      },
      error: () => {
        this.companyId = 0;
      }
    });
  }

  submit(offerForm: NgForm) {
    if (offerForm.invalid) {
      Object.values(offerForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }
    this.offerService.createOffer(this.offer).subscribe({
      next: () => {
        this.success = true;
        this.error = '';
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 2500);
      },
      error: err => {
        this.success = false;
        this.error = 'Erro adding offer';
      }
    });
  }
}
