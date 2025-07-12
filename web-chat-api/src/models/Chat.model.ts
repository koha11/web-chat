import { IChat } from "../interfaces/chat.interface.js";
import mongoose, { Document, Schema, Model, Types } from "mongoose";
import mongooseDelete, {
  SoftDeleteDocument,
  SoftDeleteModel,
} from "mongoose-delete";

// Schema definition
const ChatSchema = new Schema<IChat>(
  {
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    nicknames: { type: Map, of: String, default: {} },
    chatName: { type: String, default: "" },
    chatAvatar: { type: String, default: "" },
    lastMsgSeen: { type: Map, of: String, default: {} },
  },
  { timestamps: true }
);

// Add soft delete plugin
ChatSchema.plugin(mongooseDelete, {
  overrideMethods: "all",
  deletedAt: true,
});

// Export model
const Chat = mongoose.model<IChat>("Chat", ChatSchema);

export default Chat;
