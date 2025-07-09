import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyService } from '../../services/company.service';
import { Company } from '../../models/company.model';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../services/document.service';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './private-company-profile.html',
  styleUrls: ['./private-company-profile.scss'],
})
export class PrivateCompanyProfileComponent {
  company: Company | null = null;
  companyImageUrl: string | null = null;

  constructor(
    private router: Router,
    private companyService: CompanyService,
    private documentService: DocumentService
  ) {}

  ngOnInit() {
    this.companyService.getCompanyByToken().subscribe({
      next: (data: Company) => {
        this.company = data;
        console.log('Perfil da empresa:', this.company);
        this.documentService
          .getCompanyFirstImage(this.company.id)
          .subscribe((blob) => {
            this.companyImageUrl = URL.createObjectURL(blob);
            console.log('URL da imagem da empresa:', this.companyImageUrl);
          });
      },
      error: (err) => {
        console.error('Erro ao buscar perfil da empresa:', err);
      },
    });
  }
  editCompany() {}
}
