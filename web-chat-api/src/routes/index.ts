import { Express } from "express";
import authRouter from "./auth.route.js";

export const route = (app: Express) => {
  app.use("/auth", authRouter);
};
