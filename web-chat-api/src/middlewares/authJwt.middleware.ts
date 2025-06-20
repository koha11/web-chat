import { NextFunction, Request, Response } from "express";
import authService from "../services/AuthService";
import { IMyResponse } from "../interfaces/myResponse.interface";

export const authJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res
      .status(401)
      .json({ status: 401, message: "No token provided" } as IMyResponse);
    return;
  }

  const token = authHeader.split(" ")[1];

  const user = authService.verifyToken(token);

  if (!user) {
    res
      .status(404)
      .json({ status: 404, message: "Token is unverified" } as IMyResponse);
    return;
  }

  req.user = user;
  next();
};
