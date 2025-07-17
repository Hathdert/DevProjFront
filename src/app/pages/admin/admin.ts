import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CandidateADM, CompanyADM, AdminService } from '../../services/admin.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss'],
  imports: [CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Admin implements OnInit {

  // CANDIDATES
  candidates: CandidateADM[] = [];
  filteredCandidates: CandidateADM[] = [];
  emailFilterCandidates: string = '';

  // COMPANIES
  companies: CompanyADM[] = [];
  filteredCompanies: CompanyADM[] = [];
  emailFilterCompanies: string = '';

  constructor(private adminService: AdminService, private http: HttpClient) { }

  ngOnInit(): void {
    // Carregar candidatos
    this.adminService.getCandidates().subscribe({
      next: data => {
        this.candidates = data;
        this.filteredCandidates = data;
      },
      error: err => console.error('Erro ao carregar candidatos:', err)
    });

    // Carregar empresas
    this.adminService.getCompanies().subscribe({
      next: data => {
        this.companies = data;
        this.filteredCompanies = data;
      },
      error: err => console.error('Erro ao carregar empresas:', err)
    });
  }

  filterCandidates(): void {
    const filter = this.emailFilterCandidates.toLowerCase().trim();
    this.filteredCandidates = filter ? this.candidates.filter(c => c.email.toLowerCase().includes(filter)) : this.candidates;
  }

  filterCompanies(): void {
    const filter = this.emailFilterCompanies.toLowerCase().trim();
    this.filteredCompanies = filter ? this.companies.filter(c => c.email.toLowerCase().includes(filter)) : this.companies;
  }

  downloadCSV(type: string, filename: string) {
    this.adminService.downloadCSV(type as any).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        alert('Failed to download CSV.');
      }
    });
  }

  showDetails(id: number | string, event: Event) {
  event.preventDefault(); 
  alert(`ID: ${id}`);
}

  approveCompany(companyId: number) {
    this.http.put(`http://localhost:8080/api/companies/${companyId}/approval-status`, {
      approvalStatus: 1
    }).subscribe({
      next: () => {
        const company = this.filteredCompanies.find(c => c.id === companyId);
        if (company) company.approvalStatus = 1;
      },
      error: () => {
        alert('Erro ao aprovar empresa.');
      }
    });
  }

  rejectCompany(companyId: number) {
    this.http.put(`http://localhost:8080/api/companies/${companyId}/approval-status`, {
      approvalStatus: 2
    }).subscribe({
      next: () => {
        const company = this.filteredCompanies.find(c => c.id === companyId);
        if (company) company.approvalStatus = 2;
      },
      error: () => {
        alert('Erro ao reprovar empresa.');
      }
    });
  }
}
