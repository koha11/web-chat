import { subscribe } from "diagnostics_channel";
import Message from "../../models/Message.model";
import { toObjectId } from "../../utils/mongoose";
import { IResolvers } from "@graphql-tools/utils";
import { PubSub } from "graphql-subscriptions";
import messageService from "../../services/MessageService";
import chatService from "../../services/ChatService";

export const messageResolvers: IResolvers = {
  Query: {
    messages: async (_p: any, { chatId, msgId, after, first }) => {
      const filter = { chat: chatId } as any;

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
          startCursor: edges[0].cursor,
          hasNextPage,
          endCursor: edges.length ? edges[edges.length - 1].cursor : null,
        },
      };
    },

    lastMessages: async (_p: any, { userId }) => {
      const chatIds = (
        await chatService.getChatList({ userId: userId })
      ).edges.map((edge) => edge.node.id.toString());

      const result = await messageService.getLastMessage(chatIds);

      return result;
    },
  },

  Mutation: {
    postMessage: async (
      _p,
      { chatId, msgBody, user, replyForMsg },
      { pubsub }: { pubsub: PubSub }
    ) => {
      const createdMsg = await Message.create({
        chat: chatId,
        msgBody,
        user,
        replyForMsg,
      });

      const message = createdMsg.populate("replyForMsg");

      pubsub.publish("RECEIVE_MESSAGE_SUB", {
        receiveMessage: message,
        chatId,
      });

      return message;
    },
  },

  Subscription: {
    initLastMessage: {
      subscribe: (_p, { userId }, { pubsub }: { pubsub: PubSub }) => {
        console.log("[server] Subscribing to user:", userId);

        return pubsub.asyncIterableIterator(`INIT_LAST_MESSAGE`);
      },
    },
    receiveMessage: {
      subscribe: (_p, { userId }, { pubsub }: { pubsub: PubSub }) => {
        console.log("[server] Subscribing to user:", userId);

        return pubsub.asyncIterableIterator(`RECEIVE_MESSAGE_SUB`);
      },
    },
  },
};
