import { IAccount } from "interfaces/account.interface.js";
import mongoose, { Schema } from "mongoose";
import mongooseDelete from "mongoose-delete";

// Define schema
const AccountSchema = new Schema<IAccount>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, unique: true },
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
const Account = mongoose.model<IAccount>("Account", AccountSchema);
export default Account;
