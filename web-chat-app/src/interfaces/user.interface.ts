export interface IUser {
  username: string;
  fullname: string;
  avatar?: string;
  isOnline: boolean;
  lastLogined?: string;

  deleted?: boolean;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
