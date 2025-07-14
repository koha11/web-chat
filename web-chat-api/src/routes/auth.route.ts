import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  JWT_SECRET,
} from "../config/env.js";
import { Router } from "express";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import authService from "../services/AuthService.js";
import User from "../models/User.model.js";
import userService from "../services/UserService.js";

const authRouter = Router();

const oauth2Client = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  "http://localhost:3000/auth/google/callback"
);

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
  const { tokens } = await oauth2Client.getToken(code as string);
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
  res.redirect(
    `http://localhost:5173/login-success?accessToken=${token}&userId=${user.id}`
  );
});

export default authRouter;
