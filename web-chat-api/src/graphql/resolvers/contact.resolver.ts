import ContactRelationship from "../../enums/ContactRelationship.enum.js";
import MessageType from "../../enums/MessageType.enum.js";
import SocketEvent from "../../enums/SocketEvent.enum.js";
import IMyContext from "../../interfaces/socket/myContext.interface.js";
import { PubsubEvents } from "../../interfaces/socket/pubsubEvents.js";
import Chat from "../../models/Chat.model.js";
import Contact from "../../models/Contact.model.js";
import Message from "../../models/Message.model.js";
import chatService from "../../services/ChatService.js";
import contactService from "../../services/ContactService.js";
import { IResolvers } from "@graphql-tools/utils";

export const contactResolvers: IResolvers = {
  Query: {
    contacts: async (_p: any, { first, after, search }, { user }: IMyContext) => {
      const result = await contactService.getContacts({
        userId: user.id.toString(),
        after,
        first,
        search
      });

      return result;
    },
  },
  Mutation: {
    sendRequest: async (_p: any, { userId }, { user }: IMyContext) => {
      // Tao contact neu chua co
      let contact = await Contact.findOne({
        users: { $all: [userId, user.id], $size: 2 },
      }).populate("users");

      if (!contact) {
        contact = await Contact.create({
          users: [userId, user.id],
        });

        contact = await contact.populate("users");
      }

      // khoi tao relationsMap
      contact.relationships.set(userId, ContactRelationship.requested);
      contact.relationships.set(
        user.id.toString(),
        ContactRelationship.request
      );

      await contact.save();

      return contact;
    },
    handleRequest: async (
      _p: any,
      { userId, isAccepted },
      { user, pubsub }: IMyContext
    ) => {
      const contact = await Contact.findOne({
        users: { $all: [userId, user.id], $size: 2 },
      }).populate("users");

      if (!contact) throw new Error("ko ton tai contact nay");

      const relationship = isAccepted
        ? ContactRelationship.connected
        : ContactRelationship.stranger;

      // khoi tao relationsMap
      contact.relationships.set(userId, relationship);
      contact.relationships.set(user.id.toString(), relationship);

      if (isAccepted && !contact.chatId) {
        // tao doan chat neu chua ton tai
        const chat = await chatService.createChat(
          [userId, user.id],
          user.id.toString()
        );

        // tao 1 system msg de thong bao j do
        const msg = await Message.create({
          chat: chat.id,
          type: MessageType.SYSTEM,
          user: user.id,
          systemLog: {
            type: "newChat",
          },
        });

        // publish chat changed subscription
        pubsub.publish(SocketEvent.chatChanged, {
          chatChanged: chat,
        } as PubsubEvents[SocketEvent.chatChanged]);
      }

      await contact.save();

      return contact;
    },
    removeConnect: async (_p: any, { userId }, { user }: IMyContext) => {
      const contact = await Contact.findOne({
        users: { $all: [userId, user.id], $size: 2 },
      }).populate("users");

      if (!contact) throw new Error("ko ton tai contact nay");

      // khoi tao relationsMap
      contact.relationships.set(userId, ContactRelationship.stranger);
      contact.relationships.set(
        user.id.toString(),
        ContactRelationship.stranger
      );

      await contact.save();

      return contact;
    },
  },
  Subscription: {},
};
