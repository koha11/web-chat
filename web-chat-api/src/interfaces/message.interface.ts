import MessageStatus from "../enums/MessageStatus.enum.js";
import { Types } from "mongoose";
import { IChat } from "./chat.interface.js";
import { IUser } from "./user.interface.js";
import MessageType from "../enums/MessageType.enum.js";

// Interface for Message document
export interface IMessage {
  id: Types.ObjectId;
  user: IUser | Types.ObjectId;
  chat: IChat | Types.ObjectId;
  msgBody?: string;
  status: MessageStatus;
  type: MessageType;
  file?: {
    filename: string;
    type: string;
    url: string;
    size: number;
  };
  systemLog?: {
    type:
      | "chatname"
      | "nickname"
      | "avatar"
      | "add"
      | "leave"
      | "remove"
      | "create"
      | "appoint"
      | "reaction";
    targetUserId?: string;
    value?: string;
  };
  seenList: Map<string, string>;
  replyForMsg?: IMessage | Types.ObjectId;
  isHiddenFor?: Types.ObjectId[];
  unsentAt?: Date;
  editedAt?: Date;
  endedCallAt?: Date;
  isForwarded?: Boolean;
  reactions?: Map<string, { unified: string; reactTime: Date; emoji: string }>;

  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
  deletedAt?: Date;
}
