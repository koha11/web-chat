import { DefaultEventsMap, Server, Socket } from "socket.io";
import Chat from "../models/Chat.model";
import SocketEvent from "../enums/SocketEvent";

class ChatService {
  // Lay ra toan bo chat cua 1 user
  fetchChatListEvent = async (
    io: Server,
    userMap: { [userId: string]: string },
    userId: string
  ) => {
    const data = await this.getChatList(userId);

    if (userMap[userId] != "")
      io.to(userMap[userId]).emit(SocketEvent.fcl, data);

    return data;
  };

  getChatList = async (id: string) => {
    const chatList = await Chat.find({ users: id })
      .populate("users")
      .sort({ updatedAt: -1 });

    return chatList;
  };
}

const chatService = new ChatService();

export default chatService;
