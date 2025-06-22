import { Types } from "mongoose";

// Interface for User document
export interface IUser {
  id: Types.ObjectId;
  username: string;
  fullname: string;
  avatar?: string;
  isOnline: boolean;
  lastLogined?: string;

  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
  deletedAt?: Date;
}
