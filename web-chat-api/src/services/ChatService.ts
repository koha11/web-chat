import { Server } from "socket.io";
import Chat from "../models/Chat.model";

class ChatService {
  getChatList = async () => {
    await Chat.find();
  };

  fetchChatListEvent = async (io: Server) => {
    const data = await this.getChatList();
    io.emit("fetch-chat-list", data);
  };
}

const chatService = new ChatService();

export default chatService;
