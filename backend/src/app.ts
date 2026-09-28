import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import { env } from "./config/env";
import { apiLimiter } from "./middleware/rateLimit";
import { issueCsrfToken, verifyCsrfToken } from "./middleware/csrf";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

import authRoutes from "./modules/auth/routes";
import userRoutes from "./modules/users/routes";
import categoryRoutes from "./modules/categories/routes";
import serviceRoutes from "./modules/services/routes";
import applicationRoutes from "./modules/applications/routes";
import paymentRoutes from "./modules/payments/routes";
import notificationRoutes from "./modules/notifications/routes";
import savedRoutes from "./modules/saved/routes";
import recentRoutes from "./modules/recent/routes";
import adminRoutes from "./modules/admin/routes";

export function createApp(): Application {
  const app = express();

  app.set("trust proxy", 1);

  app.use(
    helmet({
      // Allow the API to be called from the separately-hosted static frontend.
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );
  app.use(
    cors({
      origin: env.clientOrigin,
      credentials: true,
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());
  app.use(issueCsrfToken);
  app.use(verifyCsrfToken);
  if (!env.isTest) app.use(morgan(env.isProduction ? "combined" : "dev"));
  app.use("/api", apiLimiter);

  app.get("/api/health", (_req, res) => res.json({ success: true, data: { status: "ok", time: new Date().toISOString() } }));

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/services", serviceRoutes);
  app.use("/api/applications", applicationRoutes);
  app.use("/api/payments", paymentRoutes);
  app.use("/api/notifications", notificationRoutes);
  app.use("/api/saved", savedRoutes);
  app.use("/api/recent", recentRoutes);
  app.use("/api/admin", adminRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
