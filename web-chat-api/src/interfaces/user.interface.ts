// Interface for User document
export interface IUser extends Document {
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