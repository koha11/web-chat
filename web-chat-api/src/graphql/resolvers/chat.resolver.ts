import SocketEvent from "../../enums/SocketEvent.enum.js";
import IMyContext from "../../interfaces/socket/myContext.interface.js";
import { PubsubEvents } from "../../interfaces/socket/pubsubEvents.js";
import chatService from "../../services/ChatService.js";
import { toObjectId } from "../../utils/mongoose.js";
import { PubSub, withFilter } from "graphql-subscriptions";
import { IResolvers } from "@graphql-tools/utils";
import Chat from "../../models/Chat.model.js";
import User from "../../models/User.model.js";
import { uploadMedia } from "../../utils/cloudinary.js";
import { FileUpload } from "graphql-upload/processRequest.mjs";
import Message from "../../models/Message.model.js";
import MessageType from "../../enums/MessageType.enum.js";
import { Types } from "mongoose";
import { IUser } from "../../interfaces/user.interface.js";
import { chat } from "googleapis/build/src/apis/chat/index.js";

export const chatResolvers: IResolvers = {
  Query: {
    chats: async (
      _p: any,
      { first, after, chatName },
      { user }: IMyContext
    ) => {
      const result = await chatService.getChatList({
        userId: user.id.toString(),
        after,
        first,
        chatName,
      });

      return result;
    },
    chat: async (_p, { chatId, users }, { user }: IMyContext) => {
      if (chatId) {
        const chat = await Chat.findById(chatId).populate("users");
        return chat;
      }

      if (users && users.length > 0) {
        const userIds = [
          ...users.map((userId: string) => toObjectId(userId)),
          toObjectId(user.id),
        ];

        const chat = await Chat.findOne({
          users: { $all: userIds },
          $expr: { $eq: [{ $size: "$users" }, userIds.length] },
        }).populate("users");

        return chat;
      }

      return undefined;
    },
  },
  Mutation: {
    postChat: async (_p: any, { users }, { user, pubsub }: IMyContext) => {
      const chat = await chatService.createChat(users, user.id.toString());

      if (chat.chatType == "GROUP") {
        const msg = await Message.create({
          chat: chat.id,
          type: MessageType.SYSTEM,
          user: user.id,
          systemLog: {
            type: "create",
          },
        });

        pubsub.publish(SocketEvent.messageAdded, {
          chatId: chat.id,
          messageAdded: {
            cursor: msg.id,
            node: msg,
          },
        } as PubsubEvents[SocketEvent.messageAdded]);
      }

      return chat;
    },

    addMembers: async (
      _p: any,
      { userIds, chatId },
      { user, pubsub }: IMyContext
    ) => {
      const chat = await Chat.findById(chatId).populate("users");

      if (!chat) throw new Error("this chat is not existed");

      const chatUserIds = (chat.users as IUser[]).map((u) => u.id.toString());

      if (chatUserIds.some((id) => userIds.includes(id)))
        throw new Error("some users are already in the chat");

      chat.users.push(...userIds);

      for (let myUserId of userIds) {
        const myUser = await User.findById(myUserId);

        if (!myUser) throw new Error(`User with id ${myUserId} does not exist`);

        chat.usersInfo.set(myUserId, {
          nickname: myUser.fullname,
          addBy: user.id.toString(),
          joinAt: new Date(),
          role: "MEMBER",
          avatar: myUser.avatar,
          fullname: myUser.fullname,
        });
      }

      await chat.save();

      const msg = await Message.create({
        chat: chatId,
        type: MessageType.SYSTEM,
        user: user.id,
        systemLog: {
          type: "add",
          targetUserId: userIds.join(","),
        },
      });

      pubsub.publish(SocketEvent.chatChanged, {
        chatChanged: {
          chat,
          publisherId: user.id.toString(),
        },
      } as PubsubEvents[SocketEvent.chatChanged]);

      pubsub.publish(SocketEvent.messageAdded, {
        chatId,
        messageAdded: {
          cursor: msg.id,
          node: msg,
        },
      } as PubsubEvents[SocketEvent.messageAdded]);

      return chat;
    },

    leaveChat: async (_p: any, { chatId }, { user, pubsub }: IMyContext) => {
      const chat = await Chat.findById(chatId).populate("users");

      if (!chat) throw new Error("this chat is not existed");

      chat.users = (chat.users as IUser[]).filter(
        (u) => u.id.toString() !== user.id.toString()
      );

      await chat.save();

      const msg = await Message.create({
        chat: chatId,
        type: MessageType.SYSTEM,
        user: user.id,
        systemLog: {
          type: "leave",
        },
      });

      pubsub.publish(SocketEvent.chatChanged, {
        chatChanged: {
          chat,
          publisherId: user.id.toString(),
        },
      } as PubsubEvents[SocketEvent.chatChanged]);

      pubsub.publish(SocketEvent.messageAdded, {
        chatId,
        messageAdded: {
          cursor: msg.id,
          node: msg,
        },
      } as PubsubEvents[SocketEvent.messageAdded]);

      return chat;
    },

    removeFromChat: async (
      _p: any,
      { chatId, removedUserId },
      { user, pubsub }: IMyContext
    ) => {
      const chat = await Chat.findById(chatId).populate("users");

      if (!chat) throw new Error("this chat is not existed");

      chat.users = (chat.users as IUser[]).filter(
        (u) => u.id.toString() !== removedUserId.toString()
      );

      await chat.save();

      const msg = await Message.create({
        chat: chatId,
        type: MessageType.SYSTEM,
        user: user.id,
        systemLog: {
          type: "remove",
          targetUserId: removedUserId,
        },
      });

      pubsub.publish(SocketEvent.chatChanged, {
        chatChanged: {
          chat,
          publisherId: user.id.toString(),
        },
      } as PubsubEvents[SocketEvent.chatChanged]);

      pubsub.publish(SocketEvent.messageAdded, {
        chatId,
        messageAdded: {
          cursor: msg.id,
          node: msg,
        },
      } as PubsubEvents[SocketEvent.messageAdded]);

      return chat;
    },

    changeNickname: async (
      _p: any,
      { chatId, changedUserId, nickname },
      { user, pubsub }: IMyContext
    ) => {
      const chat = await Chat.findById(chatId).populate("users");

      if (!chat) throw new Error("this chat is not existed");

      const userInfo = chat.usersInfo.get(changedUserId);

      if (!userInfo)
        throw new Error(
          `ko ton tai usersInfo cho id=${changedUserId} trong doan chat ${chatId}`
        );

      chat.usersInfo.set(changedUserId, { ...userInfo, nickname });

      await chat.save();

      const msg = await Message.create({
        chat: chatId,
        type: MessageType.SYSTEM,
        user: user.id,
        systemLog: {
          type: "nickname",
          value: nickname,
          targetUserId: changedUserId,
        },
      });

      pubsub.publish(SocketEvent.chatChanged, {
        chatChanged: {
          chat,
          publisherId: user.id.toString(),
        },
      } as PubsubEvents[SocketEvent.chatChanged]);

      pubsub.publish(SocketEvent.messageAdded, {
        chatId,
        messageAdded: {
          cursor: msg.id,
          node: msg,
        },
      } as PubsubEvents[SocketEvent.messageAdded]);

      return chat;
    },

    changeChatAvatar: async (
      _p: any,
      { chatId, file },
      { user, pubsub }: IMyContext
    ) => {
      const chatAvatarFile = (await file) as FileUpload;

      const { secure_url } = await uploadMedia({
        file: chatAvatarFile,
        folder: `chats/${chatId}/avatar`,
      });

      const chat = await Chat.findById(chatId).populate("users");

      if (!chat) throw new Error("this chat is not existed");

      chat.chatAvatar = secure_url;

      await chat.save();

      const msg = await Message.create({
        chat: chatId,
        type: MessageType.SYSTEM,
        user: user.id,
        systemLog: {
          type: "avatar",
        },
      });

      pubsub.publish(SocketEvent.chatChanged, {
        chatChanged: {
          chat,
          publisherId: user.id.toString(),
        },
      } as PubsubEvents[SocketEvent.chatChanged]);

      pubsub.publish(SocketEvent.messageAdded, {
        chatId,
        messageAdded: {
          cursor: msg.id,
          node: msg,
        },
      } as PubsubEvents[SocketEvent.messageAdded]);

      return chat;
    },

    changeChatName: async (
      _p: any,
      { chatId, chatName },
      { user, pubsub }: IMyContext
    ) => {
      const chat = await Chat.findById(chatId).populate("users");

      if (!chat) throw new Error("this chat is not existed");

      chat.chatName = chatName;

      await chat.save();

      const msg = await Message.create({
        chat: chatId,
        type: MessageType.SYSTEM,
        user: user.id,
        systemLog: {
          type: "chatname",
          value: chatName,
        },
      });

      pubsub.publish(SocketEvent.chatChanged, {
        chatChanged: {
          chat,
          publisherId: user.id.toString(),
        },
      } as PubsubEvents[SocketEvent.chatChanged]);

      pubsub.publish(SocketEvent.messageAdded, {
        chatId,
        messageAdded: {
          cursor: msg.id,
          node: msg,
        },
      } as PubsubEvents[SocketEvent.messageAdded]);

      return chat;
    },

    changeChatEmoji: async (
      _p: any,
      { chatId, emoji },
      { user, pubsub }: IMyContext
    ) => {
      const chat = await Chat.findById(chatId).populate("users");

      if (!chat) throw new Error("this chat is not existed");

      chat.chatEmoji = emoji;

      await chat.save();

      const msg = await Message.create({
        chat: chatId,
        type: MessageType.SYSTEM,
        user: user.id,
        systemLog: {
          type: "chatEmoji",
          value: emoji,
        },
      });

      pubsub.publish(SocketEvent.chatChanged, {
        chatChanged: {
          chat,
          publisherId: user.id.toString(),
        },
      } as PubsubEvents[SocketEvent.chatChanged]);

      pubsub.publish(SocketEvent.messageAdded, {
        chatId,
        messageAdded: {
          cursor: msg.id,
          node: msg,
        },
      } as PubsubEvents[SocketEvent.messageAdded]);

      return chat;
    },

    makeCall: async (
      _p,
      { chatId, hasVideo },
      { pubsub, user }: IMyContext
    ) => {
      const myUser = await User.findById(user.id);

      const msg = await Message.create({
        chat: chatId,
        user: user.id,
        type: hasVideo ? MessageType.VIDEO_CALL : MessageType.AUDIO_CALL,
      });

      pubsub.publish(SocketEvent.ongoingCall, {
        ongoingCall: {
          user: myUser,
          hasVideo,
          chatId,
          msgId: msg.id,
        },
      } as PubsubEvents[SocketEvent.ongoingCall]);

      return msg.id;
    },

    handleCall: async (
      _p,
      { chatId, isAccepted, msgId },
      { pubsub, user }: IMyContext
    ) => {
      await Message.findByIdAndUpdate(msgId, { updatedAt: new Date() });

      pubsub.publish(SocketEvent.responseCall, {
        responseCall: isAccepted,
        userId: user.id,
        msgId,
        chatId,
      } as PubsubEvents[SocketEvent.responseCall]);

      return isAccepted;
    },

    hangupCall: async (_p, { chatId, msgId }, { pubsub, user }: IMyContext) => {
      const msg = await Message.findById(msgId);

      if (!msg) throw new Error("ko ton tai msg nay");

      let chatUpdatedAt;

      if (
        new Date(msg.createdAt!).getTime() != new Date(msg.updatedAt!).getTime()
      ) {
        msg.endedCallAt = new Date();
        chatUpdatedAt = msg.endedCallAt;
        await msg.save();
      } else {
        chatUpdatedAt = msg.createdAt;
      }

      pubsub.publish(SocketEvent.responseCall, {
        responseCall: false,
        userId: user.id,
        chatId,
        msgId,
      } as PubsubEvents[SocketEvent.responseCall]);

      pubsub.publish(SocketEvent.chatChanged, {
        chatChanged: {
          chat: await Chat.findByIdAndUpdate(chatId, {
            updatedAt: chatUpdatedAt,
          }).populate("users"),
          publisherId: user.id.toString(),
        },
      } as PubsubEvents[SocketEvent.chatChanged]);

      pubsub.publish(SocketEvent.messageAdded, {
        chatId,
        messageAdded: {
          cursor: msg.id,
          node: msg,
        },
      } as PubsubEvents[SocketEvent.messageAdded]);

      return false;
    },
  },
  Subscription: {
    chatChanged: {
      subscribe: withFilter(
        (_p, { userId }, { pubsub }) =>
          pubsub.asyncIterableIterator(SocketEvent.chatChanged),
        async (
          { chatChanged }: PubsubEvents[SocketEvent.chatChanged],
          variables,
          { user }: IMyContext
        ) => {
          const isUserInThisChat = chatChanged.chat.users
            .map((user) => user.id)
            .includes(toObjectId(user.id.toString()));

          return isUserInThisChat;
        }
      ),
    },

    ongoingCall: {
      subscribe: withFilter(
        (_p, variables, { pubsub }) =>
          pubsub.asyncIterableIterator(SocketEvent.ongoingCall),
        async (
          { ongoingCall }: PubsubEvents[SocketEvent.ongoingCall],
          variables,
          { user }: IMyContext
        ) => {
          const chat = await Chat.findById(ongoingCall.chatId).populate(
            "users"
          );

          const isNotSender = ongoingCall.user.id != toObjectId(user.id);

          const isUserInThisChat = chat!.users
            .map((user) => user.id)
            .includes(toObjectId(user.id.toString()));

          return isUserInThisChat && isNotSender;
        }
      ),
    },

    responseCall: {
      subscribe: withFilter(
        (_p, { msgId, responseCall }, { pubsub }) => {
          return pubsub.asyncIterableIterator(SocketEvent.responseCall);
        },
        async (
          {
            responseCall,
            chatId,
            userId,
          }: PubsubEvents[SocketEvent.responseCall],
          variables,
          { user }: IMyContext
        ) => {
          const chat = await Chat.findById(chatId);

          const isNotSender = userId != user.id;

          const isUserInThisChat = (chat!.users as Types.ObjectId[]).includes(
            toObjectId(user.id)
          );

          return isUserInThisChat && isNotSender;
        }
      ),
    },
  },
};
