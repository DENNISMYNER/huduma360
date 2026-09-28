import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";
import { hashPassword, comparePassword } from "../../utils/password";
import { generateToken, hashToken } from "../../utils/token";
import { signToken } from "../../utils/jwt";
import { recordAudit } from "../../utils/audit";
import { logger } from "../../utils/logger";
import { LoginInput, RegisterInput } from "./schemas";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour
const VERIFY_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function registerUser(input: RegisterInput, ip?: string) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw AppError.conflict("An account with this email already exists");

  const passwordHash = await hashPassword(input.password);
  const { raw, hash } = generateToken();

  const user = await prisma.user.create({
    data: {
      fullName: input.fullName,
      email: input.email,
      passwordHash,
      phone: input.phone,
      county: input.county,
      nationalId: input.nationalId,
      emailVerifyToken: hash,
      emailVerifyExpiresAt: new Date(Date.now() + VERIFY_TOKEN_TTL_MS),
    },
  });

  // In production this would be emailed. Logged here so the flow is demonstrable without an email provider.
  logger.info("Email verification token generated (would be emailed)", { email: user.email, token: raw });

  await recordAudit({ userId: user.id, action: "USER_REGISTERED", entityType: "User", entityId: user.id, ipAddress: ip });

  const token = signToken({ sub: user.id, role: user.role });
  return { user, token, verificationToken: raw };
}

export async function loginUser(input: LoginInput, ip?: string) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user || !user.isActive) throw AppError.unauthorized("Invalid email or password");

  const valid = await comparePassword(input.password, user.passwordHash);
  if (!valid) throw AppError.unauthorized("Invalid email or password");

  await recordAudit({ userId: user.id, action: "USER_LOGIN", entityType: "User", entityId: user.id, ipAddress: ip });

  const token = signToken({ sub: user.id, role: user.role });
  return { user, token };
}

export async function verifyEmail(rawToken: string) {
  const hash = hashToken(rawToken);
  const user = await prisma.user.findUnique({ where: { emailVerifyToken: hash } });
  if (!user || !user.emailVerifyExpiresAt || user.emailVerifyExpiresAt < new Date()) {
    throw AppError.badRequest("This verification link is invalid or has expired");
  }
  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true, emailVerifyToken: null, emailVerifyExpiresAt: null },
  });
  return { verified: true };
}

export async function requestPasswordReset(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  // Always behave the same whether or not the account exists, so we don't leak which emails are registered.
  if (!user) return { requested: true };

  const { raw, hash } = generateToken();
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordResetToken: hash, passwordResetExpiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS) },
  });

  logger.info("Password reset token generated (would be emailed)", { email: user.email, token: raw });
  return { requested: true };
}

export async function resetPassword(rawToken: string, newPassword: string) {
  const hash = hashToken(rawToken);
  const user = await prisma.user.findUnique({ where: { passwordResetToken: hash } });
  if (!user || !user.passwordResetExpiresAt || user.passwordResetExpiresAt < new Date()) {
    throw AppError.badRequest("This reset link is invalid or has expired");
  }
  const passwordHash = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, passwordResetToken: null, passwordResetExpiresAt: null },
  });
  await recordAudit({ userId: user.id, action: "PASSWORD_RESET", entityType: "User", entityId: user.id });
  return { reset: true };
}
