import Chat from "../../models/Chat.model.js";
import { withFilter } from "graphql-subscriptions";
import {} from "graphql-type-json";
import { Types } from "mongoose";
import MessageStatus from "../../enums/MessageStatus.enum.js";
import SocketEvent from "../../enums/SocketEvent.enum.js";
import { gemini_promp_process } from "../../gemini/index.js";
import { IMessage } from "../../interfaces/message.interface.js";
import IMyContext from "../../interfaces/socket/myContext.interface.js";
import { PubsubEvents } from "../../interfaces/socket/pubsubEvents.js";
import Message from "../../models/Message.model.js";
import User from "../../models/User.model.js";
import chatService from "../../services/ChatService.js";
import messageService from "../../services/MessageService.js";
import { toObjectId } from "../../utils/mongoose.js";
import { IResolvers } from "@graphql-tools/utils";
import { Edge } from "../../interfaces/modelConnection.interface.js";
import { IChat } from "../../interfaces/chat.interface.js";
import UserType from "../../enums/UserType.enum.js";
import { IUser } from "../../interfaces/user.interface.js";
import { FileUpload } from "graphql-upload/processRequest.mjs";
import MessageType from "../../enums/MessageType.enum.js";
import { uploadMedia } from "../../utils/cloudinary.js";

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
        await chat?.save({ timestamps: false });
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

    fileMessages: async (
      _p: any,
      { chatId, after, first, isMediaFile },
      { user, pubsub }: IMyContext
    ) => {
      const filter = isMediaFile
        ? {
            type: {
              $in: [MessageType.IMAGE, MessageType.VIDEO],
            },
          }
        : {
            type: MessageType.FILE,
          };

      const result = await messageService.getMessages({
        chatId,
        first,
        after,
        filter,
      });

      const isNotEmpty = result.edges.length > 0;

      console.log(result);

      return result;
    },
  },

  Mutation: {
    postMessage: async (
      _p,
      { chatId, msgBody, replyForMsg, isForwarded },
      { pubsub, user }: IMyContext
    ) => {
      const createdMsg = await Message.create({
        chat: chatId,
        user: user.id,
        msgBody,
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
          const chatBotMessageBody = await gemini_promp_process(
            msgBody,
            chatId,
            user.id.toString()
          );

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

    postMediaMessage: async (
      _p,
      { chatId, files, replyForMsg, isForwarded },
      { pubsub, user }: IMyContext
    ) => {
      const myFiles = (await Promise.all(files)) as FileUpload[];

      let messages: IMessage[] = [];

      for (let file of myFiles) {
        let type = MessageType.TEXT;
        const mimeType = file.mimetype;

        if (mimeType.startsWith("video")) type = MessageType.VIDEO;

        if (mimeType.startsWith("image")) type = MessageType.IMAGE;

        if (mimeType.startsWith("audio")) type = MessageType.AUDIO;

        if (mimeType.startsWith("application")) type = MessageType.FILE;

        console.log(file);

        const { secure_url, bytes } = await uploadMedia({
          file,
          folder: `chats/${chatId}/${type}`,
          type,
        });

        const createdMsg = await Message.create({
          chat: chatId,
          user: user.id,
          file: {
            filename: file.filename,
            type: file.mimetype,
            url: secure_url,
            size: bytes,
          },
          replyForMsg,
          isForwarded,
          type,
        });

        const message = await createdMsg.populate("replyForMsg");

        messages.push(message);

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
      }

      return messages;
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
          userChangedId: user.id,
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
      { user, pubsub }: IMyContext
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

        const chatChanged = await Chat.findByIdAndUpdate(
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

        pubsub.publish(SocketEvent.chatChanged, {
          chatChanged,
        } as PubsubEvents[SocketEvent.chatChanged]);
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

    reactMessage: async (
      _p,
      { msgId, unified, emoji },
      { pubsub, user }: IMyContext
    ) => {
      const msg = await Message.findById(msgId).populate("replyForMsg");

      if (msg) {
        if (!msg.reactions) msg.reactions = new Map();

        msg.reactions?.set(user.id.toString(), {
          emoji,
          unified,
          reactTime: new Date(),
        });

        await msg.save();

        const chatChanged = await Chat.findByIdAndUpdate(
          msg.chat,
          {
            $set: {
              updatedAt: Date.now(),
            },
          },
          { timestamps: false }
        );

        pubsub.publish(SocketEvent.chatChanged, {
          chatChanged,
        } as PubsubEvents[SocketEvent.chatChanged]);

        pubsub.publish(SocketEvent.messageChanged, {
          messageChanged: {
            cursor: msg.id,
            node: msg,
          },
          userChangedId: user.id,
        } as PubsubEvents[SocketEvent.messageChanged]);
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
        async (
          { messageChanged, userChangedId },
          { chatId },
          { user }: IMyContext
        ) => {
          const chat = await Chat.findById(chatId);

          const isUserInThisChat = (chat?.users as Types.ObjectId[]).includes(
            toObjectId(user.id.toString())
          );

          const isNotSender = userChangedId != user.id;

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
