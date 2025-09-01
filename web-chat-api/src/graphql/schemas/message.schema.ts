import { gql } from "apollo-server-express";

export const messageTypeDefs = gql`
  type MessageEdge {
    node: Message
    cursor: ID!
  }

  type MessageConnection {
    edges: [MessageEdge]!
    pageInfo: PageInfo!
  }

  type Message {
    id: ID!
    user: ID!
    chat: ID!
    msgBody: String
    status: String!
    replyForMsg: Message
    seenList: JSONObject
    isHiddenFor: [String]
    unsentAt: Date
    editedAt: Date
    isForwarded: Boolean
    type: String
    file: JSONObject
    systemLog: JSONObject
    reactions: JSONObject
    endedCallAt: Date

    createdAt: Date
    updatedAt: Date
    deleted: Boolean
    deletedAt: Date
  }

  type TypingMessage {
    isTyping: Boolean!
    typingUser: User!
  }

  type UploadProgress {
    id: ID
    phase: String
    pct: Int
    url: String
    publicId: String
    error: String
    addedMsg: MessageEdge
  }

  extend type Query {
    messages(
      chatId: ID!
      msgId: ID
      first: Int = 10
      after: ID
      until: ID
      search: String
    ): MessageConnection!

    lastMessages(userId: ID!): JSONObject

    fileMessages(
      chatId: ID!
      first: Int = 10
      after: ID
      isMediaFile: Boolean!
    ): MessageConnection!
  }

  extend type Mutation {
    postMessage(
      chatId: ID!
      msgBody: String!
      replyForMsg: String
      isForwarded: Boolean
    ): Message!

    postMediaMessage(
      chatId: ID!
      files: [Upload!]!
      filesInfo: [Int]
      replyForMsg: String
      isForwarded: Boolean
    ): [ID!]!

    unsendMessage(chatId: ID!, msgId: ID!): Message!

    removeMessage(chatId: ID!, msgId: ID!): Message!

    typeMessage(chatId: ID!, isTyping: Boolean!): Message

    reactMessage(msgId: ID!, unified: String!, emoji: String!): Message
  }

  extend type Subscription {
    messageAdded(chatId: ID!): MessageEdge!
    messageChanged(chatId: ID!): MessageEdge!
    messageTyping(chatId: ID!): TypingMessage
    uploadProgress(uploadId: ID!): UploadProgress!
  }
`;
