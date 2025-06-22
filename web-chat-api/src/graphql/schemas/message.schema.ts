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

    createdAt: String
    updatedAt: String
    deleted: Boolean
    deletedAt: String
  }

  extend type Query {
    messages(
      chatId: ID!
      msgId: ID
      first: Int = 10
      after: ID
    ): MessageConnection!

    lastMessages(userId: ID!): [MessageConnection]!
  }

  extend type Mutation {
    postMessage(
      chatId: ID!
      msgBody: String!
      user: ID!
      replyForMsg: String
    ): Message!
  }

  extend type Subscription {
    initLastMessage(userId: ID!): [MessageConnection!]
    receiveMessage(chatId: ID!): Message!
  }
`;
