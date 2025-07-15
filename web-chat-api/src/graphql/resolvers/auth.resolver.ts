import authService from "../../services/AuthService.js";
import { IResolvers } from "@graphql-tools/utils";

export const authResolvers: IResolvers = {
  Query: {},
  Mutation: {
    login: async (_p, { username, password }, {}) => {
      const auth = await authService.login({ username, password });

      return auth;
    },
    register: async (_p, registerRequest, {}) => {
      const data = await authService.register(registerRequest);

      return data;
    },
  },
};
