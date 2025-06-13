import { Server } from "http";
import { Server as IOServer } from "socket.io";

export const connectSocketIo = (server: Server) => {
  const io = new IOServer(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("chat message", (msg: string) => {
      io.emit("chat message", msg);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};
