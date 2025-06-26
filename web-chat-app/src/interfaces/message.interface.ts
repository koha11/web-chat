import MessageStatus from "../enums/MessageStatus.enum";
import { IUser } from "./user.interface";

export interface IMessage {
  id: string;
  user: string | IUser;
  chat: string;
  msgBody: string;
  status: MessageStatus;
  seenList: { [userId: string]: string };
  replyForMsg?: IMessage | String;
  isHiddenFor?: string;
  unsentAt?: Date;
  editedAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
  deletedAt?: Date;
}
