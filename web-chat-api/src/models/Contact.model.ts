import IContact from "../interfaces/contact.interface.js";
import mongoose, { Schema } from "mongoose";

// Define schema
const ContactSchema = new Schema<IContact>(
  {
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
    },
    relationships: {
      type: Schema.Types.Map,
      of: String,
      required: true,
      default: {},
    },
  },
  { timestamps: true }
);

// Add soft delete plugin

// Export model
const Contact = mongoose.model<IContact>("Contact", ContactSchema);
export default Contact;
