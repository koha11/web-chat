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

  getChatList = async (id: string) => {
    const chatList = await Chat.find({ users: id })
      .populate("users")
      .populate("messages");

    return chatList;
  };

  fetchChatListEvent = async (io: Server, id: string) => {
    const data = await this.getChatList(id);

    io.emit("fetch-chat-list", data);
  };
}

const chatService = new ChatService();

export default chatService;
