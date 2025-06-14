import { Socket } from "socket.io-client";

export const fetchChatListEvent = (socket: Socket) => {
  socket.on("fetch-chat-list", (chatList) => {
    console.log(chatList);
  });
};
