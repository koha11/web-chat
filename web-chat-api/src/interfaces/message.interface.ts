import { Types } from "mongoose";
import MessageStatus from "../enums/MessageStatus.enum";
import { IUser } from "../models/User.model";

// Interface for Message document
export interface IMessage extends Document {
  user: IUser | Types.ObjectId;
  msgBody: string;
  status: MessageStatus;
  seenList: Map<string, string>;
  replyForMsg?: IMessage | Types.ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
  deletedAt?: Date;
}