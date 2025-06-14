import { Types } from "mongoose";

export interface ITokenPayload {
  id: Types.ObjectId | string;
  username: string;
  expiresIn: string;
}
