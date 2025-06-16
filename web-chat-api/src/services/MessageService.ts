import { Server, Socket } from "socket.io";
import { ITokenPayload } from "../interfaces/auth/tokenPayload.interface";
import Message, { IMessage } from "../models/Message.model";
import Chat from "../models/Chat.model";
import chatService from "./ChatService";

class MessageService {
  listenSendMessage(socket: Socket, io: Server) {
    const user = socket.data.user as ITokenPayload;
    socket.on("send-message", async (msg: IMessage, chatId: string) => {
      console.log(user.username + " have sent " + msg.msgBody);

      const myMsg = await Message.create(msg);

      Chat.findByIdAndUpdate(chatId, { $push: { messages: myMsg } });

      io.emit("receive-message", myMsg);

      // chatService.fetchChatListEvent(io, socket.data.user.id);
    });
  }

  listenFetchMessagesRequest(socket: Socket, io: Server) {
    socket.on("fetch-messages-request", (chatId: string) => {
      this.fetchMessagesEvent(io, chatId);
    });
  }

  fetchMessagesEvent = async (io: Server, chatId: string) => {
    const data = await this.getMessages(chatId);

    io.emit("fetch-messages", data);
  };

  getMessages = async (chatId: string) => {
    const chat = await Chat.findById(chatId).populate("messages");
    const myMsgList = (chat?.messages as IMessage[]) ?? [];

    myMsgList.sort(
      (a: IMessage, b: IMessage) =>
        new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );

    return myMsgList;
  };
}

const messageService = new MessageService();

export default messageService;
