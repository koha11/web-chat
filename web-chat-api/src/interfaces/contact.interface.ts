import ContactRelationship from "@/enums/ContactRelationship.enum.ts";
import { Types } from "mongoose";
import { IUser } from "./user.interface.ts";

export default interface IContact {
  id: Types.ObjectId;
  users: Types.ObjectId[] | IUser[];
  chatId: Types.ObjectId;
  relationship: ContactRelationship;

  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
  deletedAt?: Date;
}
