import authService from "../services/AuthService";
class AuthController {
    login(req, res) {
        const loginRequest = req.body;
        authService.login(loginRequest).then((response) => {
            res.status(response.status).json(response);
        });
    }
    register(req, res) {
        const registerRequest = req.body;
        authService.register(registerRequest).then((response) => {
            res.status(response.status).json(response);
        });
    }
}
const authController = new AuthController();
export default authController;
