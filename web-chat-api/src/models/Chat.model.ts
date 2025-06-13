import mongoose, { Document, Schema, Model, Types } from "mongoose";
import mongooseDelete, {
  SoftDeleteDocument,
  SoftDeleteModel,
} from "mongoose-delete";
import { IUser } from "./User.model";
import { IMessage } from "./Message.model";

// Interface for Chat document
export interface IChat extends Document {
  users: IUser[] | Types.ObjectId[];
  messages: IMessage[] | Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
  deletedAt?: Date;
}

// Schema definition
const ChatSchema = new Schema<IChat>(
  {
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  },
  { timestamps: true }
);

// Add soft delete plugin
ChatSchema.plugin(mongooseDelete, {
  overrideMethods: "all",
  deletedAt: true,
});

// Export model
const Chat: SoftDeleteModel<IChat> = mongoose.model<
  IChat,
  SoftDeleteModel<IChat>
>("Chat", ChatSchema);

export default Chat;
