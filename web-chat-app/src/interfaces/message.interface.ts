import { IUser } from "./user.interface";

export interface IMessage extends Document {
  user: string | IUser;
  msgBody: string;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
  deletedAt?: Date;
}