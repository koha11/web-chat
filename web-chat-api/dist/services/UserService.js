import User from "../models/User.model";
class UserService {
    async setOnlineStatus(userId) {
        await User.findByIdAndUpdate(userId, {
            isOnline: true,
        });
    }
    async setOfflineStatus(userId) {
        await User.findByIdAndUpdate(userId, {
            isOnline: false,
            lastLogined: new Date().toISOString(),
        });
    }
}
const userService = new UserService();
export default userService;
