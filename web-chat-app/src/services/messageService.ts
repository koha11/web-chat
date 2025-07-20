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
          type
          file
          reactions
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
    $replyForMsg: String
    $isForwarded: Boolean
  ) {
    postMessage(
      chatId: $chatId
      msgBody: $msgBody
      replyForMsg: $replyForMsg
      isForwarded: $isForwarded
    ) {
      id
      chat
      user
      msgBody
      status
      type
      file
      replyForMsg {
        id
        user
        type
        file
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
      reactions
    }
  }
`;

export const POST_MEDIA_MESSAGE = gql`
  mutation PostMediaMessage(
    $chatId: ID!
    $files: [Upload!]!
    $replyForMsg: String
    $isForwarded: Boolean
  ) {
    postMediaMessage(
      chatId: $chatId
      files: $files
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
        type
        file
        createdAt
      }
      seenList
      createdAt
      isHiddenFor
      unsentAt
      editedAt
      isForwarded
      type
      file
      reactions
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
        type
        file
      }
      seenList
      createdAt
      isHiddenFor
      unsentAt
      editedAt
      isForwarded
      type
      file
      reactions
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
        type
        file
      }
      seenList
      createdAt
      isHiddenFor
      unsentAt
      editedAt
      isForwarded
      type
      file
      reactions
    }
  }
`;

export const REACT_MESSAGE = gql`
  mutation ReactMessage($msgId: ID!, $unified: String!, $emoji: String!) {
    reactMessage(unified: $unified, msgId: $msgId, emoji: $emoji) {
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
        type
        file
      }
      seenList
      createdAt
      isHiddenFor
      unsentAt
      editedAt
      isForwarded
      type
      file
      reactions
    }
  }
`;

export const TYPE_MESSAGE = gql`
  mutation TypeMessage($chatId: ID!, $isTyping: Boolean!) {
    typeMessage(chatId: $chatId, isTyping: $isTyping) {
      id
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
        type
        file
        reactions
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
        type
        file
        reactions
      }
    }
  }
`;

export const MESSAGE_TYPING_SUB = gql`
  subscription MessageTyping($chatId: ID!) {
    messageTyping(chatId: $chatId) {
      typingUser {
        fullname
        avatar
      }
      isTyping
    }
  }
`;
