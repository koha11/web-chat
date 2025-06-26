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

    createdAt: Date
    updatedAt: Date
    deleted: Boolean
    deletedAt: Date
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
    ): Message!

    unsendMessage(chatId: ID!, msgId: ID!): Message!
  }

  extend type Subscription {
    messageAdded(chatId: ID!): MessageEdge!
    messageChanged(chatId: ID!): MessageEdge!
  }
`;
