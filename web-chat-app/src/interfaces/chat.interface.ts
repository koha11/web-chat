import { IMessage } from "./message.interface";
import { IUser } from "./user.interface";

export interface IChat extends Document {
  users: (string | IUser)[];
  messages: (string | IMessage)[];
  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
  deletedAt?: Date;
}