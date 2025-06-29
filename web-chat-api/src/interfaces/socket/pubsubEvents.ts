import SocketEvent from "../../enums/SocketEvent.enum";
import { IChat } from "../chat.interface";
import { IMessage } from "../message.interface";
import { Edge } from "../modelConnection.interface";

export type PubsubEvents = {
  [SocketEvent.messageAdded]: { messageAdded: Edge<IMessage>; chatId: string };
  [SocketEvent.chatChanged]: { chatChanged: IChat };
  [SocketEvent.messageChanged]: { messageChanged: Edge<IMessage> };
};
