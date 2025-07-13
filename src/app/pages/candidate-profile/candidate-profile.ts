import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CandidateService } from '../../services/candidate.service';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../services/document.service';
import { Candidate } from '../../models/candidate.model';

@Component({
  selector: 'app-candidate-profile',
  imports: [CommonModule],
  templateUrl: './candidate-profile.html',
  styleUrl: './candidate-profile.scss'
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
  ) {}

  ngOnInit() {
    this.candidateService.getCandidateByToken().subscribe({
      next: (data: Candidate) => {
        this.candidate = data;
        this.documentService
          .getCandidateFirstImage(this.candidate.id)
          .subscribe((blob) => {
            this.candidateImageUrl = URL.createObjectURL(blob);
            console.log('URL da imagem do candidato:', this.candidateImageUrl);
          });
      },
      error: (err) => {
        console.error('Erro ao buscar perfil do candidato:', err);
      },
    });
  }


}
