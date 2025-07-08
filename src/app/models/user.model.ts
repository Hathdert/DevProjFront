export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string; // 'student' or 'company' or 'admin'
  registrationDate: string; // e.g., '2025-07-08'
  registrationTime: string; // e.g., '14:30:00'
}