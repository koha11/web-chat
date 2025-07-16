import dotenv from "dotenv";
dotenv.config();

export const ENVIRONMENT = process.env.ENVIRONMENT;
export const MONGO_URI = process.env.MONGO_URI!;
export const PORT = process.env.PORT || "3000";
export const HOST =
  ENVIRONMENT == "DEV" ? "localhost" : process.env.SERVER_HOST;
export const DEFAULT_URL =
  ENVIRONMENT == "DEV" ? `http://${HOST}:${PORT}` : `https://${HOST}`;
export const CLIENT_PORT = process.env.CLIENT_PORT || "5173";
export const CLIENT_HOST =
  ENVIRONMENT == "DEV" ? "localhost" : process.env.CLIENT_HOST;
export const DEFAULT_CLIENT_URL =
  ENVIRONMENT == "DEV" ? `http://${CLIENT_HOST}:${CLIENT_PORT}` : `https://${CLIENT_HOST}`;
export const JWT_SECRET = process.env.JWT_SECRET || "Toi-muon-co-bo";
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
export const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const CLOUDINARY_URL = process.env.CLOUDINARY_URL;
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASS = process.env.EMAIL_PASS;
