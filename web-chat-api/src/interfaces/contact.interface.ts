import { Types } from "mongoose";
import ContactRelationship from "../enums/ContactRelationship.enum";
import { IUser } from "./user.interface";

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
