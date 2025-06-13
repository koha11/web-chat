import { Express } from "express";
import authRouter from "./auth.route";

export const route = (app: Express) => {
  app.use("/auth", authRouter);
};
