import { Socket } from "socket.io-client";

export const listenReceiveMessage = (socket: Socket) => {
  socket.on("receive-message", (msg: string) => {
    console.log("toi da nhan dc " + msg);
  });
};
