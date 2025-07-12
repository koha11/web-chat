import { JWT_SECRET } from "../config/env";
import jwt from "jsonwebtoken";
import User from "../models/User.model";
import bcrypt from "bcryptjs";
import Account from "../models/Account.model";
class AuthService {
    async login(loginRequest) {
        const account = await Account.findOne({ username: loginRequest.username });
        if (!account)
            return {
                status: 401,
                message: "Username is wrong",
            };
        var passwordIsValid = bcrypt.compareSync(loginRequest.password, account.password);
        if (!passwordIsValid)
            return {
                status: 401,
                message: "Password is wrong",
            };
        const user = await User.findOne({ username: loginRequest.username });
        if (!user)
            return {
                status: 400,
                message: "sai id roi",
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
                userId: user.id,
            },
            message: "login success",
        };
    }
    async register(registerRequest) {
        const isUsernameExists = await Account.findOne({
            username: registerRequest.username,
        });
        if (isUsernameExists)
            return {
                status: 409,
                message: "Username is already exists",
            };
        const isEmailExists = await Account.findOne({
            email: registerRequest.email,
        });
        if (isEmailExists)
            return {
                status: 409,
                message: "Email is already exists",
            };
        const account = await Account.create({
            username: registerRequest.username,
            password: bcrypt.hashSync(registerRequest.password),
            email: registerRequest.email,
        });
        const user = await User.create({
            id: account._id,
            username: account.username,
            fullname: registerRequest.fullname,
        });
        return {
            status: 200,
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
