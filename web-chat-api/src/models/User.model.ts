import mongoose, { Document, Schema, Model, Types } from "mongoose";
import mongooseDelete, {
  SoftDeleteDocument,
  SoftDeleteModel,
} from "mongoose-delete";

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

// Define schema
const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    fullname: { type: String, required: true },
    avatar: { type: String, default: "" },
    isOnline: { type: Boolean, default: false },
    lastLogined: { type: String, default: new Date().toISOString() },
  },
  { timestamps: true }
);

// Add soft delete plugin
UserSchema.plugin(mongooseDelete, {
  overrideMethods: "all",
  deletedAt: true,
});

// Export model
const User: SoftDeleteModel<IUser> = mongoose.model<
  IUser,
  SoftDeleteModel<IUser>
>("User", UserSchema);
export default User;
