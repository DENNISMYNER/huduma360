import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "./env";

// Prevent multiple PrismaClient instances in dev (ts-node-dev hot reload)
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

// engineType = "client" (see schema.prisma) removes the Rust query engine entirely — Prisma
// talks to Postgres through this plain node-postgres driver adapter instead.
const adapter = new PrismaPg({ connectionString: env.databaseUrl });

export const prisma =
  global.__prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.__prisma = prisma;
}
