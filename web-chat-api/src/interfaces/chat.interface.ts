import { Types } from "mongoose";
import { IMessage } from "./message.interface";
import { IUser } from "./user.interface";

// Interface for Chat document
export interface IChat {
  id: Types.ObjectId;
  users: IUser[] | Types.ObjectId[];
  nicknames: { [id: string]: string };
  chatName: string;
  chatAvatar: string;
  lastMsgSeen: Map<string, string>;

  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
  deletedAt?: Date;
}
