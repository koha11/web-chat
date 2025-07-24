import { DEFAULT_URL, JWT_SECRET } from "../config/env.js";
import Account from "../models/Account.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userService from "./UserService.js";
import User from "../models/User.model.js";
import { createTransport } from "nodemailer";
class AuthService {
    constructor() {
        this.sendVerifyMail = async (email) => {
            const token = this.createToken({ email });
            const transporter = createTransport({
                service: "Gmail", // or use host, port for custom SMTP
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });
            await transporter.sendMail({
                from: '"My App" <nevertotryhope11@gmail.com@gmail.com>',
                to: email,
                subject: "Verify your email",
                html: `<p>Click <a href="${DEFAULT_URL}/auth/verify-email?token=${token}">here</a> to verify your email.</p>`,
            });
            return true;
        };
        this.verifyEmail = async (token) => {
            const { email } = this.verifyToken(token);
            const account = await Account.findOne({ email });
            if (!account)
                throw new Error("email is not existed");
            account.isConfirmedEmail = true;
            await account.save();
        };
        this.changeEmail = async ({ email, userId, }) => {
            const account = await Account.findById(userId);
            if (!account)
                throw new Error("Account is not existed");
            const isEmailExists = await Account.findOne({ email });
            if (isEmailExists)
                throw new Error("Email is existed");
            account.email = email;
            await account.save();
            await this.sendVerifyMail(email);
            return true;
        };
    }
    async login({ username, password }) {
        const account = await Account.findOne({ username });
        if (!account)
            throw new Error("Username is not existed");
        // kiem tra email da xac thuc chua
        // if (!account.isConfirmedEmail) throw new Error("Email is no vertified");
        const passwordisValid = bcrypt.compareSync(password, account.password);
        if (!passwordisValid)
            throw new Error("Password is not correct");
        const user = await User.findOne({ username });
        if (!user)
            throw new Error("User is not existed");
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
    async register({ email, fullname, password, username, }) {
        const isUsernameExists = await Account.findOne({
            username,
        });
        if (isUsernameExists)
            throw new Error("Username is already exists");
        const isEmailExists = await Account.findOne({
            email,
        });
        if (isEmailExists)
            throw new Error("Email is already exists");
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
