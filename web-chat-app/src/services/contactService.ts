import { gql } from "@apollo/client";

export const GET_CONTACTS = gql`
  query GetContacts($userId: ID, $after: ID, $first: Int) {
    contacts(userId: $userId, after: $after, first: $first) {
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
      }
    }
  }
`;

export const HANDLE_REQUEST = gql`
  mutation HandleRequest($userId: ID!, $isAccepted: Boolean!) {
    handleRequest(userId: $userId, isAccepted: $isAccepted)
  }
`;
