import ContactRelationship from "@/enums/ContactRelationship.enum.js";
import UserType from "@/enums/UserType.enum.js";
import IMyContext from "@/interfaces/socket/myContext.interface.js";
import Contact from "@/models/Contact.model.js";
import User from "@/models/User.model.js";
import userService from "@/services/UserService.js";
import { IResolvers } from "@graphql-tools/utils";

export const userResolvers: IResolvers = {
  Query: {
    users: async (_p: any, { userId }) => {
      const data = await User.find();

      return data;
    },
    connectableUsers: async (_p: any, { userId }) => {
      const data = await userService.getConnectableUsers({ userId });

      return data;
    },
    receivedConnectRequests: async (_p: any, {}, { user }: IMyContext) => {
      const data = await userService.getUsersByRelationship({
        userId: user.id.toString(),
        relationship: ContactRelationship.requested,
      });

      return data;
    },
    sentConnectRequests: async (_p: any, { userId }) => {
      const data = await userService.getUsersByRelationship({
        userId,
        relationship: ContactRelationship.request,
      });

      return data;
    },
  },
  Mutation: {},
};
