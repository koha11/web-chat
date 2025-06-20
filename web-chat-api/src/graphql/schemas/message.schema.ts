import { gql } from "apollo-server-express";

export const messageTypeDefs = gql`
  type PageInfo {
    startCursor: ID
    endCursor: ID
    hasNextPage: Boolean!
  }

  type MessageEdge {
    node: Message
    cursor: ID!
  }

  type MessageConnection {
    edges: [MessageEdge!]!
    pageInfo: PageInfo!
  }

  type Message {
    id: ID!
    user: ID!
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
    messages(msgId: ID, first: Int = 10, after: ID): MessageConnection!
  }

  extend type Mutation {
    postMessage(roomId: ID!, sender: String!, text: String!): Message!
  }
`;
