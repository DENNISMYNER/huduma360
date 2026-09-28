import { z } from "zod";
import { PaymentMethod, PaymentStatus } from "@prisma/client";

export const createPaymentSchema = z.object({
  applicationId: z.string().uuid(),
  method: z.nativeEnum(PaymentMethod),
  phone: z
    .string()
    .trim()
    .regex(/^(?:\+254|0)?7\d{8}$/, "Enter a valid Kenyan phone number")
    .optional(),
});

export const webhookSchema = z.object({
  transactionRef: z.string().min(1),
  status: z.nativeEnum(PaymentStatus),
  providerRef: z.string().optional(),
  failureReason: z.string().optional(),
});

export const idParamSchema = z.object({ id: z.string().uuid() });

export const adminListQuerySchema = z.object({
  status: z.nativeEnum(PaymentStatus).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
