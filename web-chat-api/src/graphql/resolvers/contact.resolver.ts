import ContactRelationship from "@/enums/ContactRelationship.enum.ts";
import IMyContext from "@/interfaces/socket/myContext.interface.ts";
import Contact from "@/models/Contact.model.ts";
import contactService from "@/services/ContactService.ts";
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
      let contact = await Contact.findOne({ users: [userId, user.id] });

      if (!contact) {
        contact = await Contact.create({ users: [userId, user.id] });
      }

      // khoi tao relationsMap
      contact.relationships.set(userId, ContactRelationship.request);
      contact.relationships.set(
        user.id.toString(),
        ContactRelationship.requested
      );

      await contact.save();

      return contact;
    },
    hanldeRequest: async (
      _p: any,
      { userId, isAccepted },
      { user }: IMyContext
    ) => {
      const contact = await Contact.findOne({ users: [userId, user.id] });

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
  },
  Subscription: {},
};
