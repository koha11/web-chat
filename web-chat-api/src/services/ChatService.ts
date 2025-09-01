import { Types } from "mongoose";
import { IChat, IChatUsersInfo } from "../interfaces/chat.interface.js";
import IModelConnection from "../interfaces/modelConnection.interface.js";
import Chat from "../models/Chat.model.js";
import Contact from "../models/Contact.model.js";
import User from "../models/User.model.js";
import { toObjectId } from "../utils/mongoose.js";

class ChatService {
  getChatList = async ({
    userId,
    first = 10,
    after,
    chatName,
  }: {
    userId: string;
    sort?: any;
    first?: number;
    after?: string;
    chatName?: string;
  }): Promise<IModelConnection<IChat>> => {
    const filter = { users: userId } as any;

    if (after) {
      filter._id = { $lt: toObjectId(after) };
    }

    if (chatName && chatName.trim()) {
      const escapeRegExp = (s: string) =>
        s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const rx = new RegExp(escapeRegExp(chatName), "i");

      // 1) find user ids whose displayName matches
      const matchedUserIds: Types.ObjectId[] = await User.find(
        { fullname: rx }, // change to your field: name/username/displayName
        { _id: 1 }
      )
        .lean()
        .then((rows) =>
          rows
            .filter((row) => !row._id.equals(toObjectId(userId)))
            .map((r) => r._id as Types.ObjectId)
        );

      // 2) fallback logic
      filter.$or = [
        // chatName is non-empty -> match by chatName
        { $and: [{ chatName: { $ne: "" } }, { chatName: rx }] },

        // chatName is empty -> match by any participant name
        { $and: [{ chatName: "" }, { users: { $in: matchedUserIds } }] },
      ];
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

  createChat = async (users: string[], addBy?: string) => {
    // init usersInfo
    const usersInfo = new Map<string, IChatUsersInfo>();

    for (let userId of users) {
      const user = await User.findById(userId);

      if (!user) throw new Error(`Ko ton tai user voi id = ${userId}`);

      if (users.length == 2)
        usersInfo.set(userId, {
          nickname: user.fullname,
          avatar: user.avatar,
          fullname: user.fullname,
        });
      else
        usersInfo.set(userId, {
          addBy: userId == addBy! ? "" : addBy!,
          joinAt: new Date(),
          nickname: user.fullname,
          role: userId == addBy ? "CREATOR" : "MEMBER",
          avatar: user.avatar,
          fullname: user.fullname,
        });
    }

    const chat = await Chat.create({
      users,
      usersInfo,
      chatType: users.length == 2 ? "PRIVATE" : "GROUP",
    });

    if (users.length == 2)
      await Contact.findOneAndUpdate({ users }, { chatId: chat.id });

    return chat;
  };
}

const chatService = new ChatService();

export default chatService;
