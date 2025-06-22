import { Socket } from "socket.io-client";
import { IChat } from "../interfaces/chat.interface";
import { IUser } from "../interfaces/user.interface";
import MY_SOCKET_EVENTS from "../constants/MY_SOCKET_EVENTS";
import SocketEvent from "../enums/SocketEvent.enum";
import { gql } from "@apollo/client";

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
