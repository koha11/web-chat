import dotenv from "dotenv";
dotenv.config();

const ENV = process.env;

export const MONGO_URI = `mongodb://${ENV.DB_HOST}:${ENV.DB_PORT}/${ENV.DB_NAME}`;
export const PORT = process.env.PORT || "3000";
