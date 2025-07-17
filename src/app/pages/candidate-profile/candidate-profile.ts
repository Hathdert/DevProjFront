import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CandidateService } from '../../services/candidate.service';
import { DocumentService } from '../../services/document.service';
import { CommonModule } from '@angular/common';
import { Candidate } from '../../models/candidate.model';
import { FormsModule } from '@angular/forms';
import { ApplicationService } from '../../services/application.service';
import { InternshipOfferService } from '../../services/internship-offer.service';
import { Application } from '../../models/application.model';
import { InternshipOfferSimple } from '../../models/internship-offer.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-candidate-profile',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './candidate-profile.html',
  styleUrl: './candidate-profile.scss',
})
export class CandidateProfile {
  candidate: Candidate | null = null;
  candidateImageUrl: string | null = null;
  isEditing = false;
  editCandidateData: Candidate = {} as Candidate;
  applications: Application[] = [];
  showAll = false;
  showDeleteConfirm = false;
  deletePassword = '';
  constructor(
    private router: Router,
    private candidateService: CandidateService,
    private documentService: DocumentService,
    private applicationService: ApplicationService,
    private internshipOfferService: InternshipOfferService
  ) {}

  ngOnInit() {
    this.candidateService.getCandidateByToken().subscribe({
      next: (data: Candidate) => {
        this.candidate = data;
        this.documentService
          .getCandidateFirstImage(this.candidate.id)
          .subscribe((blob) => {
            this.candidateImageUrl = URL.createObjectURL(blob);
            console.log('URL image candidate:', this.candidateImageUrl);
          });
        this.loadCandidateApplications();
      },
      error: (err) => {
        console.error('Erro searching candidate profile:', err);
      },
    });
  }

  loadCandidateApplications() {
    if (!this.candidate) {
      return;
    }

    this.applicationService
      .getApplicationsByCandidateId(this.candidate.id)
      .subscribe({
        next: (apps: Application[]) => {
          this.applications = apps;

          apps.forEach((app: Application) => {
            this.applicationService.getOfferByApplicationId(app.id).subscribe({
              next: (offerByAppId) => {
                const offerId = offerByAppId.aplication.internshipOffer;
                this.internshipOfferService.getOfferById(offerId).subscribe({
                  next: (offerById) => {
                    app.internshipOffer = offerById;
                  },
                  error: (err) => {
                    console.error('Erro ao buscar oferta via Offer ID:', err);
                  },
                });
              },
              error: (err) => {
                console.error('Erro ao buscar oferta via Application ID:', err);
              },
            });
          });
        },
        error: (err) => {
          console.error('Erro ao buscar candidaturas:', err);
        },
      });
  }

  startEdit() {
    this.isEditing = true;
    this.editCandidateData = {
      ...(this.candidate as Candidate),
      name: this.candidate?.name ?? '',
      email: this.candidate?.email ?? '',
      address: this.candidate?.address ?? '',
      phone: this.candidate?.phone ?? '',
      birthDate: this.candidate?.birthDate ?? '',
    };
  }

  cancelEdit() {
    this.isEditing = false;
    this.editCandidateData = {} as Candidate;
  }

  saveEdit() {
  this.candidateService.updateCandidate(this.editCandidateData).subscribe({
    next: (updatedCandidate: Candidate) => {
      this.candidate = updatedCandidate;
      this.isEditing = false;

      Swal.fire({
        icon: 'success',
        title: 'Perfil atualizado!',
        text: 'As informações do candidato foram salvas com sucesso.',
        timer: 2000,
        showConfirmButton: false
      });
    },
    error: (err) => {
      console.error('Erro ao atualizar perfil do candidato:', err);

      Swal.fire({
        icon: 'error',
        title: 'Erro ao salvar',
        text: 'Ocorreu um erro ao atualizar o perfil. Tente novamente.',
      });
    },
  });
  deleteCandidate(password: string) {
    this.candidateService.deleteCandidateByToken(password).subscribe({
      next: () => {
        localStorage.removeItem('jwtToken');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        if (err.status === 200 || err.status === 204) {
          localStorage.removeItem('jwtToken');
          this.router.navigate(['/login']);
        } else {
          console.error('Error deleting candidate:', err);
          alert('Failed to delete candidate. Check your password.');
        }
      },
    });
  }
}

  deletarAplicacaoUnica(applicationId: number): void {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Essa ação vai deletar todas as aplicações do candidato!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, deletar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.applicationService
          .deleteApplicationById(applicationId)
          .subscribe({
            next: () => {
              Swal.fire(
                'Deletado!',
                'As aplicações foram removidas.',
                'success'
              );
              this.loadCandidateApplications();
            },
            error: (err) => {
              Swal.fire('Erro!', 'Houve um problema ao deletar.', 'error');
            },
          });
      }
    });
  }
}
