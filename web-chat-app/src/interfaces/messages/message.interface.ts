import MessageType from "@/enums/MessageType.enum";
import MessageStatus from "../../enums/MessageStatus.enum";
import { IUser } from "../user.interface";

export interface IMessage {
  id: string;
  user: string | IUser;
  chat: string;
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
      | "appoint";
    targetUserId?: string;
    value?: string;
  };
  seenList: { [userId: string]: string }; // userId: seen date
  replyForMsg?: IMessage | String;
  isHiddenFor?: string;
  unsentAt?: Date;
  editedAt?: Date;
  endedCallAt?: Date;
  isForwarded?: boolean;
  reactions?: {
    [userId: string]: { unified: string; reactTime: Date; emoji: string };
  };

  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
  deletedAt?: Date;
}
