import mongoose, { Document, Schema, Types } from "mongoose";
import mongooseDelete, {
  SoftDeleteDocument,
  SoftDeleteModel,
} from "mongoose-delete";
import { IUser } from "./User.model";
import MessageStatus from "../enums/MessageStatus.enum";

// Interface for Message document
export interface IMessage extends Document {
  user: IUser | Types.ObjectId;
  msgBody: string;
  status: MessageStatus;
  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
  deletedAt?: Date;
}

// Define schema
const MessageSchema = new Schema<IMessage>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    msgBody: { type: String, required: true },
    status: { type: String, required: true, default: MessageStatus.SENT },
  },
  { timestamps: true }
);

// Add soft delete plugin
MessageSchema.plugin(mongooseDelete, {
  overrideMethods: "all",
  deletedAt: true,
});

// Export model
const Message: SoftDeleteModel<IMessage> = mongoose.model<
  IMessage,
  SoftDeleteModel<IMessage>
>("Message", MessageSchema);
export default Message;
