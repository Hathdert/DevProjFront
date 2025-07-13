import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../models/user.model';
import { Company } from '../../models/company.model';
import { Candidate } from '../../models/candidate.model';
import { Document } from '../../models/document.model';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent {
  selectedType: 'candidate' | 'company' = 'candidate';
  profilePicFile: File | null = null;

  company: Company = {
    id: 0,
    name: '',
    email: '',
    password: '',
    role: '',
    registrationDate: '',
    registrationTime: '',
    address: '',
    phone: '',
    description: '',
    area: '',
    documents: [],
    nipc: 0,
    approvalStatus: 0,
  };

  candidate: Candidate = {
    id: 0,
    name: '',
    email: '',
    password: '',
    role: '',
    registrationDate: '',
    registrationTime: '',
    address: '',
    phone: '',
    birthDate: '',
    documents: [],
  };

  document: Document = {
    fileName: '',
    fileType: '',
    filePath: '',
    uploadDate: '',
    company: this.company,
    candidate: this.candidate,
    application: null as any,
  };

  constructor(private router: Router, private http: HttpClient) {}

  companyForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    role: new FormControl(''),
    registrationDate: new FormControl(''),
    registrationTime: new FormControl(''),
    address: new FormControl(''),
    phone: new FormControl(''),
    description: new FormControl(''),
    area: new FormControl(''),
    documents: new FormControl([]),
    nipc: new FormControl(0),
    approvalStatus: new FormControl(0),
  });

  candidateForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    role: new FormControl(''),
    registrationDate: new FormControl(''),
    registrationTime: new FormControl(''),
    address: new FormControl(''),
    phone: new FormControl(''),
    birthDate: new FormControl(''),
    documents: new FormControl([]),
  });

  onSubmitCompany() {
    if (this.companyForm.valid) {
      const request = { ...this.companyForm.value, role: 'company'  };
      this.http.post<any>('http://localhost:8080/register', request, { responseType: 'text' as 'json' }).subscribe({
        next: () => {
          console.log('Company registered');
          if (this.profilePicFile) {
            this.uploadCompanyProfilePic(request.email);
          } else {
            this.router.navigate(['/login']);
          }
        },
        error: (err) => console.error('Registration error:', err),
      });
    } else {
      console.error('Company form is invalid');
    }
  }

   onSubmitCandidate() {
     if (this.candidateForm.valid) {
       const request = { ...this.candidateForm.value, role: 'candidate' };
       console.log(this.profilePicFile);
       this.http.post('http://localhost:8080/register', request, { responseType: 'text' }).subscribe({
         next: () => {
           if (this.profilePicFile) {  
             console.log(this.profilePicFile);
            
             this.uploadCandidateProfilePic(request.email);
           }else {
             this.router.navigate(['/login']);
          }
         },
        error: (err) => {console.error('Registration error:', err);
          console.log(this.profilePicFile);
           
        },
      });
     } else {
      console.error('Candidate form is invalid');
    }
  }



  onProfilePicSelected(event: Event, type: 'company' | 'candidate') {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.profilePicFile = input.files[0];
      console.log(`Selected profile picture for ${type}:`, this.profilePicFile);
    }
  }

  uploadCompanyProfilePic(companyEmail: string) {
    const formData = new FormData();
    formData.append('file', this.profilePicFile!);
    console.log('Uploading profile picture for company:', companyEmail);
    console.log('Profile picture file:', this.profilePicFile);
    console.log('Form data:', formData);
    formData.append('companyEmail', companyEmail);
    this.http
      .post('http://localhost:8080/api/documents/upload/company', formData)
      .subscribe({
        next: () => {
          console.log('Profile picture uploaded');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Profile picture upload error:', err);
          this.router.navigate(['/login']);
        },
      });
  }

  uploadCandidateProfilePic(candidateEmail: string) {
    const formData = new FormData();
    formData.append('file', this.profilePicFile!);
    console.log('Uploading profile picture for candidate:', candidateEmail);
    console.log('Profile picture file:', this.profilePicFile);
    console.log('Form data:', formData);
    formData.append('candidateEmail', candidateEmail);
    this.http
      .post('http://localhost:8080/api/documents/upload/candidate', formData)
      .subscribe({
        next: () => {
          console.log('Profile picture uploaded');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Profile picture upload error:', err);
          this.router.navigate(['/login']);
        },
      });
  }
}
