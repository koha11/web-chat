import { PubSub } from "graphql-subscriptions";
import { ITokenPayload } from "../auth/tokenPayload.interface.js";

export default interface IMyContext {
  pubsub: PubSub;
  user: ITokenPayload;
}
