import { subscribe } from "diagnostics_channel";
import Message from "../../models/Message.model";
import { toObjectId } from "../../utils/mongoose";
import { IResolvers } from "@graphql-tools/utils";
import { PubSub, withFilter } from "graphql-subscriptions";
import messageService from "../../services/MessageService";
import chatService from "../../services/ChatService";
import Chat from "../../models/Chat.model";
import IMyContext from "../../interfaces/socket/myContext.interface";
import { Types } from "mongoose";
import SocketEvent from "../../enums/SocketEvent.enum";
import { PubsubEvents } from "../../interfaces/socket/pubsubEvents";
import { resolve } from "path";
import MessageStatus from "../../enums/MessageStatus.enum";

export const messageResolvers: IResolvers = {
  Query: {
    messages: async (
      _p: any,
      { chatId, msgId, after, first },
      { user }: IMyContext
    ) => {
      const result = await messageService.getMessages({ chatId, first, after });
      const chat = await Chat.findById(chatId);

      const isNotEmpty = result.edges.length > 0;

      const isNotSeenBefore =
        isNotEmpty &&
        chat?.lastMsgSeen?.get(user.id.toString()) !=
          result.edges[0].node.id.toString();

      await messageService.updateSeenList({
        chatId,
        userId: user.id.toString(),
        lastSeenMsgId: chat!.lastMsgSeen?.get(user.id.toString()) ?? "",
      });

      if (isNotSeenBefore) {
        await Chat.findByIdAndUpdate(chatId, {
          $set: { [`lastMsgSeen.${user.id}`]: result.edges[0].cursor },
        });
      }

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
      { chatId, msgBody, user, replyForMsg, isForwarded },
      { pubsub }: IMyContext
    ) => {
      const createdMsg = await Message.create({
        chat: chatId,
        msgBody,
        user,
        replyForMsg,
        isForwarded,
      });

      const message = await createdMsg.populate("replyForMsg");

      await Chat.findByIdAndUpdate(message.chat, { updatedAt: new Date() });

      pubsub.publish(SocketEvent.messageAdded, {
        messageAdded: {
          node: message,
          cursor: message.id,
        },
        chatId,
      } as PubsubEvents[SocketEvent.messageAdded]);

      pubsub.publish(SocketEvent.chatChanged, {
        chatId,
      });

      return message;
    },
    unsendMessage: async (
      _p,
      { chatId, msgId, status },
      { pubsub }: IMyContext
    ) => {
      const msg = await Message.findById(msgId).populate("replyForMsg");

      msg!.status = MessageStatus.UNSEND;
      msg!.unsentAt = new Date();

      msg?.save();

      await Chat.findByIdAndUpdate(chatId, { updatedAt: new Date() });

      pubsub.publish(SocketEvent.messageChanged, {
        messageChanged: {
          cursor: msg?.id,
          node: msg,
        },
      } as PubsubEvents[SocketEvent.messageChanged]);

      pubsub.publish(SocketEvent.chatChanged, {
        chatId,
      });

      return msg;
    },
    removeMessage: async (
      _p,
      { chatId, msgId, status },
      { pubsub, user }: IMyContext
    ) => {
      const msg = await Message.findById(msgId).populate("replyForMsg");

      msg!.isHiddenFor?.push(toObjectId(user.id));

      msg?.save();

      await Chat.findByIdAndUpdate(chatId, { updatedAt: new Date() });

      pubsub.publish(SocketEvent.messageChanged, {
        messageChanged: {
          cursor: msg?.id,
          node: msg,
        },
      } as PubsubEvents[SocketEvent.messageChanged]);

      pubsub.publish(SocketEvent.chatChanged, {
        chatId,
      });

      return msg;
    },
  },

  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        (_p, { chatId }, { pubsub }) =>
          pubsub.asyncIterableIterator(SocketEvent.messageAdded),
        async (payload, variables, { user }: IMyContext) => {
          const chat = await Chat.findById(payload.chatId);

          const isUserInThisChat = (chat?.users as Types.ObjectId[]).includes(
            toObjectId(user.id.toString())
          );

          const isNotSender = !payload.messageAdded.node.user.equals(user.id);

          return isNotSender && isUserInThisChat;
        }
      ),
    },
    messageChanged: {
      subscribe: withFilter(
        (_p, { chatId }, { pubsub }) =>
          pubsub.asyncIterableIterator(SocketEvent.messageChanged),
        async (payload, { chatId }, { user }: IMyContext) => {
          const chat = await Chat.findById(chatId);

          const isUserInThisChat = (chat?.users as Types.ObjectId[]).includes(
            toObjectId(user.id.toString())
          );

          const isNotSender = !payload.messageChanged.node.user.equals(user.id);

          return isNotSender && isUserInThisChat;
        }
      ),
    },
  },
};
