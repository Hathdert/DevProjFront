export interface InternshipOfferCreate {
  title: string;
  description: string;
  requirements: string;
  area: string;
  startDate: string;
  endDate: string;
  vacancies: number;
  company: {
    id: number;
  };
  isOffer: boolean;
}