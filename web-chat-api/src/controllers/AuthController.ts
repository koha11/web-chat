import { Request, Response } from "express";
import { ILoginRequest } from "../interfaces/auth/loginRequest.interface";
import { IRegisterRequest } from "../interfaces/auth/registerRequest.interface";
import authService from "../services/AuthService";

class AuthController {
  login(req: Request, res: Response) {
    const loginRequest = req.body as ILoginRequest;
    authService.login(loginRequest).then((response) => {
      res
        .status(response.status)
        .json({ data: response.data, message: response.message });
    });
  }

  register(req: Request, res: Response) {
    const registerRequest = req.body as IRegisterRequest;

    authService.register(registerRequest).then((response) => {
      res
        .status(response.status)
        .json({ data: response.data, message: response.message });
    });
  }
}

const authController = new AuthController();

export default authController;
