export interface GuardianData {
  phone: string;
  termsAgreed: boolean;
}

export interface StudentData {
  graduationYear: number | "Graduated",
  guardianEmail: string,
  location: string,
  schoolId: string | null,
  schoolName: string,
  addGuardianLater: boolean,
  termsAgreed: boolean,
}