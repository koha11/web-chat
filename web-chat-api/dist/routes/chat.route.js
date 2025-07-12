import { Router } from "express";
import chatController from "../controllers/ChatController";
import { authJWT } from "../middlewares/authJwt.middleware";
const router = Router();
router.get("/", authJWT, chatController.getRecentChat);
export default router;
