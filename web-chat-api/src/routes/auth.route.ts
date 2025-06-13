import { Router } from "express";
import authController from "src/controllers/AuthController";

const router = Router()

router.post("/login", authController.login)

export default router;