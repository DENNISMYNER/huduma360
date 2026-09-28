import { z } from "zod";
import { ApplicationStatus } from "@prisma/client";

export const createApplicationSchema = z.object({
  serviceId: z.string().uuid(),
  formData: z.record(z.string(), z.any()).refine((data) => Object.keys(data).length > 0, {
    message: "Application form data is required",
  }),
});

export const listMineQuerySchema = z.object({
  status: z.nativeEnum(ApplicationStatus).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const adminListQuerySchema = z.object({
  status: z.nativeEnum(ApplicationStatus).optional(),
  q: z.string().trim().optional(), // matches reference number
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const updateStatusSchema = z.object({
  status: z.nativeEnum(ApplicationStatus),
  note: z.string().trim().max(500).optional(),
});

export const idParamSchema = z.object({ id: z.string().uuid() });
