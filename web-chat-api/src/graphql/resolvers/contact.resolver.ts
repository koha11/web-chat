import ContactRelationship from "../../enums/ContactRelationship.enum.js";
import IMyContext from "../../interfaces/socket/myContext.interface.js";
import Contact from "../../models/Contact.model.js";
import contactService from "../../services/ContactService.js";
import { IResolvers } from "@graphql-tools/utils";

export const contactResolvers: IResolvers = {
  Query: {
    contacts: async (_p: any, { first, after }, { user }: IMyContext) => {
      const result = await contactService.getContacts({
        userId: user.id.toString(),
        after,
        first,
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
      { user }: IMyContext
    ) => {
      const contact = await Contact.findOne({
        users: { $all: [userId, user.id], $size: 2 },
      }).populate("users");

      console.log(userId);
      console.log(user.id);

      if (!contact) throw new Error("ko ton tai contact nay");

      const relationship = isAccepted
        ? ContactRelationship.connected
        : ContactRelationship.stranger;

      // khoi tao relationsMap
      contact.relationships.set(userId, relationship);
      contact.relationships.set(user.id.toString(), relationship);

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
