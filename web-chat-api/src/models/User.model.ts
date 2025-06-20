import mongoose, { Document, Schema, Model, Types } from "mongoose";
import mongooseDelete, {
  SoftDeleteDocument,
  SoftDeleteModel,
} from "mongoose-delete";
import { IUser } from "../interfaces/user.interface";

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
const User = mongoose.model<IUser>("User", UserSchema);

export default User;
