import { Request, Response, Router } from "express";
import { PaymentMethod, PaymentStatus, Role } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok } from "../../utils/respond";
import { AppError } from "../../utils/AppError";
import { requireAuth, requireRole } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import * as paymentsService from "./service";
import { adminListQuerySchema, createPaymentSchema, idParamSchema, webhookSchema } from "./schemas";

const router = Router();

router.post(
  "/",
  requireAuth,
  validate({ body: createPaymentSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const { applicationId, method, phone } = req.body as { applicationId: string; method: PaymentMethod; phone?: string };
    const payment = await paymentsService.initiatePayment(req.user!.id, applicationId, method, phone);
    ok(res, { payment }, 201);
  })
);

router.get(
  "/:id",
  requireAuth,
  validate({ params: idParamSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const payment = await prisma.payment.findUnique({ where: { id: req.params.id } });
    if (!payment) throw AppError.notFound("Payment not found");
    const isOwner = payment.userId === req.user!.id;
    const isStaffOrAdmin = req.user!.role === Role.ADMIN || req.user!.role === Role.STAFF;
    if (!isOwner && !isStaffOrAdmin) throw AppError.forbidden();
    ok(res, { payment });
  })
);

// Mock/real provider callback — in production this would be signature-verified against the provider.
router.post(
  "/webhook",
  validate({ body: webhookSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const { transactionRef, status, providerRef, failureReason } = req.body as {
      transactionRef: string;
      status: PaymentStatus;
      providerRef?: string;
      failureReason?: string;
    };
    const payment = await paymentsService.handleWebhook(transactionRef, status, providerRef, failureReason);
    ok(res, { payment });
  })
);

router.get(
  "/admin/all",
  requireAuth,
  requireRole(Role.ADMIN, Role.STAFF),
  validate({ query: adminListQuerySchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const { status, page, pageSize } = req.query as unknown as { status?: PaymentStatus; page: number; pageSize: number };
    const where = { ...(status ? { status } : {}) };
    const [items, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          application: { select: { referenceNumber: true } },
          user: { select: { fullName: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.payment.count({ where }),
    ]);
    ok(res, { items, total, page, pageSize });
  })
);

export default router;
