import { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import { AppError } from "../utils/AppError";
import { env } from "../config/env";

const CSRF_COOKIE = "h360_csrf";
const CSRF_HEADER = "x-csrf-token";
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/** Issues a CSRF token cookie (readable by JS, not httpOnly) if one isn't already set. */
export function issueCsrfToken(req: Request, res: Response, next: NextFunction) {
  if (!req.cookies?.[CSRF_COOKIE]) {
    const token = crypto.randomBytes(24).toString("hex");
    res.cookie(CSRF_COOKIE, token, {
      httpOnly: false, // must be readable by frontend JS to echo back in the header
      secure: env.isProduction,
      sameSite: "lax",
      path: "/",
    });
  }
  next();
}

/** Double-submit cookie check: the header value must match the cookie value.
 *  A cross-site page cannot read our cookie, so it cannot forge a matching header. */
export function verifyCsrfToken(req: Request, _res: Response, next: NextFunction) {
  if (SAFE_METHODS.has(req.method)) return next();

  const cookieToken = req.cookies?.[CSRF_COOKIE];
  const headerToken = req.headers[CSRF_HEADER];

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return next(AppError.forbidden("Invalid or missing CSRF token"));
  }
  next();
}
