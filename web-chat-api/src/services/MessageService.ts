import MessageStatus from "../enums/MessageStatus.enum.js";
import { IMessage } from "../interfaces/message.interface.js";
import IModelConnection from "../interfaces/modelConnection.interface.js";
import Message from "../models/Message.model.js";
import { toObjectId } from "../utils/mongoose.js";

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
      cursor: doc.id,
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

  getLastMessage = async (chatIds: string[], userId: string) => {
    let result = {} as { [chatId: string]: IMessage | {} };

    for (let chatId of chatIds) {
      let msgList;
      let msg;

      do {
        msgList = (
          await this.getMessages({
            chatId: chatId,
            first: 1,
            after: msg ? msg?.id.toString() : undefined,
          })
        ).edges;
        if (msgList.length == 0) break;

        msg = msgList[0].node;
      } while (msg.isHiddenFor?.includes(toObjectId(userId)));

      if (msgList.length != 0) result[chatId] = msg!;
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

    const messages = await Message.find(myFilter);

    for (let msg of messages) {
      msg.seenList.set(userId, new Date().toISOString());

      if (msg.status == MessageStatus.SENT) msg.status = MessageStatus.SEEN;

      await msg.save();
    }

    return messages.length != 0;
  };
}

const messageService = new MessageService();

export default messageService;
