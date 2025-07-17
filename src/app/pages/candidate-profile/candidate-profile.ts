import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CandidateService } from '../../services/candidate.service';
import { DocumentService } from '../../services/document.service';
import { CommonModule } from '@angular/common';
import { Candidate } from '../../models/candidate.model';
import { FormsModule } from '@angular/forms';

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

  constructor(
    private router: Router,
    private candidateService: CandidateService,
    private documentService: DocumentService
  ) { }

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
      },
      error: (err) => {
        console.error('Erro searching candidate profile:', err);
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
        console.log('Perfil updated');
      },
      error: (err) => {
        console.error('Erro updating profile:', err);
      },
    });
  }


}
