import { Candidate } from "./candidate.model";
import { Document } from "./document.model";
import { InternshipOfferSimple } from "./internship-offer.model";

export interface Application{
  id: number;
  candidate: Candidate;
  document: Document;
  pitch: string;
  state: number;
  internshipOffer: InternshipOfferSimple;
  
}
