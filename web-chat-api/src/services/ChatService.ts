import { DefaultEventsMap, Server, Socket } from "socket.io";
import Chat from "../models/Chat.model";
import SocketEvent from "../enums/SocketEvent";

class ChatService {
  fetchChatListEvent = async (io: Server, socketId: string, chatId: string) => {
    const data = await this.getChatList(chatId);

    io.to(socketId).emit(SocketEvent.fcl, data);

    return data;
  };

  getChatList = async (id: string) => {
    const chatList = await Chat.find({ users: id })
      .populate("users")
      .sort({ updatedAt: -1 });

    console.log(chatList);

    return chatList;
  };
}

const chatService = new ChatService();

export default chatService;
