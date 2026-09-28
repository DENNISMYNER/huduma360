import { Request, Response, Router } from "express";
import { Role } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok } from "../../utils/respond";
import { requireAuth, requireRole } from "../../middleware/auth";

const router = Router();

router.get(
  "/stats",
  requireAuth,
  requireRole(Role.ADMIN, Role.STAFF),
  asyncHandler(async (_req: Request, res: Response) => {
    const [
      totalUsers,
      totalServices,
      totalApplications,
      applicationsByStatus,
      totalPaymentsSuccess,
      revenueAgg,
      recentApplications,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.service.count({ where: { isActive: true } }),
      prisma.application.count(),
      prisma.application.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.payment.count({ where: { status: "SUCCESS" } }),
      prisma.payment.aggregate({ where: { status: "SUCCESS" }, _sum: { amountCents: true } }),
      prisma.application.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        include: { service: { select: { name: true } }, user: { select: { fullName: true } } },
      }),
    ]);

    ok(res, {
      totalUsers,
      totalServices,
      totalApplications,
      applicationsByStatus: applicationsByStatus.map((row: { status: string; _count: { _all: number } }) => ({
        status: row.status,
        count: row._count._all,
      })),
      totalPaymentsSuccess,
      totalRevenueCents: revenueAgg._sum.amountCents ?? 0,
      recentApplications,
    });
  })
);

export default router;
