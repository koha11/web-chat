import { PubSub } from "graphql-subscriptions";
import Chat from "../../models/Chat.model";
import { toObjectId } from "../../utils/mongoose";
import { IResolvers } from "@graphql-tools/utils";
import Message from "../../models/Message.model";
import messageService from "../../services/MessageService";
import IMyContext from "../../interfaces/myContext.interface";
import chatService from "../../services/ChatService";
export const chatResolvers: IResolvers = {
  Query: {
    chats: async (_p: any, { chatId, first, after }, { user }: IMyContext) => {
      const result = await chatService.getChatList({
        userId: user.id.toString(),
      });

      return result;
    },
  },
  Mutation: {},
  Subscription: {},
};
