import { Express } from "express";
import authRouter from "./auth.route";
import chatRouter from "./chat.route";


export const route = (app: Express) => {
  app.use("/auth", authRouter);
  app.use("/api/chat", chatRouter)
};
