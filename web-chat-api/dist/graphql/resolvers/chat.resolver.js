import { withFilter } from "graphql-subscriptions";
import { toObjectId } from "../../utils/mongoose";
import chatService from "../../services/ChatService";
import SocketEvent from "../../enums/SocketEvent.enum";
export const chatResolvers = {
    Query: {
        chats: async (_p, { chatId, first, after }, { user }) => {
            const result = await chatService.getChatList({
                userId: user.id.toString(),
                after,
                first,
            });
            return result;
        },
    },
    Mutation: {
        postChat: async (_p, { users }, { user }) => {
            const result = await chatService.createChat(users);
            return result;
        },
    },
    Subscription: {
        chatChanged: {
            subscribe: withFilter((_p, { userId }, { pubsub }) => pubsub.asyncIterableIterator(SocketEvent.chatChanged), async ({ chatChanged }, variables, { user }) => {
                const isUserInThisChat = chatChanged?.users
                    .map((user) => user.id)
                    .includes(toObjectId(user.id.toString()));
                return isUserInThisChat;
            }),
        },
    },
};
