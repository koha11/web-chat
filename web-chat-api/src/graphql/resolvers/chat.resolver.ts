import SocketEvent from "@/enums/SocketEvent.enum.js";
import IMyContext from "@/interfaces/socket/myContext.interface.js";
import { PubsubEvents } from "@/interfaces/socket/pubsubEvents.js";
import chatService from "@/services/ChatService.js";
import { toObjectId } from "@/utils/mongoose.js";
import { PubSub, withFilter } from "graphql-subscriptions";
import { IResolvers } from "@graphql-tools/utils";
import Chat from "@/models/Chat.model.js";
import User from "@/models/User.model.js";

export const chatResolvers: IResolvers = {
  Query: {
    chats: async (_p: any, { first, after }, { user }: IMyContext) => {
      const result = await chatService.getChatList({
        userId: user.id.toString(),
        after,
        first,
      });

      return result;
    },
    chat: async (_p, { chatId }, {}) => {
      const chat = await Chat.findById(chatId).populate("users");

      return chat;
    },
  },
  Mutation: {
    postChat: async (_p: any, { users }, { user }: IMyContext) => {
      const result = await chatService.createChat(users);

      return result;
    },
    changeNickname: async (
      _p: any,
      { chatId, changedUserId, nickname },
      { user, pubsub }: IMyContext
    ) => {
      const chat = await Chat.findById(chatId).populate("users");

      chat?.nicknames.set(changedUserId, nickname);

      chat?.save();

      pubsub.publish(SocketEvent.chatChanged, {
        chatChanged: chat,
      } as PubsubEvents[SocketEvent.chatChanged]);

      return chat;
    },
    makeCall: async (
      _p,
      { chatId, hasVideo },
      { pubsub, user }: IMyContext
    ) => {
      const myUser = await User.findById(user.id);

      pubsub.publish(SocketEvent.ongoingCall, {
        ongoingCall: {
          user: myUser,
          hasVideo,
          chatId,
        },
      } as PubsubEvents[SocketEvent.ongoingCall]);

      return true;
    },
    handleCall: async (
      _p,
      { chatId, isAccepted },
      { pubsub, user }: IMyContext
    ) => {
      pubsub.publish(SocketEvent.responseCall, {
        responseCall: isAccepted,
        userId: user.id,
      } as PubsubEvents[SocketEvent.responseCall]);

      return isAccepted;
    },
    hangupCall: async (_p, { chatId }, { pubsub, user }: IMyContext) => {
      pubsub.publish(SocketEvent.responseCall, {
        responseCall: false,
        userId: user.id,
        chatId,
      } as PubsubEvents[SocketEvent.responseCall]);

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
          const isUserInThisChat = chatChanged?.users
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
        (_p, variables, { pubsub }) =>
          pubsub.asyncIterableIterator(SocketEvent.responseCall),
        async (
          {
            responseCall,
            chatId,
            userId,
          }: PubsubEvents[SocketEvent.responseCall],
          variables,
          { user }: IMyContext
        ) => {
          const chat = await Chat.findById(chatId).populate("users");

          const isNotSender = userId != user.id;

          const isUserInThisChat = chat!.users
            .map((user) => user.id)
            .includes(toObjectId(user.id.toString()));

          return isUserInThisChat && isNotSender;
        }
      ),
    },
  },
};
