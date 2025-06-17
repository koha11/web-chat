import { Server, Socket } from "socket.io";
import { ITokenPayload } from "../interfaces/auth/tokenPayload.interface";
import Message, { IMessage } from "../models/Message.model";
import Chat, { IChat } from "../models/Chat.model";
import chatService from "./ChatService";
import SocketEvent from "../enums/SocketEvent";

class MessageService {
  listenSendMessage(socket: Socket, io: Server) {
    const user = socket.data.user as ITokenPayload;
    socket.on("send-message", async (msg: IMessage, chatId: string) => {
      console.log(user.username + " have sent " + msg.msgBody);

      const myMsg = await Message.create(msg);

      Chat.findByIdAndUpdate(chatId, { $push: { messages: myMsg } });

      io.emit("receive-message", myMsg, chatId);

      // chatService.fetchChatListEvent(io, socket.data.user.id);
    });
  }

  listenFetchMessagesRequest(socket: Socket, io: Server) {
    socket.on(SocketEvent.fmr, (chatId: string) => {
      console.log(socket.data.user.username + " call " + SocketEvent.fmr);
      this.fetchMessagesEvent(io, chatId);
    });
  }

  fetchLastMessageEvent = async (io: Server, chatList: IChat[]) => {
    const data = {} as { [chatId: string]: IMessage[] };

    for (let chat of chatList) {
      const messages = await this.getMessages(chat.id);

      data[chat.id] = [];
      if (messages != undefined && messages.length > 0)
        data[chat.id].push(messages[0]);
    }

    io.emit(SocketEvent.flm, data);
  };

  fetchMessagesEvent = async (io: Server, chatId: string) => {
    const data = await this.getMessages(chatId);
    io.emit(SocketEvent.fm, data, chatId);
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
