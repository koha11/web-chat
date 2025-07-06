import Account from "@/models/Account.model.ts";
import User from "@/models/User.model.ts";
import authService from "@/services/AuthService.ts";
import { IResolvers } from "@graphql-tools/utils";
import bcrypt from "bcryptjs";

export const authResolvers: IResolvers = {
  Query: {},
  Mutation: {
    login: async (_p, { username, password }, {}) => {
      const account = await Account.findOne({ username });

      if (!account)
        return {
          isValid: false,
          message: "Username is wrong",
        };

      var passwordIsValid = bcrypt.compareSync(password, account.password);

      if (!passwordIsValid)
        return {
          isValid: false,
          message: "Password is wrong",
        };

      const user = await User.findOne({ username });

      if (!user)
        return {
          isValid: false,
          message: "sai id roi",
        };

      const token = authService.createToken({
        expiresIn: "24h",
        id: user.id,
        username: user.username,
      });

      return {
        isValid: true,
        data: {
          accessToken: token,
          userId: user.id,
        },
        message: "login success",
      };
    },
  },
};
