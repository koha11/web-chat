import { MONGO_URI } from "../config/env.js";
import mongoose from "mongoose";
export const connectDB = async () => {
    await mongoose.connect(MONGO_URI);
};
