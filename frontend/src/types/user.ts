export type Role = "USER" | "STAFF" | "ADMIN";

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  county: string | null;
  nationalId: string | null;
  role: Role;
  emailVerified: boolean;
  createdAt: string;
}
