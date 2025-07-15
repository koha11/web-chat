// Interface for User document
export interface IAccount extends Document {
  username: string;
  password: string;
  email: string;
  isConfirmedEmail: boolean;

  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
  deletedAt?: Date;
}