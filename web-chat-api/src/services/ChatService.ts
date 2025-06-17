import { DefaultEventsMap, Server, Socket } from "socket.io";
import Chat from "../models/Chat.model";

class ChatService {
  listenFetchChatListRequest(
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  ) {
    socket.on("request-fetch-chat-list", () => {
      this.fetchChatListEvent(io, socket.data.user.id);
    });
  }

  fetchChatListEvent = async (io: Server, id: string) => {
    const data = await this.getChatList(id);

    io.emit("fetch-chat-list", data);
    
    return data
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
