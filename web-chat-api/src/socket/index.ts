import { Server } from "http";
import { Server as IOServer } from "socket.io";
import chatService from "../services/ChatService";
import messageService from "../services/MessageService";
import authService from "../services/AuthService";

export const connectSocketIo = (server: Server) => {
  const io = new IOServer(server, { cors: { origin: "*" } });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Token required"));
    }

    const user = authService.verifyToken(token);

    socket.data.user = user;

    // try {
    //   const user = jwt.verify(token, process.env.JWT_SECRET!);
    //   socket.data.user = user; // Attach user info
    //   next();
    // } catch (err) {
    //   return next(new Error("Invalid token"));
    // }
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("chat message", (msg: string) => {
      io.emit("chat message", msg);
    });

    chatService.fetchChatListEvent(io);

    messageService.listenChangeMessage(socket, io);

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};
