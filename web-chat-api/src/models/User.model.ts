import mongoose, { Document, Schema, Model } from "mongoose";
import mongooseDelete, {
  SoftDeleteDocument,
  SoftDeleteModel,
} from "mongoose-delete";

// Interface for User document
export interface IUser extends Document {
  username: string;
  password: string;
  fullname: string;
  email: string;
  isConfirmedEmail: boolean;
  avatar?: string;
  isOnline: boolean;
  lastLogined?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
  deletedAt?: Date;
}

// Define schema
const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String, default: "" },
    isConfirmedEmail: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    lastLogined: { type: String, default: new Date().toISOString() },
    isActive: { type: Boolean, default: false },
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
