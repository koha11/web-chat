import { gql } from "apollo-server-express";

export const chatTypeDefs = gql`
  scalar JSONObject

  type Chat {
    id: ID!
    users: [User!]!
    chatName: String
    chatAvatar: String
    nicknames: JSONObject
    createdAt: String
    updatedAt: String
    deleted: Boolean
    deletedAt: String
  }

  extend type Query {
    chats(chatId: ID, first: Int = 10, after: ID): [Chat!]!
  }

  extend type Mutation {
    postChat(roomId: ID!, sender: String!, text: String!): Chat!
  }
`;
