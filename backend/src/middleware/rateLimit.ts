import rateLimit from "express-rate-limit";
import { env } from "../config/env";

/** General API rate limit. */
export const apiLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { message: "Too many requests — please slow down." } },
});

/** Tighter limit for auth endpoints to slow down credential-stuffing / brute force. */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.isTest ? 10000 : 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { message: "Too many attempts — please try again later." } },
});
