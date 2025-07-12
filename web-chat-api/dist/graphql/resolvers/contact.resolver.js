import contactService from "../../services/ContactService";
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
    Mutation: {},
    Subscription: {},
};
