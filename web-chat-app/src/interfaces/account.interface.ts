export default interface IAccount {
  username: string;
  email?: string;
  isConfirmedEmail: boolean;

  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
  deletedAt?: Date;
}
