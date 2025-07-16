import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Company } from '../../models/company.model';
import { Candidate } from '../../models/candidate.model';
import { Document } from '../../models/document.model';

import { HttpClient } from '@angular/common/http';
import { QuillModule } from 'ngx-quill';
@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, QuillModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent {
  selectedType: 'candidate' | 'company' = 'candidate';
  profilePicFile: File | null = null;
  success = false;

  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      [{ header: [1, 2, 3, false] }],
      ['clean'],
    ],
  };

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
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    role: new FormControl(''),
    registrationDate: new FormControl(''),
    registrationTime: new FormControl(''),
    address: new FormControl('', [Validators.required]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]{9}$'),
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(100),
      Validators.maxLength(500),
    ]),
    area: new FormControl('', [Validators.required]),
    documents: new FormControl(
      [],
      [Validators.required, maxFileSizeValidator(1024)]
    ),
    nipc: new FormControl(0, [
      Validators.required,
      Validators.pattern(/^\d{9}$/),
    ]),
    approvalStatus: new FormControl(0, [Validators.required]),
  });

  candidateForm: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    role: new FormControl(''),
    registrationDate: new FormControl(''),
    registrationTime: new FormControl(''),
    address: new FormControl('', [Validators.required]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]{9}$'),
    ]),
    birthDate: new FormControl('', [
      Validators.required,
      ageMoreThan18Validator,
    ]),
    documents: new FormControl(
      [],
      [Validators.required, maxFileSizeValidator(1024)]
    ),
  });

  setServerFieldError(
    form: FormGroup,
    fieldName: string,
    message: string
  ): void {
    const control = form.get(fieldName);
    if (control) {
      control.setErrors({ serverError: message });
      control.markAsTouched();
    }
  }
  onSubmitCompany() {
    if (this.companyForm.valid) {
      const request = { ...this.companyForm.value, role: 'company' };
      this.http
        .post<any>('http://localhost:8080/register', request, {
          responseType: 'text' as 'json',
        })
        .subscribe({
          next: () => {
            console.log('Company registered');
            if (this.profilePicFile) {
              this.uploadCompanyProfilePic(request.email);
            } else {
              this.router.navigate(['/login']);
            }
          },
          error: (err) => {
            console.error('Registration error:', err);
            if (err.status === 409 && err.error) {
              let errorMsg = 'Erro desconhecido';

              // Tenta fazer o parse da string JSON
              try {
                const errorObj = JSON.parse(err.error);
                errorMsg = errorObj.message || errorMsg;
              } catch {
                errorMsg = err.error; // se não for JSON, usa direto
              }

              this.setServerFieldError(this.companyForm, 'email', errorMsg);
            }
          },
        });
    } else {
      console.error('Company form is invalid');
    }
  }

  onSubmitCandidate() {
    if (this.candidateForm.valid) {
      const request = { ...this.candidateForm.value, role: 'candidate' };
      this.http
        .post('http://localhost:8080/register', request, {
          responseType: 'text',
        })
        .subscribe({
          next: () => {
            if (this.profilePicFile) {
              console.log(this.profilePicFile);

              this.uploadCandidateProfilePic(request.email);
            } else {
              this.router.navigate(['/login']);
            }
          },
          error: (err) => {
            console.error('Registration error:', err);
            if (err.status === 409 && err.error) {
              let errorMsg = 'Erro desconhecido';

              // Tenta fazer o parse da string JSON
              try {
                const errorObj = JSON.parse(err.error);
                console.log('Error object:', errorObj);
                console.log('Error message:', errorObj.message);

                errorMsg = errorObj.message || errorMsg;
              } catch {
                errorMsg = err.error;
              }

              this.setServerFieldError(this.candidateForm, 'email', errorMsg);
            }
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

      if (type === 'candidate') {
        this.candidateForm.get('documents')?.setValue([this.profilePicFile]);
        this.candidateForm.get('documents')?.markAsTouched();
      } else if (type === 'company') {
        this.companyForm.get('documents')?.setValue([this.profilePicFile]);
        this.companyForm.get('documents')?.markAsTouched();
      }
    }
  }

  uploadCompanyProfilePic(companyEmail: string) {
    const formData = new FormData();
    formData.append('file', this.profilePicFile!);
    formData.append('companyEmail', companyEmail);
    this.http
      .post('http://localhost:8080/api/documents/upload/company', formData)
      .subscribe({
        next: () => {
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2500);
        },
        error: (err) => {
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2500);
        },
      });
  }

  uploadCandidateProfilePic(candidateEmail: string) {
    const formData = new FormData();
    formData.append('file', this.profilePicFile!);
    formData.append('candidateEmail', candidateEmail);
    this.http
      .post('http://localhost:8080/api/documents/upload/candidate', formData)
      .subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2500);
        },
      });
  }

  emailErrorMessage: string | null = null;
  // Function to check if email is already taken
  // This function is called on email input blur
  onEmailBlur() {
    const emailControl = this.candidateForm.get('email');
    if (!emailControl || !emailControl.value) {
      this.emailErrorMessage = null;
      return;
    }

    const email = encodeURIComponent(emailControl.value);
    this.http
      .get<{ taken: boolean; message?: string }>(
        `http://localhost:8080/check-email?email=${email}`
      )
      .subscribe((response) => {

        if (response.taken) {

          // Set error with emailTaken
          emailControl.setErrors({ ...emailControl.errors, emailTaken: true });
          // Set the error message
          this.emailErrorMessage =
            response.message || 'Email is already in use.';
        } else {
          // Remove emailTaken error if it exists
          if (emailControl.hasError('emailTaken')) {
            const errors = { ...emailControl.errors };
            delete errors['emailTaken'];
            if (Object.keys(errors).length === 0) {
              emailControl.setErrors(null);
            } else {

              emailControl.setErrors(errors);
            }
          }
          this.emailErrorMessage = null;
        }
      });
  }
}

export function ageMoreThan18Validator(
  control: FormControl
): { [key: string]: boolean } | null {
  const birthDate = new Date(control.value);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    return age < 18 ? { ageLessThan18: true } : null;
  }
  return age < 18 ? { ageLessThan18: true } : null;
}

export function maxFileSizeValidator(maxSizeKB: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const files = control.value as File[];
    if (files?.length) {
      for (let file of files) {
        if (file.size > maxSizeKB * 1024) {
          return { maxSize: true };
        }
      }
    }
    return null;
  };
}
