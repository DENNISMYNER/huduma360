import { Request, Response, Router } from "express";
import { prisma } from "../../config/prisma";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok } from "../../utils/respond";
import { AppError } from "../../utils/AppError";
import { requireAuth, requireRole } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { toPublicUser } from "../auth/controller";
import { recordAudit } from "../../utils/audit";
import { Role } from "@prisma/client";
import { adminListUsersQuerySchema, adminUpdateRoleSchema, adminUserIdParamSchema, updateProfileSchema } from "./schemas";

const router = Router();

router.get(
  "/profile",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: req.user!.id } });
    ok(res, { user: toPublicUser(user) });
  })
);

router.patch(
  "/profile",
  requireAuth,
  validate({ body: updateProfileSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const user = await prisma.user.update({ where: { id: req.user!.id }, data: req.body });
    ok(res, { user: toPublicUser(user) });
  })
);

// ---- Admin: user management ----

router.get(
  "/admin",
  requireAuth,
  requireRole(Role.ADMIN, Role.STAFF),
  validate({ query: adminListUsersQuerySchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const { page, pageSize, q, role } = req.query as unknown as {
      page: number;
      pageSize: number;
      q?: string;
      role?: Role;
    };

    const where = {
      ...(role ? { role } : {}),
      ...(q
        ? {
            OR: [
              { fullName: { contains: q, mode: "insensitive" as const } },
              { email: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.user.count({ where }),
    ]);

    ok(res, { items: items.map(toPublicUser), total, page, pageSize });
  })
);

router.patch(
  "/admin/:id/role",
  requireAuth,
  requireRole(Role.ADMIN),
  validate({ params: adminUserIdParamSchema, body: adminUpdateRoleSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { role } = req.body as { role: Role };

    if (id === req.user!.id) throw AppError.badRequest("You cannot change your own role");

    const user = await prisma.user.update({ where: { id }, data: { role } });
    await recordAudit({
      userId: req.user!.id,
      action: "USER_ROLE_CHANGED",
      entityType: "User",
      entityId: id,
      metadata: { newRole: role },
      ipAddress: req.ip,
    });
    ok(res, { user: toPublicUser(user) });
  })
);

router.patch(
  "/admin/:id/deactivate",
  requireAuth,
  requireRole(Role.ADMIN),
  validate({ params: adminUserIdParamSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (id === req.user!.id) throw AppError.badRequest("You cannot deactivate your own account");
    const user = await prisma.user.update({ where: { id }, data: { isActive: false } });
    await recordAudit({ userId: req.user!.id, action: "USER_DEACTIVATED", entityType: "User", entityId: id, ipAddress: req.ip });
    ok(res, { user: toPublicUser(user) });
  })
);

export default router;
