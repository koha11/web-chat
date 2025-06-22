import { Server, Socket } from "socket.io";
import { ITokenPayload } from "../interfaces/auth/tokenPayload.interface";
import chatService from "./ChatService";
import SocketEvent from "../enums/SocketEvent";
import MessageStatus from "../enums/MessageStatus.enum";
import { toObjectId } from "../utils/mongoose";
import { Types } from "mongoose";
import { IChat } from "../interfaces/chat.interface";
import { IMessage } from "../interfaces/message.interface";
import { IUser } from "../interfaces/user.interface";
import Chat from "../models/Chat.model";
import Message from "../models/Message.model";
import IModelConnection from "../interfaces/modelConnection.interface";

class MessageService {
  listenSendMessage(
    socket: Socket,
    io: Server,
    userMap: { [userId: string]: string }
  ) {
    const user = socket.data.user as ITokenPayload;
    socket.on(SocketEvent.sm, async (msg: IMessage, chatId: string) => {
      console.log(user.username + " have sent " + msg.msgBody);

      const createdMsg = await Message.create(msg);
      const myMsg = await createdMsg.populate("replyForMsg");

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
        Object.keys(msg.seenList).includes(userId) ||
        (msg.user as Types.ObjectId).equals(toObjectId(userId))
      )
        break;

      msg.seenList.set(userId, new Date().toISOString());

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

  // getMessages = async (chatId: string) => {
  //   const chat = await Chat.findById(chatId).populate({
  //     path: "messages",
  //     populate: {
  //       path: "replyForMsg",
  //       model: "Message", // optional if already in schema
  //     },
  //   });

  //   const myMsgList = (chat?.messages as IMessage[]) ?? [];

  //   myMsgList.sort(
  //     (a: IMessage, b: IMessage) =>
  //       new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
  //   );

  //   return myMsgList;
  // };

  getMessages = async ({
    chatId,
    first = 10,
    after,
  }: {
    chatId: string;
    sort?: any;
    first?: number;
    after?: string;
  }): Promise<IModelConnection<IMessage>> => {
    const filter = { chat: chatId } as any;

    if (after) {
      // decode cursor into ObjectId timestamp or full id
      filter._id = { $lt: toObjectId(after) };
    }

    const docs = await Message.find(filter)
      .populate("replyForMsg")
      .sort({ _id: -1 })
      .limit(first + 1);

    const hasNextPage = docs.length > first;
    const sliced = hasNextPage ? docs.slice(0, first) : docs;

    const edges = sliced.map((doc) => ({
      cursor: doc._id.toString(),
      node: doc,
    }));

    return {
      edges,
      pageInfo: {
        startCursor: edges.length ? edges[0].cursor : null,
        hasNextPage,
        endCursor: edges.length ? edges[edges.length - 1].cursor : null,
      },
    };
  };

  getLastMessage = async (chatIds: string[]) => {
    let result = [] as IModelConnection<IMessage>[];

    for (let chatId of chatIds) {
      const msg = await this.getMessages({ chatId: chatId, first: 1 });

      result.push(msg);
    }

    return result;
  };
}

const messageService = new MessageService();

export default messageService;
