import authRouter from "./auth.route";
import chatRouter from "./chat.route";
export const route = (app) => {
    app.use("/auth", authRouter);
    app.use("/api/chat", chatRouter);
};
