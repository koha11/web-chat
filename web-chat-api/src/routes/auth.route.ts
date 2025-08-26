import {
  DEFAULT_CLIENT_URL,
  DEFAULT_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  JWT_SECRET,
  PUSHER_APP_ID,
  PUSHER_CLUSTER,
  PUSHER_KEY,
  PUSHER_SECRET,
} from "../config/env.js";
import { Router } from "express";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import authService from "../services/AuthService.js";
import User from "../models/User.model.js";
import userService from "../services/UserService.js";
import Pusher from "pusher";

const authRouter = Router();

const oauth2Client = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  `${DEFAULT_URL}/auth/google/callback`
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
    `${DEFAULT_CLIENT_URL}/login-success?accessToken=${token}&userId=${user.id}`
  );
});

authRouter.get("/verify-email", async (req, res) => {
  const { token } = req.query;

  await authService.verifyEmail(token as string);

  res.redirect(`${DEFAULT_CLIENT_URL}/me/security`);
});

authRouter.post("/pusher", (req: any, res: any) => {
  const pusher = new Pusher({
    appId: PUSHER_APP_ID, // e.g. "123456"
    key: PUSHER_KEY, // e.g. "abc123..."
    secret: PUSHER_SECRET, // keep on server only
    cluster: PUSHER_CLUSTER, // e.g. "ap2"
    useTLS: true,
  });

  const socketId = req.body.socket_id || req.body.socketId;
  const channelName = req.body.channel_name || req.body.channelName;

  if (!socketId || !channelName) {
    return res.status(400).json({ error: "Missing socket_id or channel_name" });
  }

  // SIMPLE MODE (dev): allow anyone. Replace with your own user/room checks.
  const privateData = channelName.startsWith("private-")
    ? {
        user_id: "guest-" + Math.random().toString(36).slice(2),
        user_info: { name: "Guest" },
      }
    : undefined;

  // Support both SDK method names across versions
  const auth = (pusher as any).authorizeChannel
    ? (pusher as any).authorizeChannel(socketId, channelName, privateData)
    : (pusher as any).authenticate(socketId, channelName, privateData);

  res.setHeader("Cache-Control", "no-store");

  return res.json(auth); // { auth, channel_data? }
});

export default authRouter;
