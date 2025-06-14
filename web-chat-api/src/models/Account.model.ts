import mongoose, { Document, Schema, Model } from "mongoose";
import mongooseDelete, {
  SoftDeleteDocument,
  SoftDeleteModel,
} from "mongoose-delete";

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

// Define schema
const AccountSchema = new Schema<IAccount>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isConfirmedEmail: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Add soft delete plugin
AccountSchema.plugin(mongooseDelete, {
  overrideMethods: "all",
  deletedAt: true,
});

// Export model
const Account: SoftDeleteModel<IAccount> = mongoose.model<
  IAccount,
  SoftDeleteModel<IAccount>
>("Account", AccountSchema);
export default Account;
