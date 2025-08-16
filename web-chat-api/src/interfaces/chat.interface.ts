import { Types } from "mongoose";
import { IUser } from "./user.interface.js";

// Interface for Chat document
export interface IChat {
  id: Types.ObjectId;
  users: IUser[] | Types.ObjectId[];
  usersInfo: Map<
    string,
    {
      nickname: string;
      addBy?: string;
      role?: "CREATOR" | "MEMBER" | "LEADER";
      joinAt?: Date;
    }
  >; // [userId]: Object -> lay ra dc nickname, role trong doan chat
  chatName: string;
  chatType: "GROUP" | "PRIVATE";
  chatAvatar: string;
  lastMsgSeen: Map<string, string>; //[userId]: msgId -> dung de duyet seen tin nhan nhanh hon

  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
  deletedAt?: Date;
}
