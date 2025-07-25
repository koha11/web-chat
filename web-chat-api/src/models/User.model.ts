import UserType from "../enums/UserType.enum.js";
import { IUser } from "../interfaces/user.interface.js";
import mongoose, { Document, Schema, Model, Types } from "mongoose";
import mongooseDelete from "mongoose-delete";

// Define schema
const UserSchema = new Schema<IUser>(
  {
    ggid: { type: String, unique: true },
    username: { type: String, required: true },
    fullname: { type: String, required: true },
    avatar: { type: String, default: "" },    
    isOnline: { type: Boolean, default: false },
    lastLogined: { type: String, default: new Date().toISOString() },
    userType: { type: String, default: UserType.USER },
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
