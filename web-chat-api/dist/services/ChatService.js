import Chat from "@/models/Chat.model.js";
import Contact from "@/models/Contact.model.js";
import User from "@/models/User.model.js";
import { toObjectId } from "@/utils/mongoose.js";
class ChatService {
    constructor() {
        this.getChatList = async ({ userId, first = 10, after, }) => {
            const filter = { users: userId };
            if (after) {
                filter._id = { $lt: toObjectId(after) };
            }
            const docs = await Chat.find(filter)
                .populate("users")
                .sort({ updatedAt: -1 })
                .limit(first + 1);
            const hasNextPage = docs.length > first;
            const sliced = hasNextPage ? docs.slice(0, first) : docs;
            const edges = sliced.map((doc) => ({
                cursor: doc._id.toString(),
                node: doc,
            }));
            return {
                edges,
                pageInfo: {
                    startCursor: edges.length ? edges[0].cursor : null,
                    hasNextPage,
                    endCursor: edges.length ? edges[edges.length - 1].cursor : null,
                },
            };
        };
        this.createChat = async (users) => {
            const nicknames = new Map();
            for (let userId of users) {
                const user = await User.findById(userId);
                if (user)
                    nicknames.set(userId, user.fullname);
            }
            const chat = await Chat.create({ users, nicknames });
            if (users.length == 2)
                await Contact.findOneAndUpdate({ users }, { chatId: chat.id });
            return chat;
        };
    }
}
const chatService = new ChatService();
export default chatService;
