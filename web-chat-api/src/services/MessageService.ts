import { Server, Socket } from "socket.io";
import { ITokenPayload } from "../interfaces/auth/tokenPayload.interface";
import Message, { IMessage } from "../models/Message.model";
import Chat, { IChat } from "../models/Chat.model";
import chatService from "./ChatService";
import SocketEvent from "../enums/SocketEvent";
import MessageStatus from "../enums/MessageStatus.enum";
import { toObjectId } from "../utils/mongoose";
import { Types } from "mongoose";
import { IUser } from "../models/User.model";

class MessageService {
  listenSendMessage(
    socket: Socket,
    io: Server,
    userMap: { [userId: string]: string }
  ) {
    const user = socket.data.user as ITokenPayload;
    socket.on(SocketEvent.sm, async (msg: IMessage, chatId: string) => {
      console.log(user.username + " have sent " + msg.msgBody);

      const myMsg = (await Message.create(msg)) as IMessage;
      const chat = await Chat.findById(chatId).populate("users");

      (chat?.messages as Types.ObjectId[]).push(myMsg.id);

      await chat?.save();

      io.to(chatId).emit(SocketEvent.rm, myMsg, chatId);
      for (let user of chat?.users as IUser[]) {
        console.log("fetch chat list for", user.username);
        const chatList = await chatService.fetchChatListEvent(
          io,
          userMap,
          user.id
        );

        this.fetchLastMessageEvent(io, userMap, user.id, chatList);
      }
    });
  }

  listenFetchMessagesRequest = (
    socket: Socket,
    io: Server,
    userMap: { [userId: string]: string }
  ) => {
    socket.on(SocketEvent.fmr, (chatId: string) => {
      console.log(socket.data.user.username + " call " + SocketEvent.fmr);
      this.fetchMessagesEvent(io, userMap, chatId, socket.data.user.id);
    });
  };

  listenUnsendMessage = (
    socket: Socket,
    io: Server,
    userMap: { [userId: string]: string }
  ) => {
    socket.on(
      SocketEvent.um,
      async (msgId: string, chatId: string, isUnsendForEveryone: boolean) => {
        console.log(socket.data.user.username + " call " + SocketEvent.um);

        if (isUnsendForEveryone == true)
          await Message.findByIdAndUpdate(msgId, {
            status: MessageStatus.UNSEND,
          });
        else
          await Message.findByIdAndUpdate(msgId, {
            status: MessageStatus.REMOVED_ONLY_YOU,
          });

        this.fetchMessagesEvent(io, userMap, chatId, socket.data.user.id);
      }
    );
  };

  fetchLastMessageEvent = async (
    io: Server,
    userMap: { [userId: string]: string },
    userId: string,
    chatList: IChat[]
  ) => {
    const data = {} as { [chatId: string]: IMessage };

    for (let chat of chatList) {
      const messages = await this.getMessages(chat.id);

      if (messages != undefined && messages.length > 0)
        data[chat.id] = messages[0];
    }

    io.to(userMap[userId]).emit(SocketEvent.flm, data);
  };

  fetchMessagesEvent = async (
    io: Server,
    userMap: { [userId: string]: string },
    chatId: string,
    userId: string
  ) => {
    const messages = await this.getMessages(chatId);
    let isRefetch = false;

    for (let msg of messages) {
      if (
        msg.seenList.includes(toObjectId(userId)) ||
        (msg.user as Types.ObjectId).equals(toObjectId(userId))
      )
        break;

      msg.seenList.push(toObjectId(userId));

      if (msg.status == MessageStatus.SENT) msg.status = MessageStatus.SEEN;

      isRefetch = true;
      await msg.save();
    }

    if (isRefetch) {
      const chat = await Chat.findById(chatId);

      for (let receiverId of chat!.users as Types.ObjectId[]) {

        const chatList = await chatService.fetchChatListEvent(
          io,
          userMap,
          receiverId.toString()
        );

        await messageService.fetchLastMessageEvent(
          io,
          userMap,
          receiverId.toString(),
          chatList
        );
      }
    }

    io.to(userMap[userId]).emit(SocketEvent.fm, messages, chatId);
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
