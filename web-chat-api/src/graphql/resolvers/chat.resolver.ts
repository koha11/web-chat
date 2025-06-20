import mongoose from "mongoose";
import Chat from "../../models/Chat.model";
import { toObjectId } from "../../utils/mongoose";

export const chatResolvers = {
  Query: {
    chats: async (
      _p: any,
      { chatId, first, after }: { chatId: string; first: number; after: string }
    ) => {
      const data = await Chat.find({
        _id: { $lt: toObjectId(after) },
      })
        .populate("users")
        .sort({ updatedAt: -1 })
        .limit(first);

      console.log(data);

      return data;
    },
  },
  Mutation: {},
};
