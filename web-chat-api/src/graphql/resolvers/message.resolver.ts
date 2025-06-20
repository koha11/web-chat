import { Types } from "mongoose";
import Message from "../../models/Message.model";
import { toObjectId } from "../../utils/mongoose";

export const messageResolvers = {
  Query: {
    messages: async (
      _p: any,
      { msgId, after, first }: { msgId?: string; first: number; after: string }
    ) => {
      const filter = {} as any;

      if (after) {
        // decode cursor into ObjectId timestamp or full id
        filter._id = { $lt: toObjectId(after) };
      }

      const docs = await Message.find(filter)
        .populate("replyForMsg")
        .sort({ _id: -1 })
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
};
