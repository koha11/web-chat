import User from "../models/User.model";

class UserService {
  setOnlineStatus(userId: string) {
    User.findByIdAndUpdate(userId, {
      isOnline: true,
    });
  }

  setOfflineStatus(userId: string) {
    User.findByIdAndUpdate(userId, {
      isOnline: false,
      lastLogined: new Date().toISOString(),
    });
  }
}

const userService = new UserService();

export default userService;
