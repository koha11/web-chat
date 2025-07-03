import MessageStatus from "@/enums/MessageStatus.enum.ts";
import { Types } from "mongoose";
import { IChat } from "./chat.interface.ts";
import { IUser } from "./user.interface.ts";


// Interface for Message document
export interface IMessage {
  id: Types.ObjectId;
  user: IUser | Types.ObjectId;
  chat: IChat | Types.ObjectId;
  msgBody: string;
  status: MessageStatus;
  seenList: Map<string, string>;
  replyForMsg?: IMessage | Types.ObjectId;
  isHiddenFor?: Types.ObjectId[];
  unsentAt?: Date
  editedAt?: Date
  isForwarded?: Boolean

  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
  deletedAt?: Date;
}
