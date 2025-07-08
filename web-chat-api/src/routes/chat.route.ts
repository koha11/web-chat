import chatController from "@/controllers/ChatController.ts";
import { authJWT } from "@/middlewares/authJwt.middleware.ts";
import { Router } from "express";

const chatRouter = Router();

chatRouter.get("/", authJWT, chatController.getRecentChat);

export default chatRouter;
