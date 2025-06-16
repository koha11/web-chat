import User from "../models/User.model";

class UserService {
  async setOnlineStatus(userId: string) {
    await User.findByIdAndUpdate(userId, {
      isOnline: true,
    });
  }

  async setOfflineStatus(userId: string) {
    await User.findByIdAndUpdate(userId, {
      isOnline: false,
      lastLogined: new Date().toISOString(),
    });

    User.findById(userId).then((data) => {
      console.log(data);
    });
  }
}

const userService = new UserService();

export default userService;
