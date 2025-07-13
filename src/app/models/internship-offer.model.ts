import { Application } from "./application.model";
import { Company } from "./company.model";

export interface InternshipOfferSimple {
  id: number;
  title: string;
  description: string;
  requirements: string;
  area: string;
  startDate: string;
  endDate: string;
  vacancies: number;
  company: Company;
  offer: boolean;
  applications: Application[];
}
