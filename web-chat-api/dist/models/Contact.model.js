import mongoose, { Schema } from "mongoose";
// Define schema
const ContactSchema = new Schema({
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
}, { timestamps: true });
// Add soft delete plugin
// Export model
const Contact = mongoose.model("Contact", ContactSchema);
export default Contact;
