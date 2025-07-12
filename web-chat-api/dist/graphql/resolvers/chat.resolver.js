import SocketEvent from "../../enums/SocketEvent.enum.js";
import chatService from "../../services/ChatService.js";
import { toObjectId } from "../../utils/mongoose.js";
import { withFilter } from "graphql-subscriptions";
import Chat from "../../models/Chat.model.js";
import User from "../../models/User.model.js";
export const chatResolvers = {
    Query: {
        chats: async (_p, { first, after }, { user }) => {
            const result = await chatService.getChatList({
                userId: user.id.toString(),
                after,
                first,
            });
            return result;
        },
        chat: async (_p, { chatId }, {}) => {
            const chat = await Chat.findById(chatId).populate("users");
            return chat;
        },
    },
    Mutation: {
        postChat: async (_p, { users }, { user }) => {
            const result = await chatService.createChat(users);
            return result;
        },
        changeNickname: async (_p, { chatId, changedUserId, nickname }, { user, pubsub }) => {
            const chat = await Chat.findById(chatId).populate("users");
            chat?.nicknames.set(changedUserId, nickname);
            chat?.save();
            pubsub.publish(SocketEvent.chatChanged, {
                chatChanged: chat,
            });
            return chat;
        },
        makeCall: async (_p, { chatId, hasVideo }, { pubsub, user }) => {
            const myUser = await User.findById(user.id);
            pubsub.publish(SocketEvent.ongoingCall, {
                ongoingCall: {
                    user: myUser,
                    hasVideo,
                    chatId,
                },
            });
            return true;
        },
        handleCall: async (_p, { chatId, isAccepted }, { pubsub, user }) => {
            pubsub.publish(SocketEvent.responseCall, {
                responseCall: isAccepted,
                userId: user.id,
            });
            return isAccepted;
        },
        hangupCall: async (_p, { chatId }, { pubsub, user }) => {
            pubsub.publish(SocketEvent.responseCall, {
                responseCall: false,
                userId: user.id,
                chatId,
            });
            return false;
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
        ongoingCall: {
            subscribe: withFilter((_p, variables, { pubsub }) => pubsub.asyncIterableIterator(SocketEvent.ongoingCall), async ({ ongoingCall }, variables, { user }) => {
                const chat = await Chat.findById(ongoingCall.chatId).populate("users");
                const isNotSender = ongoingCall.user.id != toObjectId(user.id);
                const isUserInThisChat = chat.users
                    .map((user) => user.id)
                    .includes(toObjectId(user.id.toString()));
                return isUserInThisChat && isNotSender;
            }),
        },
        responseCall: {
            subscribe: withFilter((_p, variables, { pubsub }) => pubsub.asyncIterableIterator(SocketEvent.responseCall), async ({ responseCall, chatId, userId, }, variables, { user }) => {
                const chat = await Chat.findById(chatId).populate("users");
                const isNotSender = userId != user.id;
                const isUserInThisChat = chat.users
                    .map((user) => user.id)
                    .includes(toObjectId(user.id.toString()));
                return isUserInThisChat && isNotSender;
            }),
        },
    },
};
