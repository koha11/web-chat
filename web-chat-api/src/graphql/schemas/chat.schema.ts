import { gql } from "apollo-server-express";

export const chatTypeDefs = gql`
  type Chat {
    id: ID!
    users: [User!]!
    chatName: String
    chatAvatar: String
    nicknames: JSONObject
    lastMsgSeen: JSONObject

    createdAt: Date
    updatedAt: Date
    deleted: Boolean
    deletedAt: Date
  }

  type ChatEdge {
    node: Chat
    cursor: ID!
  }

  type ChatConnection {
    edges: [ChatEdge]!
    pageInfo: PageInfo!
  }

  extend type Query {
    chats(userId: ID!, chatId: ID, first: Int = 10, after: ID): ChatConnection!
  }

  extend type Mutation {
    postChat(users: [ID!]!): Chat!
  }

  extend type Subscription {
    chatChanged(userId: ID!): Chat!
  }
`;
