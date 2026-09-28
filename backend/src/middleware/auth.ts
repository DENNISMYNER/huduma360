import { NextFunction, Request, Response } from "express";
import { Role } from "@prisma/client";
import { env } from "../config/env";
import { prisma } from "../config/prisma";
import { verifyToken } from "../utils/jwt";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";

export interface AuthedUser {
  id: string;
  email: string;
  fullName: string;
  role: Role;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthedUser;
    }
  }
}

/** Reads the JWT from the httpOnly cookie, verifies it, and loads the current user onto req.user. */
export const requireAuth = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const token = req.cookies?.[env.cookieName];
  if (!token) throw AppError.unauthorized();

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw AppError.unauthorized("Session expired or invalid — please log in again");
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user || !user.isActive) throw AppError.unauthorized();

  req.user = { id: user.id, email: user.email, fullName: user.fullName, role: user.role };
  next();
});

/** Like requireAuth, but does not fail when no session is present — used on public routes that behave
 *  differently for logged-in users (e.g. showing whether a service is already saved). */
export const attachUserIfPresent = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const token = req.cookies?.[env.cookieName];
  if (!token) return next();
  try {
    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (user && user.isActive) {
      req.user = { id: user.id, email: user.email, fullName: user.fullName, role: user.role };
    }
  } catch {
    // ignore invalid token on optional-auth routes
  }
  next();
});

/** Restricts a route to one or more roles. Must run after requireAuth. */
export const requireRole = (...roles: Role[]) => (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user) return next(AppError.unauthorized());
  if (!roles.includes(req.user.role)) return next(AppError.forbidden());
  next();
};
