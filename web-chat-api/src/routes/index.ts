import { Express } from "express";
import authRouter from "./auth.route.ts";

export const route = (app: Express) => {
  app.use("/auth", authRouter);
};
