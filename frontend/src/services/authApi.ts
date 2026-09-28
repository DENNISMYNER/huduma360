import { request } from "./httpClient";
import type { User } from "../types/user";

export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  county?: string;
  nationalId?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export const authApi = {
  register: (input: RegisterInput) => request<{ user: User }>("/auth/register", { method: "POST", body: input }),
  login: (input: LoginInput) => request<{ user: User }>("/auth/login", { method: "POST", body: input }),
  logout: () => request<{ loggedOut: boolean }>("/auth/logout", { method: "POST" }),
  me: () => request<{ user: User }>("/auth/me"),
  forgotPassword: (email: string) =>
    request<{ requested: boolean }>("/auth/forgot-password", { method: "POST", body: { email } }),
  resetPassword: (token: string, password: string) =>
    request<{ reset: boolean }>("/auth/reset-password", { method: "POST", body: { token, password } }),
};
