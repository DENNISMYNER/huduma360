import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { AppError } from "../utils/AppError";
import { logger } from "../utils/logger";
import { env } from "../config/env";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ success: false, error: { message: `Route not found: ${req.method} ${req.originalUrl}` } });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  // Known, deliberate application errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: { message: err.message, details: err.details },
    });
  }

  // Request validation errors
  if (err instanceof ZodError) {
    return res.status(422).json({
      success: false,
      error: { message: "Validation failed", details: err.flatten() },
    });
  }

  // Known Prisma errors (e.g. unique constraint violations, missing records)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({
        success: false,
        error: { message: `A record with this ${(err.meta?.target as string[])?.join(", ") || "value"} already exists` },
      });
    }
    if (err.code === "P2025") {
      return res.status(404).json({ success: false, error: { message: "Record not found" } });
    }
  }

  // Everything else is unexpected — log full detail server-side, never leak it to the client
  logger.error("Unhandled error", err);
  return res.status(500).json({
    success: false,
    error: {
      message: "Something went wrong. Please try again.",
      ...(env.isProduction ? {} : { debug: err instanceof Error ? err.message : String(err) }),
    },
  });
}
