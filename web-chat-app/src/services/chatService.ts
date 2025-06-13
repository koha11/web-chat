import { Socket } from "socket.io-client";

export const fetchChatListEvent = (socket: Socket) => {
  socket.on("get_chat_list", (chatList) => {
    console.log(chatList);
  });
};
