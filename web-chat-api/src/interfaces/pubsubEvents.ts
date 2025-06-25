import SocketEvent from "../enums/SocketEvent";
import { IMessage } from "./message.interface";
import { Edge } from "./modelConnection.interface";

export type PubsubEvents = {
  [SocketEvent.messageAdded]: { messageAdded: Edge<IMessage>; chatId: string };
  [SocketEvent.chatChanged]: { chatId: string };
  [SocketEvent.messageStatusChanged]: { messageChanged: Edge<IMessage> };
};
