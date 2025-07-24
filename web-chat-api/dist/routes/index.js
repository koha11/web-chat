import authRouter from "./auth.route.js";
export const route = (app) => {
    app.use("/auth", authRouter);
    app.get("/health", (req, res) => {
        res.status(200).send();
    });
};
