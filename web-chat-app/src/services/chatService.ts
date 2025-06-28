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
          updatedAt
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

export const POST_CHAT = gql`
  mutation PostChat($users: [ID!]!) {
    postChat(users: $users) {
      id
    }
  }
`;

export const CHAT_CHANGED_SUB = gql`
  subscription ChatChanged($userId: ID!) {
    chats(userId: $userId) {
      edges {
        node {
          id
          chatName
          chatAvatar
          nicknames
          updatedAt
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
