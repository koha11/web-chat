import { JWT_SECRET } from "@/config/env.js";
import Account from "@/models/Account.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userService from "./UserService.js";
class AuthService {
    // async login(loginRequest: ILoginRequest): Promise<IMyResponse> {
    //   const account = await Account.findOne({ username: loginRequest.username });
    //   if (!account)
    //     return {
    //       status: 401,
    //       message: "Username is wrong",
    //     };
    //   var passwordisValid = bcrypt.compareSync(
    //     loginRequest.password,
    //     account.password
    //   );
    //   if (!passwordisValid)
    //     return {
    //       status: 401,
    //       message: "Password is wrong",
    //     };
    //   const user = await User.findOne({ username: loginRequest.username });
    //   if (!user)
    //     return {
    //       status: 400,
    //       message: "sai id roi",
    //     };
    //   const token = this.createToken({
    //     expiresIn: "24h",
    //     id: user.id,
    //     username: user.username,
    //   });
    //   return {
    //     status: 200,
    //     data: {
    //       accessToken: token,
    //       userId: user.id,
    //     },
    //     message: "login success",
    //   };
    // }
    async register({ email, fullname, password, username, }) {
        const isUsernameExists = await Account.findOne({
            username,
        });
        if (isUsernameExists)
            return {
                isValid: false,
                message: "Username is already exists",
            };
        const isEmailExists = await Account.findOne({
            email,
        });
        if (isEmailExists)
            return {
                isValid: false,
                message: "Email is already exists",
            };
        const account = await Account.create({
            username,
            password: bcrypt.hashSync(password),
            email,
        });
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
    verifyToken(token) {
        return jwt.verify(token, JWT_SECRET);
    }
    createToken(payload) {
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
