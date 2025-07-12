import mongoose, { Schema } from "mongoose";
import mongooseDelete from "mongoose-delete";
// Schema definition
const ChatSchema = new Schema({
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    nicknames: { type: Map, of: String },
    chatName: { type: String, default: "" },
    chatAvatar: { type: String, default: "" },
    lastMsgSeen: { type: Map, of: String },
}, { timestamps: true });
// Add soft delete plugin
ChatSchema.plugin(mongooseDelete, {
    overrideMethods: "all",
    deletedAt: true,
});
// Export model
const Chat = mongoose.model("Chat", ChatSchema);
export default Chat;
