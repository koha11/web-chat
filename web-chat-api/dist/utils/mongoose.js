import { isObjectIdOrHexString, Types } from "mongoose";
export const toObjectId = (id) => {
    try {
        if (isObjectIdOrHexString(id))
            return id;
        else
            return new Types.ObjectId(id);
    }
    catch (e) {
        throw e;
    }
};
