import Account from "models/Account.model.js";
import authService from "../../services/AuthService.js";
export const authResolvers = {
    Query: {
        account: async (_p, { userId }, {}) => {
            const account = await Account.findById(userId).lean();
            return account;
        },
    },
    Mutation: {
        login: async (_p, { username, password }, {}) => {
            const auth = await authService.login({ username, password });
            return auth;
        },
        register: async (_p, registerRequest, {}) => {
            const data = await authService.register(registerRequest);
            return data;
        },
        verifyEmail: async (_p, { email }, {}) => {
            const auth = await authService.sendVerifyMail(email);
            return auth;
        },
        changeEmail: async (_p, { email }, { user }) => {
            await authService.changeEmail({
                email,
                userId: user.id.toString(),
            });
            return email;
        },
    },
};
