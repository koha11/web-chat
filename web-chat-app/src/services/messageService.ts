import { Socket } from "socket.io-client";
import { IMessage } from "../interfaces/message.interface";
import MY_SOCKET_EVENTS from "../constants/MY_SOCKET_EVENTS";
import SocketEvent from "../enums/SocketEvent.enum";
import IMessageGroup from "../interfaces/messageGroup.interface";

export const listenReceiveMessage = (socket: Socket, setMessage: (msgGroup: IMessageGroup) => void, lastMsgGroup: IMessageGroup) => {
  socket.on(MY_SOCKET_EVENTS[SocketEvent.rm], (msg: IMessage) => {
    setMessage(lastMsgGroup)
    console.log("toi da nhan dc " + msg.msgBody);
  });
};