import { gql } from "@apollo/client";

export const GET_MESSAGES = gql`
  query GetMessages($chatId: ID!, $first: Int, $after: ID) {
    messages(chatId: $chatId, first: $first, after: $after) {
      edges {
        node {
          id
          user
          msgBody
          status
          seenList
          createdAt
          isHiddenFor
          unsentAt
          editedAt
          isForwarded
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
    $isForwarded: Boolean
  ) {
    postMessage(
      chatId: $chatId
      msgBody: $msgBody
      user: $user
      replyForMsg: $replyForMsg
      isForwarded: $isForwarded
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
      isHiddenFor
      unsentAt
      editedAt
      isForwarded
    }
  }
`;

export const UNSEND_MESSAGE = gql`
  mutation UnsendMessage($chatId: ID!, $msgId: ID!) {
    unsendMessage(chatId: $chatId, msgId: $msgId) {
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
      isHiddenFor
      unsentAt
      editedAt
      isForwarded
    }
  }
`;

export const REMOVE_MESSAGE = gql`
  mutation RemoveMessage($chatId: ID!, $msgId: ID!) {
    removeMessage(chatId: $chatId, msgId: $msgId) {
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
      isHiddenFor
      unsentAt
      editedAt
      isForwarded
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
        isHiddenFor
        unsentAt
        editedAt
        isForwarded
      }
    }
  }
`;

export const MESSAGE_CHANGED_SUB = gql`
  subscription MessageChanged($chatId: ID!) {
    messageChanged(chatId: $chatId) {
      cursor
      node {
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
        isHiddenFor
        unsentAt
        editedAt
        isForwarded
      }
    }
  }
`;
