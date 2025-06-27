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
import contactService from "../../services/ContactService";
export const contactResolvers: IResolvers = {
  Query: {
    contacts: async (_p: any, { first, after }, { user }: IMyContext) => {
      const result = await contactService.getContacts({
        userId: user.id.toString(),
        after,
        first,
      });

      console.log(result);

      return result;
    },
  },
  Mutation: {},
  Subscription: {},
};
