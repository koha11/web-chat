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

    const isNotEmpty = edges.length > 0;

    return {
      edges,
      pageInfo: {
        startCursor: isNotEmpty ? edges[0].cursor : null,
        hasNextPage,
        endCursor: isNotEmpty ? edges[edges.length - 1].cursor : null,
      },
    };
  };

  getLastMessage = async (chatIds: string[]) => {
    let result = {} as { [chatId: string]: IMessage | {} };

    for (let chatId of chatIds) {
      const msgList = (await this.getMessages({ chatId: chatId, first: 1 }))
        .edges;

      if (msgList.length != 0) result[chatId] = msgList[0].node;
    }

    return result;
  };

  updateSeenList = async ({
    chatId,
    userId,
    lastSeenMsgId,
  }: {
    chatId: string;
    userId: string;
    lastSeenMsgId: string;
  }) => {
    let myFilter = {
      chat: chatId,
      user: { $ne: userId },
    } as any;

    if (lastSeenMsgId) myFilter._id = { $gt: lastSeenMsgId };

    console.log(myFilter);

    const res = await Message.updateMany(myFilter, {
      $set: { [`seenList.${userId}`]: new Date().toISOString() },
    });

    console.log(res);
  };
}

const messageService = new MessageService();

export default messageService;
