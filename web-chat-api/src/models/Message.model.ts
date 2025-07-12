import MessageStatus from "../enums/MessageStatus.enum.js";
import { IMessage } from "../interfaces/message.interface.js";
import mongoose, { Schema } from "mongoose";

// Define schema
const MessageSchema = new Schema<IMessage>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    chat: { type: Schema.Types.ObjectId, ref: "Chat" },
    msgBody: { type: String, required: true },
    status: { type: String, required: true, default: MessageStatus.SENT },
    seenList: { type: Map, of: String, default: {} },
    replyForMsg: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    isHiddenFor: [{ type: Schema.Types.ObjectId, ref: "User" }],
    editedAt: { type: Date },
    unsentAt: { type: Date },
    isForwarded: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Add soft delete plugin

// Export model
const Message = mongoose.model<IMessage>("Message", MessageSchema);
export default Message;
