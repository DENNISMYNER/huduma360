import { Request, Response, Router } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok } from "../../utils/respond";
import { requireAuth } from "../../middleware/auth";
import { validate } from "../../middleware/validate";

const serviceIdParamSchema = z.object({ serviceId: z.string().uuid() });

const router = Router();

router.get(
  "/",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const items = await prisma.recentlyViewed.findMany({
      where: { userId: req.user!.id },
      include: { service: { include: { category: { select: { slug: true, name: true, icon: true } } } } },
      orderBy: { viewedAt: "desc" },
      take: 12,
    });
    ok(res, { items });
  })
);

router.post(
  "/:serviceId",
  requireAuth,
  validate({ params: serviceIdParamSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const viewed = await prisma.recentlyViewed.upsert({
      where: { userId_serviceId: { userId: req.user!.id, serviceId: req.params.serviceId } },
      create: { userId: req.user!.id, serviceId: req.params.serviceId },
      update: { viewedAt: new Date() },
    });
    ok(res, { viewed }, 201);
  })
);

export default router;
