import { Server } from "http";
import { Server as IOServer } from "socket.io";
import chatService from "../services/ChatService";
import messageService from "../services/MessageService";
import authService from "../services/AuthService";
import userService from "../services/UserService";
import { ITokenPayload } from "../interfaces/auth/tokenPayload.interface";

export const connectSocketIo = (server: Server) => {
  const io = new IOServer(server, { cors: { origin: "*" } });

  let userMap = {} as { [userId: string]: string };

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

    console.log(
      "\nNew client connected:",
      user.username,
      "with socket id:",
      socket.id
    );

    userMap[user.id.toString()] = socket.id;

    await userService.setOnlineStatus(user.id.toString());

    console.log("fetch chat list for", user.username);
    const chatList = await chatService.fetchChatListEvent(
      io,
      userMap,
      socket.data.user.id
    );

    console.log("fetch last msg list for", user.username);
    await messageService.fetchLastMessageEvent(
      io,
      userMap,
      user.id.toString(),
      chatList
    );

    // init rooms for user
    chatList.forEach((chat) => {
      socket.join(chat.id);
    });

    messageService.listenFetchMessagesRequest(socket, io, userMap);

    messageService.listenSendMessage(socket, io, userMap);

    messageService.listenUnsendMessage(socket, io, userMap);

    socket.on("disconnect", async () => {
      console.log("Client disconnected:", user.username);
      userMap[user.id.toString()] = "";
      await userService.setOfflineStatus(user.id.toString());
    });
  });
};
