import { Request, Response, Router } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok } from "../../utils/respond";
import { AppError } from "../../utils/AppError";
import { requireAuth } from "../../middleware/auth";
import { validate } from "../../middleware/validate";

const idParamSchema = z.object({ id: z.string().uuid() });

const router = Router();

router.get(
  "/",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const [items, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId: req.user!.id },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      prisma.notification.count({ where: { userId: req.user!.id, isRead: false } }),
    ]);
    ok(res, { items, unreadCount });
  })
);

router.patch(
  "/:id/read",
  requireAuth,
  validate({ params: idParamSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const notification = await prisma.notification.findUnique({ where: { id: req.params.id } });
    if (!notification || notification.userId !== req.user!.id) throw AppError.notFound("Notification not found");
    const updated = await prisma.notification.update({ where: { id: req.params.id }, data: { isRead: true } });
    ok(res, { notification: updated });
  })
);

router.patch(
  "/read-all",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    await prisma.notification.updateMany({ where: { userId: req.user!.id, isRead: false }, data: { isRead: true } });
    ok(res, { updated: true });
  })
);

export default router;
