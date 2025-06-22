import { PubSub } from "graphql-subscriptions";
import Chat from "../../models/Chat.model";
import { toObjectId } from "../../utils/mongoose";
import { IResolvers } from "@graphql-tools/utils";
import Message from "../../models/Message.model";
import messageService from "../../services/MessageService";
export const chatResolvers: IResolvers = {
  Query: {
    chats: async (
      _p: any,
      { userId, chatId, first, after },
      { pubsub }: { pubsub: PubSub }
    ) => {
      const filter = { users: userId } as { _id: any; users: any };

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
          startCursor: edges[0].cursor,
          hasNextPage,
          endCursor: edges.length ? edges[edges.length - 1].cursor : null,
        },
      };
    },
  },
  Mutation: {},
  Subscription: {},
};
