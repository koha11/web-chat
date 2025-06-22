import MessageStatus from "../enums/MessageStatus.enum";
import { IUser } from "./user.interface";

export interface IMessage {
  id: string;
  user: string | IUser; 
  msgBody: string;
  status: MessageStatus;
  seenList: { [userId: string]: string };
  replyForMsg?: IMessage | String;

  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
  deletedAt?: Date;
}
