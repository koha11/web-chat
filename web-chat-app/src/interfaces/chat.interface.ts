import { IMessage } from "./message.interface";
import { IUser } from "./user.interface";

export interface IChat extends Document {
  users: IUser[] | string;
  messages: IMessage[] | string;
  nicknames: { [id: string]: string }[];
  chatName: string;
  chatAvatar: string;

  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
  deletedAt?: Date;
}
