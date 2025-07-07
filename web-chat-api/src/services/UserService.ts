import UserType from "@/enums/UserType.enum.ts";
import Chat from "@/models/Chat.model.ts";
import User from "@/models/User.model.ts";
import { Types } from "mongoose";

class UserService {
  createNewUser = async ({
    fullname,
    _id,
    username,
  }: {
    _id: Types.ObjectId;
    username: string;
    fullname: string;
  }) => {
    // Tao User moi
    const user = await User.create({
      _id,
      username,
      fullname,
      lastLogined: new Date().toISOString(),
    });

    // Tao chat voi gemini api
    const chatbot = await User.findOne({ userType: UserType.CHATBOT });

    const chat = await Chat.create({
      users: [user.id, chatbot?.id],
      nicknames: {
        [user.id]: user.fullname,
        [chatbot?.id]: chatbot?.fullname,
      },
    });
  };
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
  }
}

const userService = new UserService();

export default userService;
