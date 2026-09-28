import { Request, Response, Router } from "express";
import { z } from "zod";
import { Role } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok } from "../../utils/respond";
import { AppError } from "../../utils/AppError";
import { requireAuth, requireRole } from "../../middleware/auth";
import { validate } from "../../middleware/validate";

const categorySchema = z.object({
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and hyphens"),
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().min(2).max(500),
  icon: z.string().trim().min(1).max(10),
  sortOrder: z.number().int().default(0).optional(),
});

const slugParamSchema = z.object({ slug: z.string() });
const idParamSchema = z.object({ id: z.string().uuid() });

const router = Router();

router.get(
  "/",
  asyncHandler(async (_req: Request, res: Response) => {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { services: true } } },
    });
    ok(res, { items: categories });
  })
);

router.get(
  "/:slug",
  validate({ params: slugParamSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const category = await prisma.category.findUnique({
      where: { slug: req.params.slug },
      include: { services: { where: { isActive: true } } },
    });
    if (!category) throw AppError.notFound("Category not found");
    ok(res, { category });
  })
);

router.post(
  "/",
  requireAuth,
  requireRole(Role.ADMIN),
  validate({ body: categorySchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const category = await prisma.category.create({ data: req.body });
    ok(res, { category }, 201);
  })
);

router.patch(
  "/:id",
  requireAuth,
  requireRole(Role.ADMIN),
  validate({ params: idParamSchema, body: categorySchema.partial() }),
  asyncHandler(async (req: Request, res: Response) => {
    const category = await prisma.category.update({ where: { id: req.params.id }, data: req.body });
    ok(res, { category });
  })
);

router.delete(
  "/:id",
  requireAuth,
  requireRole(Role.ADMIN),
  validate({ params: idParamSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const serviceCount = await prisma.service.count({ where: { categoryId: req.params.id } });
    if (serviceCount > 0) throw AppError.conflict("Cannot delete a category that still has services");
    await prisma.category.delete({ where: { id: req.params.id } });
    ok(res, { deleted: true });
  })
);

export default router;
