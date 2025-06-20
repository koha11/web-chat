import User from "../../models/User.model";

export const userResolvers = {
  Query: {
    users: async (_p: any, { userId }: { userId?: string }) => {
      const data = await User.find();

      return data;
    },
  },
  Mutation: {},
};
