import authService from "../services/AuthService";
export const authJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res
            .status(401)
            .json({ status: 401, message: "No token provided" });
        return;
    }
    const token = authHeader.split(" ")[1];
    const user = authService.verifyToken(token);
    if (!user) {
        res
            .status(404)
            .json({ status: 404, message: "Token is unverified" });
        return;
    }
    req.user = user;
    next();
};
