import { z } from "zod";
import { Role } from "@prisma/client";

export const updateProfileSchema = z.object({
  fullName: z.string().trim().min(2).max(120).optional(),
  phone: z.string().trim().min(7).max(20).optional(),
  county: z.string().trim().min(2).max(60).optional(),
});

export const adminListUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().trim().optional(),
  role: z.nativeEnum(Role).optional(),
});

export const adminUpdateRoleSchema = z.object({
  role: z.nativeEnum(Role),
});

export const adminUserIdParamSchema = z.object({
  id: z.string().uuid(),
});
