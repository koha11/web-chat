import ContactRelationship from "../enums/ContactRelationship.enum.js";
import UserType from "../enums/UserType.enum.js";
import IModelConnection from "../interfaces/modelConnection.interface.js";
import { IUser } from "../interfaces/user.interface.js";
import Chat from "../models/Chat.model.js";
import Contact from "../models/Contact.model.js";
import User from "../models/User.model.js";
import { toObjectId } from "../utils/mongoose.js";
import { Types } from "mongoose";

class UserService {
  getConnectableUsers = async ({
    userId,
    first = 10,
    after,
  }: {
    userId: string;
    sort?: any;
    first?: number;
    after?: string;
  }): Promise<IModelConnection<IUser>> => {
    const filter = {
      _id: { $ne: toObjectId(userId) },
      userType: { $ne: UserType.CHATBOT },
    } as any;

    if (after) {
      // decode cursor into ObjectId timestamp or full id
      filter._id = { $lt: toObjectId(after) };
    }

    const users = await User.find(filter).sort({ _id: -1 });

    const userContacts = await Contact.find({
      [`relationships.${userId}`]: { $ne: ContactRelationship.stranger },
    }).populate("users");

    const connectedUserIds = userContacts.map(
      (userContact) =>
        userContact.users.filter((user) => user.id.toString() != userId)[0].id
    );

    const docs = users
      .filter((user) => !connectedUserIds.includes(user.id))
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

  getUsersByRelationship = async ({
    relationship,
    userId,
    first = 10,
    after,
  }: {
    userId: string;
    relationship: ContactRelationship;
    first?: number;
    after?: string;
  }): Promise<IModelConnection<IUser>> => {
    const filter = {
      [`relationships.${userId}`]: { $eq: relationship },
    } as any;

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
        user: (userContact.users as IUser[]).filter(
          (user) => user.id.toString() != userId
        )[0],
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

  createNewUser = async ({
    fullname,
    _id,
    username,
    ggid,
  }: {
    _id?: Types.ObjectId;
    username: string;
    fullname: string;
    ggid?: string;
  }) => {
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

  async setOnlineStatus(userId: string) {
    await User.findByIdAndUpdate(userId, {
      isOnline: true,
    });
  }

  async setOfflineStatus(userId: string) {
    await User.findByIdAndUpdate(userId, {
      isOnline: false,
      lastLogined: new Date().toISOString(),
    });
  }
}

const userService = new UserService();

export default userService;
