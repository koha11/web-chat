import UserType from "@/enums/UserType.enum.ts";
import { Types } from "mongoose";

// Interface for User document
export interface IUser {
  id: Types.ObjectId;
  ggid: string;
  username: string;
  fullname: string;
  avatar?: string;
  isOnline: boolean;
  lastLogined?: string;
  userType: UserType

  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
  deletedAt?: Date;
}
