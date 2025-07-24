import { DEFAULT_CLIENT_URL, DEFAULT_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, } from "../config/env.js";
import { Router } from "express";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import authService from "../services/AuthService.js";
import User from "../models/User.model.js";
import userService from "../services/UserService.js";
const authRouter = Router();
const oauth2Client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, `${DEFAULT_URL}/auth/google/callback`);
// Redirect to Google
authRouter.get("/google", (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        scope: ["profile", "email"],
    });
    res.redirect(url);
});
// Callback from Google
authRouter.get("/google/callback", async (req, res) => {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({
        auth: oauth2Client,
        version: "v2",
    });
    const userInfo = await oauth2.userinfo.get();
    const userInfoData = userInfo.data;
    let user = await User.findOne({ ggid: userInfoData.id });
    if (!user) {
        user = await userService.createNewUser({
            fullname: userInfoData.name ?? "",
            username: userInfoData.email ?? "",
            avatar: userInfoData.picture ?? undefined,
            ggid: userInfoData.id ?? undefined,
        });
    }
    const token = authService.createToken({
        expiresIn: "7d",
        id: user.id,
        username: user.username,
    });
    // Send token to frontend
    res.redirect(`${DEFAULT_CLIENT_URL}/login-success?accessToken=${token}&userId=${user.id}`);
});
authRouter.get("/verify-email", async (req, res) => {
    const { token } = req.query;
    await authService.verifyEmail(token);
    res.redirect(`${DEFAULT_CLIENT_URL}/me/security`);
});
export default authRouter;
