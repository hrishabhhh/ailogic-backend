import { Router } from "express";

import { register, login, profile } from "../controllers/auth.controller";

import { authenticate } from "../middleware/auth.middleware";
import { loginRateLimiter } from "../middleware/rateLimit.middleware";

const router = Router();

router.post("/register", register);

router.post("/login", loginRateLimiter, login);

router.get("/profile", authenticate, profile);

export default router;
