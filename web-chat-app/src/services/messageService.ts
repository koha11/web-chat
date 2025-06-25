import { gql } from "@apollo/client";

export const GET_MESSAGES = gql`
  query ($chatId: ID!, $first: Int, $after: ID) {
    messages(chatId: $chatId, first: $first, after: $after) {
      edges {
        node {
          id
          user
          msgBody
          status
          seenList
          createdAt
          replyForMsg {
            id
            user
            msgBody
            status
            seenList
            createdAt
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

export const GET_LAST_MESSAGES = gql`
  query GetLastMessages($userId: ID!) {
    lastMessages(userId: $userId)
  }
`;

export const POST_MESSAGE = gql`
  mutation PostMessage(
    $chatId: ID!
    $msgBody: String!
    $user: ID!
    $replyForMsg: String
  ) {
    postMessage(
      chatId: $chatId
      msgBody: $msgBody
      user: $user
      replyForMsg: $replyForMsg
    ) {
      id
      chat
      user
      msgBody
      status
      replyForMsg {
        id
        user
        msgBody
        status
        seenList
        createdAt
      }
      seenList
      createdAt
    }
  }
`;

export const CHANGE_MESSAGE_STATUS = gql`
  mutation ChangeMessageStatus($chatId: ID!, $msgId: ID!, $status: String!) {
    changeMessageStatus(chatId: $chatId, msgId: $msgId, status: $status) {
      id
      user
      msgBody
      status
      replyForMsg {
        id
        user
        msgBody
        status
        seenList
        createdAt
      }
      seenList
      createdAt
    }
  }
`;

export const MESSAGE_ADDED_SUB = gql`
  subscription MessageAdded($chatId: ID!) {
    messageAdded(chatId: $chatId) {
      cursor
      node {
        id
        user
        msgBody
        status
        seenList
        createdAt
        updatedAt
      }
    }
  }
`;

export const MESSAGE_STATUS_CHANGED_SUB = gql`
  subscription MessageStatusChanged($chatId: ID!) {
    messageStatusChanged(chatId: $chatId) {
      cursor
      node {
        id
        chat
        user
        msgBody
        status
        seenList
        createdAt
        updatedAt
      }
    }
  }
`;
