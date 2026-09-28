import { Request, Response } from "express";
import { User } from "@prisma/client";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok } from "../../utils/respond";
import { env } from "../../config/env";
import * as authService from "./service";
import { LoginInput, RegisterInput } from "./schemas";
import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";

export function toPublicUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    phone: user.phone,
    county: user.county,
    nationalId: user.nationalId,
    role: user.role,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
  };
}

function setAuthCookie(res: Response, token: string) {
  res.cookie(env.cookieName, token, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as RegisterInput;
  const { user, token } = await authService.registerUser(input, req.ip);
  setAuthCookie(res, token);
  ok(res, { user: toPublicUser(user) }, 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as LoginInput;
  const { user, token } = await authService.loginUser(input, req.ip);
  setAuthCookie(res, token);
  ok(res, { user: toPublicUser(user) });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie(env.cookieName, { path: "/" });
  ok(res, { loggedOut: true });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw AppError.unauthorized();
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) throw AppError.unauthorized();
  ok(res, { user: toPublicUser(user) });
});

export const requestVerifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body as { token: string };
  const result = await authService.verifyEmail(token);
  ok(res, result);
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body as { email: string };
  const result = await authService.requestPasswordReset(email);
  ok(res, result);
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, password } = req.body as { token: string; password: string };
  const result = await authService.resetPassword(token, password);
  ok(res, result);
});
