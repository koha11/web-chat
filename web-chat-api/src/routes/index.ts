import { Express, Router } from "express";
import authRouter from "./auth.route.js";

export const route = (app: Express) => {
  app.use("/auth", authRouter);

  app.get("/health", (req, res) => {
    res.status(200).send();
  });
};
