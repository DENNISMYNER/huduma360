import { Request, Response, Router } from "express";
import { ApplicationStatus, Role } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok } from "../../utils/respond";
import { requireAuth, requireRole } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import * as applicationsService from "./service";
import { adminListQuerySchema, createApplicationSchema, idParamSchema, listMineQuerySchema, updateStatusSchema } from "./schemas";

const router = Router();

// Create a new application
router.post(
  "/",
  requireAuth,
  validate({ body: createApplicationSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const { serviceId, formData } = req.body as { serviceId: string; formData: Record<string, unknown> };
    const application = await applicationsService.createApplication(req.user!.id, serviceId, formData);
    ok(res, { application }, 201);
  })
);

// List my applications
router.get(
  "/",
  requireAuth,
  validate({ query: listMineQuerySchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const { status, page, pageSize } = req.query as unknown as {
      status?: ApplicationStatus;
      page: number;
      pageSize: number;
    };
    const where = { userId: req.user!.id, ...(status ? { status } : {}) };
    const [items, total] = await Promise.all([
      prisma.application.findMany({
        where,
        include: { service: { include: { category: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.application.count({ where }),
    ]);
    ok(res, { items, total, page, pageSize });
  })
);

// Admin: list all applications
router.get(
  "/admin",
  requireAuth,
  requireRole(Role.ADMIN, Role.STAFF),
  validate({ query: adminListQuerySchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const { status, q, page, pageSize } = req.query as unknown as {
      status?: ApplicationStatus;
      q?: string;
      page: number;
      pageSize: number;
    };
    const where = {
      ...(status ? { status } : {}),
      ...(q ? { referenceNumber: { contains: q, mode: "insensitive" as const } } : {}),
    };
    const [items, total] = await Promise.all([
      prisma.application.findMany({
        where,
        include: {
          service: { select: { name: true, slug: true } },
          user: { select: { fullName: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.application.count({ where }),
    ]);
    ok(res, { items, total, page, pageSize });
  })
);

// Get one application (owner or staff/admin)
router.get(
  "/:id",
  requireAuth,
  validate({ params: idParamSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const application = await applicationsService.getApplicationForUser(req.params.id, req.user!);
    ok(res, { application });
  })
);

// Admin/staff: update status
router.patch(
  "/:id/status",
  requireAuth,
  requireRole(Role.ADMIN, Role.STAFF),
  validate({ params: idParamSchema, body: updateStatusSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const { status, note } = req.body as { status: ApplicationStatus; note?: string };
    const application = await applicationsService.updateApplicationStatus(req.params.id, status, note, req.user!.id);
    ok(res, { application });
  })
);

export default router;
