import { prisma } from "../config/prisma";

interface AuditParams {
  userId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
  ipAddress?: string | null;
}

/** Writes an audit log entry. Never throws — auditing must not break the main request flow. */
export async function recordAudit(params: AuditParams): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId ?? null,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId ?? null,
        metadata: params.metadata ?? undefined,
        ipAddress: params.ipAddress ?? null,
      },
    });
  } catch {
    // swallow — audit logging is best-effort
  }
}
