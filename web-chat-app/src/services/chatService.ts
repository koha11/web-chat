import { Socket } from "socket.io-client";
import { IChat } from "../interfaces/chat.interface";

export const fetchChatListEvent = (
  socket: Socket,
  setChatList: (chatList: IChat[]) => void
) => {
  socket.on("fetch-chat-list", (chatList) => {
    console.log(chatList);
    setChatList(chatList);
  });
};
