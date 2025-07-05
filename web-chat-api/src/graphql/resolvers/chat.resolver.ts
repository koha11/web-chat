import SocketEvent from "@/enums/SocketEvent.enum.ts";
import IMyContext from "@/interfaces/socket/myContext.interface.ts";
import { PubsubEvents } from "@/interfaces/socket/pubsubEvents.ts";
import chatService from "@/services/ChatService.ts";
import { toObjectId } from "@/utils/mongoose.ts";
import { PubSub, withFilter } from "graphql-subscriptions";
import { IResolvers } from "@graphql-tools/utils";
import Chat from "@/models/Chat.model.ts";

export const chatResolvers: IResolvers = {
  Query: {
    chats: async (_p: any, { chatId, first, after }, { user }: IMyContext) => {
      const result = await chatService.getChatList({
        userId: user.id.toString(),
        after,
        first,
      });

      return result;
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
  },
};
