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
  imports: [CommonModule, FormsModule],
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
                    console.error('Erro finding offer via offerid :', err);
                  },
                });
              },
              error: (err) => {
                console.error('Error finding offer via Application ID:', err);
              },
            });
          });
        },
        error: (err) => {
          console.error('Error  finding applications', err);
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
        title: 'Profile updated!',
        text: 'Information saved success.',
        timer: 2000,
        showConfirmButton: false
      });
    },
    error: (err) => {

      Swal.fire({
        icon: 'error',
        title: 'Error to save',
        text: 'Error occured during update. Try again.',
      });
    },
  });
}
deleteCandidate(): void {
  Swal.fire({
    title: 'Are you sure?',
    input: 'password',
    inputLabel: 'Enter your password to confirm',
    inputPlaceholder: 'Password',
    text: 'This action will permanently delete the candidate and all related data!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#d33'
  }).then((result) => {
    if (result.isConfirmed) {
      const password = result.value;
      this.candidateService.deleteCandidateByToken(password).subscribe({
        next: () => {
          localStorage.removeItem('jwtToken');
          Swal.fire('Deleted!', 'The candidate has been successfully removed.', 'success').then(() => {
            this.router.navigate(['/login']);
          });
        },
        error: (err) => {
          if (err.status === 200 || err.status === 204) {
            localStorage.removeItem('jwtToken');
            Swal.fire('Deleted!', 'The candidate has been successfully removed.', 'success').then(() => {
              this.router.navigate(['/login']);
            });
          } else {
            console.error('Error deleting candidate:', err);
            Swal.fire('Error!', 'Failed to delete candidate. Please check your password.', 'error');
          }
        },
      });
    }
  });
}

  deletarAplicacaoUnica(applicationId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the application!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'No',
      confirmButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        this.applicationService
          .deleteApplicationById(applicationId)
          .subscribe({
            next: () => {
              Swal.fire(
                'Deleted!',
                'All applications have been deleted successfully.',
                'success'
              );
              this.loadCandidateApplications();
            },
            error: (err) => {
              Swal.fire('Erro!', 'There was a problem deleting.', 'error');
            },
          });
      }
    });
  }

  goBack() {
    window.history.back();
  }
}
