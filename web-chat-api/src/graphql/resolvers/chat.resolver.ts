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
  Mutation: {},
  Subscription: {
    chats: {
      resolve: async (payload, args, { user }: IMyContext, info) => {
        // Manipulate and return the new value
        const result = await chatService.getChatList({
          userId: user.id.toString(),
        });

        return result;
      },
      subscribe: withFilter(
        (_p, { chatId }, { pubsub }) =>
          pubsub.asyncIterableIterator(SocketEvent.chatChanged),
        async (payload, variables, { user }: IMyContext) => {
          const chat = await Chat.findById(payload.chatId);

          const isUserInThisChat = (chat?.users as Types.ObjectId[]).includes(
            toObjectId(user.id.toString())
          );

          return isUserInThisChat;
        }
      ),
    },
  },
};
