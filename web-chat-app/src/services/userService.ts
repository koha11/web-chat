import { gql } from "@apollo/client";

export const GET_CONNECTABLE_USERS = gql`
  query GetConnectableUsers($userId: ID!, $first: Int, $after: ID) {
    connectableUsers(userId: $userId, first: $first, after: $after) {
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
