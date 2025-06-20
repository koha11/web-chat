import mongoose, { Document, Schema, Types } from "mongoose";
import mongooseDelete, {
  SoftDeleteDocument,
  SoftDeleteModel,
} from "mongoose-delete";
import MessageStatus from "../enums/MessageStatus.enum";
import { IMessage } from "../interfaces/message.interface";

// Define schema
const MessageSchema = new Schema<IMessage>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    msgBody: { type: String, required: true },
    status: { type: String, required: true, default: MessageStatus.SENT },
    seenList: { type: Map, of: String, default: {} },
    replyForMsg: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

// Add soft delete plugin

// Export model
const Message = mongoose.model<IMessage>("Message", MessageSchema);
export default Message;
