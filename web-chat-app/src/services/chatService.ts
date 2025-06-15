import { Socket } from "socket.io-client";
import { IChat } from "../interfaces/chat.interface";
import { IUser } from "../interfaces/user.interface";

export const fetchChatListEvent = (
  socket: Socket,
  setChatList: (chatList: IChat[]) => void
) => {
  socket.on("fetch-chat-list", (chatList: IChat[]) => {
    const userId = (socket.auth as { [key: string]: any })["userId"];

    setChatList(
      chatList.map((chat) => {
        const users = chat.users as IUser[];

        chat.chatAvatar =
          chat.chatAvatar == ""
            ? users.find((user) => user._id != userId)?.avatar ?? ""
            : chat.chatAvatar;

        // Lay ra ten doan chat mac dinh
        chat.chatName =
          chat.chatName == ""
            ? users.length == 2
              ? users.find((user) => user._id != userId)!.fullname
              : users.reduce((acc, user) => {
                  if (user._id == userId) return acc;
                  return (
                    acc + (acc == "" ? "" : ", ") + user.fullname.split(" ")[0]
                  );
                }, "")
            : chat.chatName;

        return chat;
      })
    );
  });
};
