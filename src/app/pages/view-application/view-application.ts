import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common'; // importação adicionada
import { ApplicationService } from '../../services/application.service';

@Component({
  selector: 'app-view-application',
  imports: [CommonModule, FormsModule],
  templateUrl: './view-application.html',
  styleUrl: './view-application.scss'
})
export class ViewApplication implements OnInit {
  application: any;

  constructor(private http: HttpClient, private location: Location, private applicationService: ApplicationService) { } // injeta Location

  goBack() {
    this.location.back();
  }

  ngOnInit(): void {
    this.http.get('http://localhost:8080/api/applications/8').subscribe({
      next: (data) => this.application = data,
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
