import ContactRelationship from "../enums/ContactRelationship.enum.js";
import UserType from "../enums/UserType.enum.js";
import Chat from "../models/Chat.model.js";
import Contact from "../models/Contact.model.js";
import User from "../models/User.model.js";
import { toObjectId } from "../utils/mongoose.js";
class UserService {
    constructor() {
        this.getConnectableUsers = async ({ userId, first = 10, after, }) => {
            const filter = {
                _id: { $ne: toObjectId(userId) },
                userType: { $ne: UserType.CHATBOT },
            };
            if (after) {
                // decode cursor into ObjectId timestamp or full id
                filter._id = { $lt: toObjectId(after) };
            }
            const users = await User.find(filter).sort({ _id: -1 });
            const userContacts = await Contact.find({
                [`relationships.${userId}`]: { $ne: ContactRelationship.connected },
            }).populate("users");
            const connectedUsers = userContacts.map((userContact) => userContact.users.filter((user) => user.id.toString() != userId)[0].id);
            const docs = users
                .filter((user) => !connectedUsers.includes(user.id))
                .slice(0, first + 1);
            const hasNextPage = docs.length > first;
            const sliced = hasNextPage ? docs.slice(0, first) : docs;
            const edges = sliced.map((doc) => ({
                cursor: doc.id,
                node: doc,
            }));
            const isNotEmpty = edges.length > 0;
            return {
                edges,
                pageInfo: {
                    startCursor: isNotEmpty ? edges[0].cursor : null,
                    hasNextPage,
                    endCursor: isNotEmpty ? edges[edges.length - 1].cursor : null,
                },
            };
        };
        this.getUsersByRelationship = async ({ relationship, userId, first = 10, after, }) => {
            const filter = {
                [`relationships.${userId}`]: { $eq: relationship },
            };
            if (after) {
                // decode cursor into ObjectId timestamp or full id
                filter._id = { $lt: toObjectId(after) };
            }
            const userContacts = await Contact.find(filter)
                .sort({ _id: -1 })
                .limit(first + 1)
                .populate("users");
            const docs = userContacts.map((userContact) => {
                return {
                    user: userContact.users.filter((user) => user.id.toString() != userId)[0],
                    contactId: userContact.id,
                };
            });
            const hasNextPage = docs.length > first;
            const sliced = hasNextPage ? docs.slice(0, first) : docs;
            const edges = sliced.map((doc) => ({
                cursor: doc.contactId,
                node: doc.user,
            }));
            const isNotEmpty = edges.length > 0;
            return {
                edges,
                pageInfo: {
                    startCursor: isNotEmpty ? edges[0].cursor : null,
                    hasNextPage,
                    endCursor: isNotEmpty ? edges[edges.length - 1].cursor : null,
                },
            };
        };
        this.createNewUser = async ({ fullname, _id, username, ggid, }) => {
            let user;
            // Tao User moi
            if (_id)
                user = await User.create({
                    _id,
                    username,
                    fullname,
                    lastLogined: new Date().toISOString(),
                });
            else
                user = await User.create({
                    ggid,
                    username,
                    fullname,
                    lastLogined: new Date().toISOString(),
                });
            // Tao chat voi gemini api
            const chatbot = await User.findOne({ userType: UserType.CHATBOT });
            const chat = await Chat.create({
                users: [user.id, chatbot?.id],
                nicknames: {
                    [user.id]: user.fullname,
                    [chatbot?.id]: chatbot?.fullname,
                },
            });
            return user;
        };
    }
    async setOnlineStatus(userId) {
        await User.findByIdAndUpdate(userId, {
            isOnline: true,
        });
    }
    async setOfflineStatus(userId) {
        await User.findByIdAndUpdate(userId, {
            isOnline: false,
            lastLogined: new Date().toISOString(),
        });
    }
}
const userService = new UserService();
export default userService;
