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
import { IMessage } from "../../interfaces/message.interface";

export const messageResolvers: IResolvers = {
  Query: {
    messages: async (
      _p: any,
      { chatId, msgId, after, first },
      { user, pubsub }: IMyContext
    ) => {
      const result = await messageService.getMessages({ chatId, first, after });
      const chat = await Chat.findById(chatId);

      const isNotEmpty = result.edges.length > 0;

      const isNotSeenBefore =
        isNotEmpty &&
        chat?.lastMsgSeen?.get(user.id.toString()) !=
          result.edges[0].node.id.toString();

      // update seenList cho tung msg
      const isUpdateSeenList = await messageService.updateSeenList({
        chatId,
        userId: user.id.toString(),
        lastSeenMsgId: chat!.lastMsgSeen?.get(user.id.toString()) ?? "",
      });

      if (isNotSeenBefore) {
        chat?.lastMsgSeen.set(user.id.toString(), result.edges[0].cursor);
        await chat?.save();
      }

      if (isUpdateSeenList) {
        pubsub.publish(SocketEvent.chatChanged, {
          chatChanged: chat,
        } as PubsubEvents[SocketEvent.chatChanged]);
      }

      return result;
    },

    lastMessages: async (_p: any, {}, { user }: IMyContext) => {
      const chatIds = (
        await chatService.getChatList({ userId: user.id.toString() })
      ).edges.map((edge) => edge.node.id.toString());

      const result = await messageService.getLastMessage(
        chatIds,
        user.id.toString()
      );

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

      const chatChanged = await Chat.findByIdAndUpdate(
        message.chat,
        { updatedAt: new Date() },
        { new: true }
      ).populate("users");

      pubsub.publish(SocketEvent.messageAdded, {
        messageAdded: {
          node: message,
          cursor: message.id,
        },
        chatId,
      } as PubsubEvents[SocketEvent.messageAdded]);

      pubsub.publish(SocketEvent.chatChanged, {
        chatChanged,
      } as PubsubEvents[SocketEvent.chatChanged]);

      return message;
    },
    unsendMessage: async (
      _p,
      { chatId, msgId },
      { pubsub, user }: IMyContext
    ) => {
      const msg = await Message.findById(msgId).populate("replyForMsg");

      if (msg) {
        msg.status = MessageStatus.UNSEND;
        msg.unsentAt = new Date();

        msg.save();

        const lastMsgMap = await messageService.getLastMessage(
          [chatId],
          user.id.toString()
        );

        if ((lastMsgMap[chatId] as IMessage).id == msgId)
          await Chat.findByIdAndUpdate(chatId, { updatedAt: new Date() });

        pubsub.publish(SocketEvent.messageChanged, {
          messageChanged: {
            cursor: msg.id,
            node: msg,
          },
        } as PubsubEvents[SocketEvent.messageChanged]);

        // pubsub.publish(SocketEvent.chatChanged, {
        //   chatId,
        // });
      }

      return msg;
    },
    removeMessage: async (
      _p,
      { chatId, msgId },
      { pubsub, user }: IMyContext
    ) => {
      const msg = await Message.findById(msgId).populate("replyForMsg");

      if (msg) {
        msg.isHiddenFor?.push(toObjectId(user.id));

        await msg.save();

        const lastMsgMap = await messageService.getLastMessage(
          [chatId],
          user.id.toString()
        );

        const lastMsg = lastMsgMap[chatId] as IMessage;

        await Chat.findByIdAndUpdate(
          chatId,
          {
            $set: {
              updatedAt:
                lastMsg.status == MessageStatus.UNSEND
                  ? lastMsg.unsentAt
                  : lastMsg.createdAt,
            },
          },
          { timestamps: false }
        );

        // pubsub.publish(SocketEvent.messageChanged, {
        //   messageChanged: {
        //     cursor: msg.id,
        //     node: msg,
        //   },
        // } as PubsubEvents[SocketEvent.messageChanged]);

        // pubsub.publish(SocketEvent.chatChanged, {
        //   chatId,
        // });
      }

      return msg;
    },
  },

  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        (_p, { chatId }, { pubsub }) =>
          pubsub.asyncIterableIterator(SocketEvent.messageAdded),
        async (
          { messageAdded, chatId }: PubsubEvents[SocketEvent.messageAdded],
          { chatId: subChatId },
          { user, pubsub }: IMyContext
        ) => {
          const chat = await Chat.findById(chatId);

          const isUserInThisChat = (chat?.users as Types.ObjectId[]).includes(
            toObjectId(user.id.toString())
          );

          const isNotSender = !(
            messageAdded.node.user as Types.ObjectId
          ).equals(user.id);

          const isCorrectChat = chatId == subChatId;

          if (isUserInThisChat && isCorrectChat) {
            // update seenList cho tung msg
            await messageService.updateSeenList({
              chatId,
              userId: user.id.toString(),
              lastSeenMsgId: chat!.lastMsgSeen?.get(user.id.toString()) ?? "",
            });

            chat?.lastMsgSeen.set(user.id.toString(), messageAdded.cursor);

            await chat?.save();

            pubsub.publish(SocketEvent.chatChanged, {
              chatChanged: chat,
            });
          }

          return isNotSender && isUserInThisChat && isCorrectChat;
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
