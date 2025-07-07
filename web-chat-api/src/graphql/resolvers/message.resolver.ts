import Chat from "@/models/Chat.model.ts";
import { withFilter } from "graphql-subscriptions";
import {} from "graphql-type-json";
import { Types } from "mongoose";
import MessageStatus from "../../enums/MessageStatus.enum.ts";
import SocketEvent from "../../enums/SocketEvent.enum.ts";
import { gemini_promp_process } from "../../gemini/index.ts";
import { IMessage } from "../../interfaces/message.interface.ts";
import IMyContext from "../../interfaces/socket/myContext.interface.ts";
import { PubsubEvents } from "../../interfaces/socket/pubsubEvents.ts";
import Message from "../../models/Message.model.ts";
import User from "../../models/User.model.ts";
import chatService from "../../services/ChatService.ts";
import messageService from "../../services/MessageService.ts";
import { toObjectId } from "../../utils/mongoose.ts";
import { IResolvers } from "@graphql-tools/utils";
import { Edge } from "@/interfaces/modelConnection.interface.ts";
import { IChat } from "@/interfaces/chat.interface.ts";
import UserType from "@/enums/UserType.enum.ts";
import { IUser } from "@/interfaces/user.interface.ts";

export const messageResolvers: IResolvers = {
  Query: {
    messages: async (
      _p: any,
      { chatId, msgId, after, first },
      { user, pubsub }: IMyContext
    ) => {
      const result = await messageService.getMessages({ chatId, first, after });
      const chat = await Chat.findById(chatId).populate("users");

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
      ).edges.map((edge: Edge<IChat>) => edge.node.id.toString());

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

      const users = chatChanged?.users as IUser[];

      const chatbot = users.find((user) => user.userType == UserType.CHATBOT);

      if (chatbot) {
        pubsub.publish(SocketEvent.messageTyping, {
          chatId,
          messageTyping: {
            isTyping: true,
            typingUser: chatbot,
          },
        } as PubsubEvents[SocketEvent.messageTyping]);

        setTimeout(async () => {
          const chatBotMessageBody = await gemini_promp_process(msgBody, chatId, user);

          const chatBotMessage = await Message.create({
            chat: chatId,
            user: chatbot.id,
            msgBody: chatBotMessageBody,
          });

          pubsub.publish(SocketEvent.messageAdded, {
            messageAdded: {
              node: chatBotMessage,
              cursor: chatBotMessage.id,
            },
            chatId,
          } as PubsubEvents[SocketEvent.messageAdded]);

          pubsub.publish(SocketEvent.chatChanged, {
            chatChanged,
          } as PubsubEvents[SocketEvent.chatChanged]);

          pubsub.publish(SocketEvent.messageTyping, {
            chatId,
            messageTyping: {
              isTyping: false,
              typingUser: chatbot,
            },
          } as PubsubEvents[SocketEvent.messageTyping]);
        }, 500);

        return message;
      }

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

        pubsub.publish(SocketEvent.messageChanged, {
          messageChanged: {
            cursor: msg.id,
            node: msg,
          },
        } as PubsubEvents[SocketEvent.messageChanged]);

        if ((lastMsgMap[chatId] as IMessage).id == msgId) {
          const chatChanged = await Chat.findByIdAndUpdate(
            chatId,
            { updatedAt: new Date() },
            { new: true }
          ).populate("users");

          pubsub.publish(SocketEvent.chatChanged, {
            chatChanged,
          } as PubsubEvents[SocketEvent.chatChanged]);
        }
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
    typeMessage: async (
      _p,
      { chatId, isTyping },
      { pubsub, user }: IMyContext
    ) => {
      const myUser = await User.findById(user.id);

      pubsub.publish(SocketEvent.messageTyping, {
        messageTyping: { typingUser: myUser, isTyping },
        chatId,
      } as PubsubEvents[SocketEvent.messageTyping]);
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
    messageTyping: {
      subscribe: withFilter(
        (_p, { chatId }, { pubsub }) => {
          return pubsub.asyncIterableIterator(SocketEvent.messageTyping);
        },
        async (
          { chatId, messageTyping }: PubsubEvents[SocketEvent.messageTyping],
          { chatId: subChatId },
          { user }: IMyContext
        ) => {
          const chat = await Chat.findById(chatId);

          const isUserInThisChat = (chat?.users as Types.ObjectId[]).includes(
            toObjectId(user.id.toString())
          );

          const isNotSender =
            messageTyping.typingUser.id != toObjectId(user.id);

          const isCorrectChat = chatId == subChatId;

          return isNotSender && isUserInThisChat && isCorrectChat;
        }
      ),
    },
  },
};
