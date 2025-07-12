import UserType from "@/enums/UserType.enum.ts";
import Contact from "@/models/Contact.model.ts";
import User from "@/models/User.model.ts";
import userService from "@/services/UserService.ts";
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
  },
  Mutation: {},
};
