import Chat from "@/models/Chat.model.js";
import { withFilter } from "graphql-subscriptions";
import MessageStatus from "../../enums/MessageStatus.enum.js";
import SocketEvent from "../../enums/SocketEvent.enum.js";
import { gemini_promp_process } from "../../gemini/index.js";
import Message from "../../models/Message.model.js";
import User from "../../models/User.model.js";
import chatService from "../../services/ChatService.js";
import messageService from "../../services/MessageService.js";
import { toObjectId } from "../../utils/mongoose.js";
import UserType from "@/enums/UserType.enum.js";
export const messageResolvers = {
    Query: {
        messages: async (_p, { chatId, msgId, after, first }, { user, pubsub }) => {
            const result = await messageService.getMessages({ chatId, first, after });
            const chat = await Chat.findById(chatId).populate("users");
            const isNotEmpty = result.edges.length > 0;
            const isNotSeenBefore = isNotEmpty &&
                chat?.lastMsgSeen?.get(user.id.toString()) !=
                    result.edges[0].node.id.toString();
            // update seenList cho tung msg
            const isUpdateSeenList = await messageService.updateSeenList({
                chatId,
                userId: user.id.toString(),
                lastSeenMsgId: chat.lastMsgSeen?.get(user.id.toString()) ?? "",
            });
            if (isNotSeenBefore) {
                chat?.lastMsgSeen.set(user.id.toString(), result.edges[0].cursor);
                await chat?.save({ timestamps: false });
            }
            if (isUpdateSeenList) {
                pubsub.publish(SocketEvent.chatChanged, {
                    chatChanged: chat,
                });
            }
            return result;
        },
        lastMessages: async (_p, {}, { user }) => {
            const chatIds = (await chatService.getChatList({ userId: user.id.toString() })).edges.map((edge) => edge.node.id.toString());
            const result = await messageService.getLastMessage(chatIds, user.id.toString());
            return result;
        },
    },
    Mutation: {
        postMessage: async (_p, { chatId, msgBody, user, replyForMsg, isForwarded }, { pubsub }) => {
            const createdMsg = await Message.create({
                chat: chatId,
                msgBody,
                user,
                replyForMsg,
                isForwarded,
            });
            const message = await createdMsg.populate("replyForMsg");
            const chatChanged = await Chat.findByIdAndUpdate(message.chat, { updatedAt: new Date() }, { new: true }).populate("users");
            const users = chatChanged?.users;
            const chatbot = users.find((user) => user.userType == UserType.CHATBOT);
            if (chatbot) {
                pubsub.publish(SocketEvent.messageTyping, {
                    chatId,
                    messageTyping: {
                        isTyping: true,
                        typingUser: chatbot,
                    },
                });
                setTimeout(async () => {
                    const chatBotMessageBody = await gemini_promp_process(msgBody, chatId, user);
                    const chatBotMessage = await Message.create({
                        chat: chatId,
                        user: chatbot.id,
                        msgBody: chatBotMessageBody,
                    });
                    pubsub.publish(SocketEvent.messageAdded, {
                        messageAdded: {
                            node: chatBotMessage,
                            cursor: chatBotMessage.id,
                        },
                        chatId,
                    });
                    pubsub.publish(SocketEvent.chatChanged, {
                        chatChanged,
                    });
                    pubsub.publish(SocketEvent.messageTyping, {
                        chatId,
                        messageTyping: {
                            isTyping: false,
                            typingUser: chatbot,
                        },
                    });
                }, 500);
                return message;
            }
            pubsub.publish(SocketEvent.messageAdded, {
                messageAdded: {
                    node: message,
                    cursor: message.id,
                },
                chatId,
            });
            pubsub.publish(SocketEvent.chatChanged, {
                chatChanged,
            });
            return message;
        },
        unsendMessage: async (_p, { chatId, msgId }, { pubsub, user }) => {
            const msg = await Message.findById(msgId).populate("replyForMsg");
            if (msg) {
                msg.status = MessageStatus.UNSEND;
                msg.unsentAt = new Date();
                msg.save();
                const lastMsgMap = await messageService.getLastMessage([chatId], user.id.toString());
                pubsub.publish(SocketEvent.messageChanged, {
                    messageChanged: {
                        cursor: msg.id,
                        node: msg,
                    },
                });
                if (lastMsgMap[chatId].id == msgId) {
                    const chatChanged = await Chat.findByIdAndUpdate(chatId, { updatedAt: new Date() }, { new: true }).populate("users");
                    pubsub.publish(SocketEvent.chatChanged, {
                        chatChanged,
                    });
                }
            }
            return msg;
        },
        removeMessage: async (_p, { chatId, msgId }, { user, pubsub }) => {
            const msg = await Message.findById(msgId).populate("replyForMsg");
            if (msg) {
                msg.isHiddenFor?.push(toObjectId(user.id));
                await msg.save();
                const lastMsgMap = await messageService.getLastMessage([chatId], user.id.toString());
                const lastMsg = lastMsgMap[chatId];
                const chatChanged = await Chat.findByIdAndUpdate(chatId, {
                    $set: {
                        updatedAt: lastMsg.status == MessageStatus.UNSEND
                            ? lastMsg.unsentAt
                            : lastMsg.createdAt,
                    },
                }, { timestamps: false });
                pubsub.publish(SocketEvent.chatChanged, {
                    chatChanged,
                });
            }
            return msg;
        },
        typeMessage: async (_p, { chatId, isTyping }, { pubsub, user }) => {
            const myUser = await User.findById(user.id);
            pubsub.publish(SocketEvent.messageTyping, {
                messageTyping: { typingUser: myUser, isTyping },
                chatId,
            });
        },
    },
    Subscription: {
        messageAdded: {
            subscribe: withFilter((_p, { chatId }, { pubsub }) => pubsub.asyncIterableIterator(SocketEvent.messageAdded), async ({ messageAdded, chatId }, { chatId: subChatId }, { user, pubsub }) => {
                const chat = await Chat.findById(chatId);
                const isUserInThisChat = (chat?.users).includes(toObjectId(user.id.toString()));
                const isNotSender = !messageAdded.node.user.equals(user.id);
                const isCorrectChat = chatId == subChatId;
                if (isUserInThisChat && isCorrectChat) {
                    // update seenList cho tung msg
                    await messageService.updateSeenList({
                        chatId,
                        userId: user.id.toString(),
                        lastSeenMsgId: chat.lastMsgSeen?.get(user.id.toString()) ?? "",
                    });
                    chat?.lastMsgSeen.set(user.id.toString(), messageAdded.cursor);
                    await chat?.save();
                    pubsub.publish(SocketEvent.chatChanged, {
                        chatChanged: chat,
                    });
                }
                return isNotSender && isUserInThisChat && isCorrectChat;
            }),
        },
        messageChanged: {
            subscribe: withFilter((_p, { chatId }, { pubsub }) => pubsub.asyncIterableIterator(SocketEvent.messageChanged), async (payload, { chatId }, { user }) => {
                const chat = await Chat.findById(chatId);
                const isUserInThisChat = (chat?.users).includes(toObjectId(user.id.toString()));
                const isNotSender = !payload.messageChanged.node.user.equals(user.id);
                return isNotSender && isUserInThisChat;
            }),
        },
        messageTyping: {
            subscribe: withFilter((_p, { chatId }, { pubsub }) => {
                return pubsub.asyncIterableIterator(SocketEvent.messageTyping);
            }, async ({ chatId, messageTyping }, { chatId: subChatId }, { user }) => {
                const chat = await Chat.findById(chatId);
                const isUserInThisChat = (chat?.users).includes(toObjectId(user.id.toString()));
                const isNotSender = messageTyping.typingUser.id != toObjectId(user.id);
                const isCorrectChat = chatId == subChatId;
                return isNotSender && isUserInThisChat && isCorrectChat;
            }),
        },
    },
};
