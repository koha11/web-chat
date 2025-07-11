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
    msgBody: String!
    status: String!
    replyForMsg: Message
    seenList: JSONObject
    isHiddenFor: [String]
    unsentAt: Date
    editedAt: Date
    isForwarded: Boolean

    createdAt: Date
    updatedAt: Date
    deleted: Boolean
    deletedAt: Date
  }

  type TypingMessage {
    isTyping: Boolean!
    typingUser: User!
  }

  extend type Query {
    messages(
      chatId: ID!
      msgId: ID
      first: Int = 10
      after: ID
    ): MessageConnection!

    lastMessages(userId: ID!): JSONObject
  }

  extend type Mutation {
    postMessage(
      chatId: ID!
      msgBody: String!
      user: ID!
      replyForMsg: String
      isForwarded: Boolean
    ): Message!

    unsendMessage(chatId: ID!, msgId: ID!): Message!

    removeMessage(chatId: ID!, msgId: ID!): Message!

    typeMessage(chatId: ID!, isTyping: Boolean!): Message

  }

  extend type Subscription {
    messageAdded(chatId: ID!): MessageEdge!
    messageChanged(chatId: ID!): MessageEdge!
    messageTyping(chatId: ID!): TypingMessage
  }
`;
