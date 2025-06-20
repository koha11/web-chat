import { Types } from "mongoose";
import { IMessage } from "./message.interface";
import { IUser } from "./user.interface";

// Interface for Chat document
export interface IChat extends Document {
  users: IUser[] | Types.ObjectId[];
  messages: IMessage[] | Types.ObjectId[];
  nicknames: { [id: string]: string };
  chatName: string;
  chatAvatar: string;

  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
  deletedAt?: Date;
}
