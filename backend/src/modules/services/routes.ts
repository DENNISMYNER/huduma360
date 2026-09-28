import { Request, Response, Router } from "express";
import { z } from "zod";
import { Role } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok } from "../../utils/respond";
import { AppError } from "../../utils/AppError";
import { requireAuth, requireRole } from "../../middleware/auth";
import { validate } from "../../middleware/validate";

const listQuerySchema = z.object({
  q: z.string().trim().optional(),
  category: z.string().trim().optional(), // category slug
  popular: z.coerce.boolean().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(24),
});

const idParamSchema = z.object({ id: z.string().uuid() });

const serviceSchema = z.object({
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9-]+$/),
  categoryId: z.string().uuid(),
  name: z.string().trim().min(2).max(150),
  description: z.string().trim().min(2).max(2000),
  feeCents: z.number().int().min(0),
  processingTime: z.string().trim().min(1).max(100),
  eligibility: z.array(z.string()).default([]),
  documents: z.array(z.string()).default([]),
  steps: z.array(z.string()).default([]),
  isPopular: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

const router = Router();

router.get(
  "/",
  validate({ query: listQuerySchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const { q, category, popular, page, pageSize } = req.query as unknown as {
      q?: string;
      category?: string;
      popular?: boolean;
      page: number;
      pageSize: number;
    };

    const where = {
      isActive: true,
      ...(popular ? { isPopular: true } : {}),
      ...(category ? { category: { slug: category } } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" as const } },
              { description: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.service.findMany({
        where,
        include: { category: { select: { slug: true, name: true, icon: true } } },
        orderBy: [{ isPopular: "desc" }, { name: "asc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.service.count({ where }),
    ]);

    ok(res, { items, total, page, pageSize });
  })
);

router.get(
  "/:id",
  validate({ params: idParamSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const service = await prisma.service.findUnique({
      where: { id: req.params.id },
      include: { category: { select: { slug: true, name: true, icon: true } } },
    });
    if (!service || !service.isActive) throw AppError.notFound("Service not found");
    ok(res, { service });
  })
);

router.post(
  "/",
  requireAuth,
  requireRole(Role.ADMIN),
  validate({ body: serviceSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const service = await prisma.service.create({ data: req.body });
    ok(res, { service }, 201);
  })
);

router.patch(
  "/:id",
  requireAuth,
  requireRole(Role.ADMIN),
  validate({ params: idParamSchema, body: serviceSchema.partial() }),
  asyncHandler(async (req: Request, res: Response) => {
    const service = await prisma.service.update({ where: { id: req.params.id }, data: req.body });
    ok(res, { service });
  })
);

router.delete(
  "/:id",
  requireAuth,
  requireRole(Role.ADMIN),
  validate({ params: idParamSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    // Soft-delete: services with existing applications must stay for historical/audit integrity.
    const service = await prisma.service.update({ where: { id: req.params.id }, data: { isActive: false } });
    ok(res, { service });
  })
);

export default router;
