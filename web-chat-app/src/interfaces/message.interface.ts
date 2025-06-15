import MessageStatus from "../enums/MessageStatus.enum";
import { IUser } from "./user.interface";

export interface IMessage {
  _id: string;
  user: string | IUser;
  msgBody: string;
  status: MessageStatus;

  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
  deletedAt?: Date;
}
