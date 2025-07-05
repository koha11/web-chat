import { Types } from "mongoose";
import { IUser } from "./user.interface.ts";


// Interface for Chat document
export interface IChat {
  id: Types.ObjectId;
  users: IUser[] | Types.ObjectId[];
  nicknames: Map<String, String>;
  chatName: string;
  chatAvatar: string;
  lastMsgSeen: Map<string, string>; //[userId]: msgId -> dung de duyet seen tin nhan nhanh hon

  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
  deletedAt?: Date;
}
