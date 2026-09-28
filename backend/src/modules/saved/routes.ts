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
    const items = await prisma.savedService.findMany({
      where: { userId: req.user!.id },
      include: { service: { include: { category: { select: { slug: true, name: true, icon: true } } } } },
      orderBy: { createdAt: "desc" },
    });
    ok(res, { items });
  })
);

router.post(
  "/:serviceId",
  requireAuth,
  validate({ params: serviceIdParamSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const saved = await prisma.savedService.upsert({
      where: { userId_serviceId: { userId: req.user!.id, serviceId: req.params.serviceId } },
      create: { userId: req.user!.id, serviceId: req.params.serviceId },
      update: {},
    });
    ok(res, { saved }, 201);
  })
);

router.delete(
  "/:serviceId",
  requireAuth,
  validate({ params: serviceIdParamSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    await prisma.savedService.deleteMany({ where: { userId: req.user!.id, serviceId: req.params.serviceId } });
    ok(res, { removed: true });
  })
);

export default router;
