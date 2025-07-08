import { User } from './user.model';
import { Document } from './document.model';

export interface Candidate extends User {
  address: string;
  phone: string;
  birthDate: string; // e.g., '2025-07-08'
  documents: Document[];
}