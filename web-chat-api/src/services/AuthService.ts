import { JWT_SECRET } from "../config/env";
import { ILoginRequest } from "../interfaces/auth/loginRequest.interface";
import { ITokenPayload } from "../interfaces/auth/tokenPayload.interface";
import { IMyResponse } from "../interfaces/myResponse.interface";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User.model";
import bcrypt from "bcryptjs";
import { IRegisterRequest } from "../interfaces/auth/registerRequest.interface";

class AuthService {
  async login(loginRequest: ILoginRequest): Promise<IMyResponse> {
    const user = await User.findOne({ username: loginRequest.username });

    if (!user)
      return {
        status: 401,
        message: "Username is wrong",
      };

    var passwordIsValid = bcrypt.compareSync(
      loginRequest.password,
      user.password
    );

    if (!passwordIsValid)
      return {
        status: 401,
        message: "Password is wrong",
      };

    const token = this.createToken({
      expiresIn: "24h",
      id: user.id,
      username: user.username,
    });

    return {
      status: 200,
      data: {
        accessToken: token,
      },
      message: "login success",
    };
  }

  async register(registerRequest: IRegisterRequest): Promise<IMyResponse> {
    const user = await User.findOne({ username: registerRequest.username });

    if (user)
      return {
        status: 409,
        message: "Username is already exists",
      };

    const hashedPwd = bcrypt.hashSync(registerRequest.password);

    registerRequest.password = hashedPwd;

    const newUser = await User.create(registerRequest);

    const token = this.createToken({
      expiresIn: "24h",
      id: newUser.id,
      username: newUser.username,
    });

    return {
      status: 200,
      data: {
        accessToken: token,
      },
      message: "register success",
    };
  }

  verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
  }

  createToken(payload: ITokenPayload) {
    const token = jwt.sign(payload, JWT_SECRET, {
      algorithm: "HS256",
      allowInsecureKeySizes: true,
      expiresIn: 864000,
    });

    return token;
  }
}

const authService = new AuthService();

export default authService;
