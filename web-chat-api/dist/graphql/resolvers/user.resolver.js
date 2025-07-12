import ContactRelationship from "../../enums/ContactRelationship.enum.js";
import User from "../../models/User.model.js";
import userService from "../../services/UserService.js";
export const userResolvers = {
    Query: {
        users: async (_p, { userId }) => {
            const data = await User.find();
            return data;
        },
        connectableUsers: async (_p, { userId }) => {
            const data = await userService.getConnectableUsers({ userId });
            return data;
        },
        receivedConnectRequests: async (_p, {}, { user }) => {
            const data = await userService.getUsersByRelationship({
                userId: user.id.toString(),
                relationship: ContactRelationship.requested,
            });
            return data;
        },
        sentConnectRequests: async (_p, { userId }) => {
            const data = await userService.getUsersByRelationship({
                userId,
                relationship: ContactRelationship.request,
            });
            return data;
        },
    },
    Mutation: {},
};
