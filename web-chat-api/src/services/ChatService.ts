import { Server } from "socket.io";
import Chat from "../models/Chat.model";

class ChatService {
  getChatList = async (id: string) => {
    const chatList = await Chat.find({ users: id }).populate("users");

    return chatList;
  };

  fetchChatListEvent = async (io: Server, id: string) => {
    const data = await this.getChatList(id);

    io.emit("fetch-chat-list", data);
  };
}

const chatService = new ChatService();

export default chatService;
