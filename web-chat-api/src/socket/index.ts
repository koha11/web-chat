import { Server } from "http";
import { Server as IOServer } from "socket.io";
import chatService from "../services/ChatService";
import messageService from "../services/MessageService";
import authService from "../services/AuthService";
import userService from "../services/UserService";
import { ITokenPayload } from "../interfaces/auth/tokenPayload.interface";

export const connectSocketIo = (server: Server) => {
  const io = new IOServer(server, { cors: { origin: "*" } });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Token required"));
    }

    const user = authService.verifyToken(token);

    socket.data.user = user;
    next();
  });

  io.on("connection", async (socket) => {
    const user = socket.data.user as ITokenPayload;

    console.log("New client connected:", user.username);

    await userService.setOnlineStatus(user.id.toString());

    const chatList = await chatService.fetchChatListEvent(io, socket.data.user.id);

    await messageService.fetchLastMessageEvent(io, chatList)

    messageService.listenFetchMessagesRequest(socket, io);

    messageService.listenSendMessage(socket, io);

    socket.on("disconnect", async () => {
      console.log("Client disconnected:", user.username);
      await userService.setOfflineStatus(user.id.toString());
    });
  });
};
