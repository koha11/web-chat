import { isObjectIdOrHexString, ObjectId, Types } from "mongoose";

export const toObjectId = (id: string | Types.ObjectId): Types.ObjectId => {
  try {
    if (isObjectIdOrHexString(id)) return id as Types.ObjectId;
    else return new Types.ObjectId(id);
  } catch (e) {
    throw e;
  }
};
