import { Company } from "./company.model";
import { Candidate } from "./candidate.model";
import { Application } from "./application.model";

export interface Document {
  fileName: string;
  fileType: string;
  filePath: string;
  uploadDate: string; // e.g., '2025-07-08'
  company: Company;
  candidate: Candidate;
  application: {
    id: number;
  };
}