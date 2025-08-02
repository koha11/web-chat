import MessageType from "../enums/MessageType.enum.js";
import MessageStatus from "../enums/MessageStatus.enum.js";
import { IMessage } from "../interfaces/message.interface.js";
import mongoose, { Schema } from "mongoose";

// Define schema
const MessageSchema = new Schema<IMessage>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    chat: { type: Schema.Types.ObjectId, ref: "Chat" },
    msgBody: { type: String },
    status: { type: String, required: true, default: MessageStatus.SENT },
    seenList: { type: Map, of: String, default: {} },
    replyForMsg: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    isHiddenFor: [{ type: Schema.Types.ObjectId, ref: "User" }],
    type: { type: String, required: true, default: MessageType.TEXT },
    file: {
      filename: { type: String },
      url: { type: String },
      size: { type: Number },
      type: { type: String },
    },
    editedAt: { type: Date },
    endedCallAt: { type: Date },
    unsentAt: { type: Date },
    isForwarded: { type: Boolean, default: false },
    reactions: { type: Map, of: Object },
  },
  { timestamps: true }
);

// Add soft delete plugin

// Export model
const Message = mongoose.model<IMessage>("Message", MessageSchema);
export default Message;
