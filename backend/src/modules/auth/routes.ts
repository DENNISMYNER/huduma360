import { Router } from "express";
import { validate } from "../../middleware/validate";
import { requireAuth } from "../../middleware/auth";
import { authLimiter } from "../../middleware/rateLimit";
import * as controller from "./controller";
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema, verifyEmailSchema } from "./schemas";

const router = Router();

router.post("/register", authLimiter, validate({ body: registerSchema }), controller.register);
router.post("/login", authLimiter, validate({ body: loginSchema }), controller.login);
router.post("/logout", controller.logout);
router.get("/me", requireAuth, controller.me);
router.post("/verify-email", validate({ body: verifyEmailSchema }), controller.requestVerifyEmail);
router.post("/forgot-password", authLimiter, validate({ body: forgotPasswordSchema }), controller.forgotPassword);
router.post("/reset-password", authLimiter, validate({ body: resetPasswordSchema }), controller.resetPassword);

export default router;
