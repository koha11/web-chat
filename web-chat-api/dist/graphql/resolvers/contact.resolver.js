import ContactRelationship from "@/enums/ContactRelationship.enum.js";
import Contact from "@/models/Contact.model.js";
import User from "@/models/User.model.js";
import contactService from "@/services/ContactService.js";
export const contactResolvers = {
    Query: {
        contacts: async (_p, { first, after }, { user }) => {
            const result = await contactService.getContacts({
                userId: user.id.toString(),
                after,
                first,
            });
            return result;
        },
    },
    Mutation: {
        sendRequest: async (_p, { userId }, { user }) => {
            // Tao contact neu chua co
            let contact = await Contact.findOne({ users: [userId, user.id] });
            if (!contact) {
                contact = await Contact.create({
                    users: [userId, user.id],
                });
            }
            // khoi tao relationsMap
            contact.relationships.set(userId, ContactRelationship.request);
            contact.relationships.set(user.id.toString(), ContactRelationship.requested);
            await contact.save();
            const returnUser = await User.findById(userId);
            return returnUser;
        },
        handleRequest: async (_p, { contactId, isAccepted }, { user }) => {
            const contact = await Contact.findById(contactId);
            if (!contact)
                throw new Error("ko ton tai contact nay");
            const userId = contact.users
                .filter((uid) => uid != user.id)[0]
                .toString();
            const relationship = isAccepted
                ? ContactRelationship.connected
                : ContactRelationship.stranger;
            // khoi tao relationsMap
            contact.relationships.set(userId, relationship);
            contact.relationships.set(user.id.toString(), relationship);
            await contact.save();
            return true;
        },
    },
    Subscription: {},
};
