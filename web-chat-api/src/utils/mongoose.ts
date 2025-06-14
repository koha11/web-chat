import { ObjectId, Types } from "mongoose";

export const toObjectId = (id: string): Types.ObjectId => {
  try {
    return new Types.ObjectId(id);
  } catch (e) {
    throw e;
  }
};
