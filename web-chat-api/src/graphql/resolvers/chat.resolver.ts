import { PubSub, withFilter } from "graphql-subscriptions";
import Chat from "../../models/Chat.model";
import { toObjectId } from "../../utils/mongoose";
import { IResolvers } from "@graphql-tools/utils";
import Message from "../../models/Message.model";
import messageService from "../../services/MessageService";
import IMyContext from "../../interfaces/socket/myContext.interface";
import chatService from "../../services/ChatService";
import { subscribe } from "diagnostics_channel";
import { Types } from "mongoose";
import SocketEvent from "../../enums/SocketEvent.enum";
import { PubsubEvents } from "../../interfaces/socket/pubsubEvents";
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
