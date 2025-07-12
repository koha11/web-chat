import ContactRelationship from "../enums/ContactRelationship.enum";
import { IUser } from "./user.interface";

export default interface IContact {
  id: string;
  users: IUser[];
  relationships: { [userId: string]: ContactRelationship };
  chatId?: string;

  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
  deletedAt?: Date;
}
