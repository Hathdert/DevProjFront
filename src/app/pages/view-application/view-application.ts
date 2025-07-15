import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { ApplicationService } from '../../services/application.service';

@Component({
  selector: 'app-view-application',
  imports: [CommonModule, FormsModule],
  templateUrl: './view-application.html',
  styleUrl: './view-application.scss'
})
export class ViewApplication implements OnInit {
  application: any;
  candidate: any;

  constructor(
    private http: HttpClient,
    private location: Location,
    private applicationService: ApplicationService
  ) {}

  goBack() {
    this.location.back();
  }

  ngOnInit(): void {

    //const id = Number(this.route.snapshot.paramMap.get('id'));
    // Busca application
    this.http.get('http://localhost:8080/api/applications/8').subscribe({
      next: (data) => {
        this.application = data;
        // Busca candidate usando o endpoint novo
        this.http.get('http://localhost:8080/api/applications/8/candidate').subscribe({
          next: (cand) => this.candidate = cand,
          error: (err) => console.error('Erro ao buscar candidate:', err)
        });
      },
      error: (err) => console.error('Erro ao buscar application:', err)
    });
  }

  changeApplicationStatus(applicationId: number, status: number) {
    this.applicationService.changeOfferStatus(applicationId, status).subscribe({
      next: (updatedApp) => {
        this.application = updatedApp;
      },
      error: () => alert('Failed to change application status'),
    });
  }
}
