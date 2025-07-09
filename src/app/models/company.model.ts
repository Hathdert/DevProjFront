import { User } from './user.model';
import { Document } from './document.model';

export interface Company extends User {
  address: string;
  phone: string;
  description: string;
  area: string;
  documents: Document[];
  nipc: number;
  approvalStatus: number;
}