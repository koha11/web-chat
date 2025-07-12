import authRouter from "./auth.route.js";
export const route = (app) => {
    app.use("/auth", authRouter);
};
