import { Socket } from "socket.io-client";
import { IMessage } from "../interfaces/message.interface";
import MY_SOCKET_EVENTS from "../constants/MY_SOCKET_EVENTS";
import SocketEvent from "../enums/SocketEvent.enum";

export const listenReceiveMessage = (socket: Socket, setMessage: (msg: IMessage) => void) => {
  socket.on(MY_SOCKET_EVENTS[SocketEvent.rm], (msg: IMessage) => {
    setMessage(msg)
    console.log("toi da nhan dc " + msg.msgBody);
  });
};