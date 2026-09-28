import { PaymentMethod, PaymentStatus } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";
import { generateReference } from "../../utils/reference";
import { getPaymentProvider } from "../../integrations/payments";
import { env } from "../../config/env";
import { recordAudit } from "../../utils/audit";
import { PROGRESS_BY_STATUS } from "../applications/service";

async function uniqueTransactionRef(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const ref = generateReference("PAY");
    const exists = await prisma.payment.findUnique({ where: { transactionRef: ref } });
    if (!exists) return ref;
  }
  throw AppError.internal("Could not generate a unique payment reference — please try again");
}

export async function initiatePayment(
  userId: string,
  applicationId: string,
  method: PaymentMethod,
  phone: string | undefined
) {
  const application = await prisma.application.findUnique({ where: { id: applicationId }, include: { service: true } });
  if (!application) throw AppError.notFound("Application not found");
  if (application.userId !== userId) throw AppError.forbidden();
  if (application.status !== "PAYMENT_PENDING") {
    throw AppError.badRequest("This application is not awaiting payment");
  }

  const existingSuccess = await prisma.payment.findFirst({ where: { applicationId, status: "SUCCESS" } });
  if (existingSuccess) throw AppError.conflict("This application has already been paid for");

  const transactionRef = await uniqueTransactionRef();

  const payment = await prisma.payment.create({
    data: {
      applicationId,
      userId,
      amountCents: application.service.feeCents,
      method,
      status: "PENDING",
      provider: env.paymentProvider,
      transactionRef,
    },
  });

  const provider = getPaymentProvider();
  const result = await provider.initiate({
    amountCents: application.service.feeCents,
    phone,
    reference: transactionRef,
    description: `Payment for ${application.service.name} (${application.referenceNumber})`,
  });

  const updatedPayment = await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: result.status,
      providerRef: result.providerRef,
      failureReason: result.failureReason,
    },
  });

  if (result.status === "SUCCESS") {
    await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: "PROCESSING",
        progress: PROGRESS_BY_STATUS.PROCESSING,
        statusHistory: { create: { status: "PROCESSING", note: `Payment ${transactionRef} confirmed` } },
        notifications: {
          create: {
            userId,
            title: "Payment received",
            message: `We've received your payment for ${application.referenceNumber}. Your application is now processing.`,
          },
        },
      },
    });
  }

  await recordAudit({
    userId,
    action: "PAYMENT_INITIATED",
    entityType: "Payment",
    entityId: payment.id,
    metadata: { status: result.status, method },
  });

  return updatedPayment;
}

export async function handleWebhook(transactionRef: string, status: PaymentStatus, providerRef?: string, failureReason?: string) {
  const payment = await prisma.payment.findUnique({ where: { transactionRef } });
  if (!payment) throw AppError.notFound("Unknown transaction reference");
  if (payment.status !== "PENDING") return payment; // already settled — ignore duplicate callbacks

  const updated = await prisma.payment.update({
    where: { id: payment.id },
    data: { status, providerRef, failureReason },
  });

  if (status === "SUCCESS") {
    await prisma.application.update({
      where: { id: payment.applicationId },
      data: {
        status: "PROCESSING",
        progress: PROGRESS_BY_STATUS.PROCESSING,
        statusHistory: { create: { status: "PROCESSING", note: `Payment ${transactionRef} confirmed via webhook` } },
        notifications: {
          create: {
            userId: payment.userId,
            title: "Payment received",
            message: `Your payment ${transactionRef} was confirmed. Your application is now processing.`,
          },
        },
      },
    });
  }

  return updated;
}
