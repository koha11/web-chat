import { Socket } from "socket.io-client";
import { IChat } from "../interfaces/chat.interface";
import { IUser } from "../interfaces/user.interface";
import MY_SOCKET_EVENTS from "../constants/MY_SOCKET_EVENTS";
import SocketEvent from "../enums/SocketEvent.enum";
import { gql } from "@apollo/client";

export const fetchChatListEvent = (
  socket: Socket,
  setChatList: (chatList: IChat[]) => void
) => {
  socket.on(MY_SOCKET_EVENTS[SocketEvent.fcl], (chatList: IChat[]) => {
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

export const GET_CHATS = gql`
  query ($userId: ID!) {
    chats(userId: $userId) {
      edges {
        node {
          id
          chatName
          chatAvatar
          nicknames
          users {
            id
            fullname
            avatar
            isOnline
            lastLogined
          }
        }
        cursor
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
      }
    }
  }
`;

// export const POST_CHAT = gql``;

// export const CHAT_SUB = gql`
//   subscription ()
// `;
