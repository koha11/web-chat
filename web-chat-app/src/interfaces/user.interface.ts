export interface IUser {
  username: string;
  password: string;
  fullname: string;
  email: string;
  isOnline?: boolean;
  lastLogined?: string;
  isActive?: boolean;
  deleted?: boolean;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
