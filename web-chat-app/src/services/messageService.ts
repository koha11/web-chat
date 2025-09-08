import { gql } from "@apollo/client";

const MSG_FIELDS_QUERY = `          
  id
  user
  msgBody
  status
  seenList
  createdAt
  isHiddenFor
  unsentAt
  editedAt
  endedCallAt
  isForwarded
  type
  file
  systemLog
  reactions
  chat
`;

export const GET_MESSAGES = gql`
  query GetMessages($chatId: ID!, $first: Int, $after: ID, $search: String, $until: ID) {
    messages(chatId: $chatId, first: $first, after: $after, search: $search, until: $until) {
      edges {
        node {
          ${MSG_FIELDS_QUERY}
          replyForMsg {
            id
            user
            msgBody
            status
            type
            file
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

export const GET_FILE_MESSAGES = gql`
  query GetFileMessages(
    $chatId: ID!
    $first: Int
    $after: ID
    $isMediaFile: Boolean!
  ) {
    fileMessages(
      chatId: $chatId
      first: $first
      after: $after
      isMediaFile: $isMediaFile
    ) {
      edges {
        node {
          id
          createdAt
          isHiddenFor
          type
          file
          systemLog
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
      ${MSG_FIELDS_QUERY}
      replyForMsg {
        id
        user
        type
        file
        systemLog
        msgBody
        status
        seenList
        createdAt
      }     
    }
  }
`;

export const POST_MEDIA_MESSAGE = gql`
  mutation PostMediaMessage(
    $chatId: ID!
    $files: [Upload!]!
    $filesInfo: [Int]
    $replyForMsg: String
    $isForwarded: Boolean
  ) {
    postMediaMessage(
      chatId: $chatId
      files: $files
      filesInfo: $filesInfo
      replyForMsg: $replyForMsg
      isForwarded: $isForwarded
    )
  }
`;

export const UNSEND_MESSAGE = gql`
  mutation UnsendMessage($chatId: ID!, $msgId: ID!) {
    unsendMessage(chatId: $chatId, msgId: $msgId) {
      ${MSG_FIELDS_QUERY}
      replyForMsg {
        id
        user
        msgBody
        status
        seenList
        createdAt
        type
        file
        systemLog
      }
    }
  }
`;

export const REMOVE_MESSAGE = gql`
  mutation RemoveMessage($chatId: ID!, $msgId: ID!) {
    removeMessage(chatId: $chatId, msgId: $msgId) {
      ${MSG_FIELDS_QUERY}
      replyForMsg {
        id
        user
        msgBody
        status
        seenList
        createdAt
        type
        file
        systemLog
      }
    }
  }
`;

export const REACT_MESSAGE = gql`
  mutation ReactMessage($msgId: ID!, $unified: String!, $emoji: String!) {
    reactMessage(unified: $unified, msgId: $msgId, emoji: $emoji) {
      ${MSG_FIELDS_QUERY}
      replyForMsg {
        id
        user
        msgBody
        status
        seenList
        createdAt
        type
        file
        systemLog
      }
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
        ${MSG_FIELDS_QUERY}
        replyForMsg {
          id
          user
          msgBody
          status
          seenList
          createdAt
        }
      }
    }
  }
`;

export const MESSAGE_CHANGED_SUB = gql`
  subscription MessageChanged($chatId: ID!) {
    messageChanged(chatId: $chatId) {
      cursor
      node {
        ${MSG_FIELDS_QUERY}
        replyForMsg {
          id
          user
          msgBody
          status
          seenList
          createdAt
        }
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

export const UPLOAD_PROGRESS_SUB = gql`
  subscription UploadProgress($uploadId: ID!) {
    uploadProgress(uploadId: $uploadId) {
      id
      phase
      pct
      url
      publicId
      error
      addedMsg {
        node {
          ${MSG_FIELDS_QUERY}
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
    }
  }
`;
