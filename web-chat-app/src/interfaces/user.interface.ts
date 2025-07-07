import UserType from "../enums/UserType.enum";

export interface IUser {
  id: string;
  username: string;
  fullname: string;
  avatar?: string;
  isOnline: boolean;
  lastLogined?: string;
  userType: UserType;

  deleted?: boolean;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
