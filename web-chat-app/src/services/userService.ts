import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query GetUsers($userId: ID!) {
    users(userId: $userId) {
      id
      avatar
      fullname
    }
  }
`;

export const GET_CONNECTABLE_USERS = gql`
  query GetConnectableUsers(
    $userId: ID!
    $first: Int
    $after: ID
    $search: String
  ) {
    connectableUsers(
      userId: $userId
      first: $first
      after: $after
      search: $search
    ) {
      edges {
        cursor
        node {
          id
          avatar
          fullname
        }
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
      }
    }
  }
`;

export const GET_CHAT_ADDABLE_USERS = gql`
  query GetChatAddableUsers(
    $userId: ID!
    $chatId: ID!
    $first: Int
    $after: ID
    $search: String
  ) {
    chatAddableUsers(
      userId: $userId
      chatId: $chatId
      first: $first
      after: $after
      search: $search
    ) {
      edges {
        cursor
        node {
          id
          avatar
          fullname
        }
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
      }
    }
  }
`;

export const GET_RECEIVED_CONNECT_REQUESTS = gql`
  query GetReceivedConnectRequests($first: Int, $after: ID) {
    receivedConnectRequests(first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          avatar
          fullname
        }
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
      }
    }
  }
`;

export const GET_SENT_CONNECT_REQUESTS = gql`
  query GetSentConnectRequests($first: Int, $after: ID) {
    sentConnectRequests(first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          avatar
          fullname
        }
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
      }
    }
  }
`;

export const UPLOAD_USER_AVATAR = gql`
  mutation UploadUserAvatar($file: Upload!) {
    uploadUserAvatar(file: $file)
  }
`;
