import ContactRelationship from "../enums/ContactRelationship.enum.js";
import { Types } from "mongoose";
import { IUser } from "./user.interface.js";

export default interface IContact {
  id: Types.ObjectId;
  users: Types.ObjectId[] | IUser[];
  chatId: Types.ObjectId;
  relationships: Map<String, ContactRelationship>;

  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
  deletedAt?: Date;
}
