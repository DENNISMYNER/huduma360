import { ApplicationStatus, Role } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";
import { generateReference } from "../../utils/reference";
import { recordAudit } from "../../utils/audit";

export const PROGRESS_BY_STATUS: Record<ApplicationStatus, number> = {
  SUBMITTED: 10,
  PAYMENT_PENDING: 30,
  PROCESSING: 65,
  APPROVED: 100,
  REJECTED: 100,
};

const NOTIFICATION_COPY: Record<ApplicationStatus, { title: string; message: (ref: string) => string }> = {
  SUBMITTED: { title: "Application submitted", message: (ref) => `Your application ${ref} has been received.` },
  PAYMENT_PENDING: { title: "Payment required", message: (ref) => `Application ${ref} is awaiting payment.` },
  PROCESSING: { title: "Application in progress", message: (ref) => `Application ${ref} is now being processed.` },
  APPROVED: { title: "Application approved", message: (ref) => `Good news — application ${ref} has been approved.` },
  REJECTED: { title: "Application rejected", message: (ref) => `Application ${ref} was not approved. See notes for details.` },
};

async function uniqueReference(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const ref = generateReference("APP");
    const exists = await prisma.application.findUnique({ where: { referenceNumber: ref } });
    if (!exists) return ref;
  }
  throw AppError.internal("Could not generate a unique application reference — please try again");
}

export async function createApplication(userId: string, serviceId: string, formData: Record<string, unknown>) {
  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service || !service.isActive) throw AppError.notFound("Service not found");

  const referenceNumber = await uniqueReference();
  const initialStatus: ApplicationStatus = service.feeCents > 0 ? "PAYMENT_PENDING" : "SUBMITTED";

  const application = await prisma.application.create({
    data: {
      userId,
      serviceId,
      referenceNumber,
      status: initialStatus,
      progress: PROGRESS_BY_STATUS[initialStatus],
      formData,
      statusHistory: { create: { status: initialStatus, note: "Application created" } },
      notifications: {
        create: {
          userId,
          title: NOTIFICATION_COPY[initialStatus].title,
          message: NOTIFICATION_COPY[initialStatus].message(referenceNumber),
        },
      },
    },
    include: { service: { include: { category: true } } },
  });

  await recordAudit({ userId, action: "APPLICATION_CREATED", entityType: "Application", entityId: application.id });

  return application;
}

export async function getApplicationForUser(applicationId: string, requester: { id: string; role: Role }) {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      service: { include: { category: true } },
      payments: { orderBy: { createdAt: "desc" } },
      statusHistory: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!application) throw AppError.notFound("Application not found");

  const isOwner = application.userId === requester.id;
  const isStaffOrAdmin = requester.role === Role.ADMIN || requester.role === Role.STAFF;
  if (!isOwner && !isStaffOrAdmin) throw AppError.forbidden();

  return application;
}

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus,
  note: string | undefined,
  changedById: string
) {
  const application = await prisma.application.findUnique({ where: { id: applicationId } });
  if (!application) throw AppError.notFound("Application not found");

  const updated = await prisma.application.update({
    where: { id: applicationId },
    data: {
      status,
      progress: PROGRESS_BY_STATUS[status],
      statusHistory: { create: { status, note, changedById } },
      notifications: {
        create: {
          userId: application.userId,
          title: NOTIFICATION_COPY[status].title,
          message: note ? `${NOTIFICATION_COPY[status].message(application.referenceNumber)} ${note}` : NOTIFICATION_COPY[status].message(application.referenceNumber),
        },
      },
    },
    include: { service: true, statusHistory: { orderBy: { createdAt: "asc" } } },
  });

  await recordAudit({
    userId: changedById,
    action: "APPLICATION_STATUS_CHANGED",
    entityType: "Application",
    entityId: applicationId,
    metadata: { status, note },
  });

  return updated;
}
