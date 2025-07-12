import mongoose, { Schema } from "mongoose";
import mongooseDelete from "mongoose-delete";
// Define schema
const UserSchema = new Schema({
    username: { type: String, required: true },
    fullname: { type: String, required: true },
    avatar: { type: String, default: "" },
    isOnline: { type: Boolean, default: false },
    lastLogined: { type: String, default: new Date().toISOString() },
}, { timestamps: true });
// Add soft delete plugin
UserSchema.plugin(mongooseDelete, {
    overrideMethods: "all",
    deletedAt: true,
});
// Export model
const User = mongoose.model("User", UserSchema);
export default User;
