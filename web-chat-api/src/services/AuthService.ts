import { JWT_SECRET } from "../config/env.js";
import { IRegisterRequest } from "../interfaces/auth/registerRequest.interface.js";
import { ITokenPayload } from "../interfaces/auth/tokenPayload.interface.js";
import { IMyResponse } from "../interfaces/myResponse.interface.js";
import Account from "../models/Account.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userService from "./UserService.js";
import { ILoginRequest } from "interfaces/auth/loginRequest.interface.js";
import User from "models/User.model.js";
import { IAccount } from "interfaces/account.interface.js";

class AuthService {
  async login({ username, password }: ILoginRequest): Promise<{
    accessToken: string;
    userId: string;
  }> {
    const account = await Account.findOne({ username });

    if (!account) throw new Error("Username is not existed");

    // kiem tra email da xac thuc chua
    // if (!account.isConfirmedEmail) throw new Error("Email is no vertified");

    const passwordisValid = bcrypt.compareSync(password, account.password);

    if (!passwordisValid) throw new Error("Password is not correct");

    const user = await User.findOne({ username });

    if (!user) throw new Error("User is not existed");

    const token = this.createToken({
      expiresIn: "24h",
      id: user.id,
      username: user.username,
    });

    return {
      accessToken: token,
      userId: user.id,
    };
  }

  async register({
    email,
    fullname,
    password,
    username,
  }: IRegisterRequest): Promise<IMyResponse> {
    const isUsernameExists = await Account.findOne({
      username,
    });

    if (isUsernameExists) throw new Error("Username is already exists");

    const isEmailExists = await Account.findOne({
      email,
    });

    if (isEmailExists) throw new Error("Email is already exists");

    const account = await Account.create({
      username,
      password: bcrypt.hashSync(password),
      email,
    } as IAccount);

    await userService.createNewUser({ username, fullname, _id: account.id });

    const token = this.createToken({
      expiresIn: "24h",
      id: account.id,
      username,
    });

    return {
      isValid: true,
      data: {
        accessToken: token,
        userId: account.id,
      },
      message: "register success",
    };
  }

  verifyToken(token: string): ITokenPayload {
    return jwt.verify(token, JWT_SECRET) as ITokenPayload;
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
