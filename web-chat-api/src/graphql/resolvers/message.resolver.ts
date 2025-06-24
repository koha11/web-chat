import { subscribe } from "diagnostics_channel";
import Message from "../../models/Message.model";
import { toObjectId } from "../../utils/mongoose";
import { IResolvers } from "@graphql-tools/utils";
import { PubSub, withFilter } from "graphql-subscriptions";
import messageService from "../../services/MessageService";
import chatService from "../../services/ChatService";
import Chat from "../../models/Chat.model";
import IMyContext from "../../interfaces/myContext.interface";
import { Types } from "mongoose";

export const messageResolvers: IResolvers = {
  Query: {
    messages: async (_p: any, { chatId, msgId, after, first }) => {
      const result = await messageService.getMessages({ chatId, first });

      return result;
    },

    lastMessages: async (_p: any, {}, { user }) => {
      const chatIds = (
        await chatService.getChatList({ userId: user.id })
      ).edges.map((edge) => edge.node.id.toString());

      const result = await messageService.getLastMessage(chatIds);

      return result;
    },
  },

  Mutation: {
    postMessage: async (
      _p,
      { chatId, msgBody, user, replyForMsg },
      { pubsub }
    ) => {
      const createdMsg = await Message.create({
        chat: chatId,
        msgBody,
        user,
        replyForMsg,
      });

      const message = await createdMsg.populate("replyForMsg");

      await Chat.findByIdAndUpdate(message.chat, { updatedAt: new Date() });

      pubsub.publish("RECEIVE_MESSAGE_SUB", {
        receiveMessage: {
          node: message,
          cursor: message.id,
        },
        chatId,
      });

      return message;
    },
  },

  Subscription: {
    initLastMessage: {
      subscribe: (_p, { userId }, { pubsub }: { pubsub: PubSub }) => {
        return pubsub.asyncIterableIterator(`INIT_LAST_MESSAGE`);
      },
    },
    receiveMessage: {
      subscribe: withFilter(
        (_p, { chatId }, { pubsub }) =>
          pubsub.asyncIterableIterator(`RECEIVE_MESSAGE_SUB`),
        async (payload, variables, { user }: IMyContext) => {
          const chat = await Chat.findById(payload.chatId);

          const isUserInThisChat = (chat?.users as Types.ObjectId[]).includes(
            toObjectId(user.id.toString())
          );

          const isNotSender = !payload.receiveMessage.node.user.equals(user.id);

          return isNotSender && isUserInThisChat;
        }
      ),
    },
  },
};
