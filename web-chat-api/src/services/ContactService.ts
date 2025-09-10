import ContactRelationship from "../enums/ContactRelationship.enum.js";
import IContact from "../interfaces/contact.interface.js";
import IModelConnection from "../interfaces/modelConnection.interface.js";
import Contact from "../models/Contact.model.js";
import User from "../models/User.model.js";
import { toObjectId } from "../utils/mongoose.js";
import userService from "./UserService.js";

class ContactService {
  getContacts = async ({
    userId,
    first = 10,
    after,
    search,
  }: {
    userId: string;
    sort?: any;
    first?: number;
    after?: string;
    search?: string;
  }): Promise<IModelConnection<IContact>> => {
    const filter: any = {
      [`relationships.${userId}`]: { $eq: ContactRelationship.connected },
    };
    if (after) filter._id = { $lt: toObjectId(after) };

    if (search) {
      filter.users = {
        $in: await userService.getUsersBySearch({ userId, search }),
      };
    }

    const docs = await Contact.find(filter)
      .populate("users")
      .sort({ createdAt: -1, _id: -1 })
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
}

const contactService = new ContactService();

export default contactService;
