import { gql } from "@apollo/client";

export const GET_CONTACTS = gql`
  query GetContacts($after: ID, $first: Int, $search: String) {
    contacts(after: $after, first: $first, search: $search) {
      edges {
        cursor
        node {
          id
          users {
            id
            avatar
            fullname
          }
          chatId
          relationships
        }
      }
    }
  }
`;

export const SEND_REQUEST = gql`
  mutation SendRequest($userId: ID!) {
    sendRequest(userId: $userId) {
      id
      users {
        id
        avatar
        fullname
      }
      chatId
      relationships
    }
  }
`;

export const HANDLE_REQUEST = gql`
  mutation HandleRequest($userId: ID!, $isAccepted: Boolean!) {
    handleRequest(userId: $userId, isAccepted: $isAccepted) {
      id
      users {
        id
        avatar
        fullname
      }
      chatId
      relationships
    }
  }
`;

export const REMOVE_CONNECT = gql`
  mutation RemoveConnect($userId: ID!) {
    removeConnect(userId: $userId) {
      id
      users {
        id
        avatar
        fullname
      }
      chatId
      relationships
    }
  }
`;
