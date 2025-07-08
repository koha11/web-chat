import UserType from "@/enums/UserType.enum.ts";
import Contact from "@/models/Contact.model.ts";
import User from "@/models/User.model.ts";
import { IResolvers } from "@graphql-tools/utils";

export const userResolvers: IResolvers = {
  Query: {
    users: async (_p: any, { userId }) => {
      const data = await User.find();

      return data;
    },
    connectableUsers: async (_p: any, { userId }) => {
      const users = await User.find({
        id: { $ne: userId },
        userType: { $ne: UserType.CHATBOT },
      });

      const userContacts = await Contact.find({ users: userId }).populate(
        "users"
      );

      const connectedUsers = userContacts.map(
        (userContact) =>
          userContact.users.filter((user) => user.id != userId)[0].id
      );

      return users.filter((user) => !connectedUsers.includes(user.id));
    },
  },
  Mutation: {},
};
