import { Socket } from "socket.io-client";
import { IMessage } from "../interfaces/message.interface";

export const listenReceiveMessage = (socket: Socket, setMessage: (msg: IMessage) => void) => {
  socket.on("receive-message", (msg: IMessage) => {
    setMessage(msg)
    console.log("toi da nhan dc " + msg.msgBody);
  });
};
