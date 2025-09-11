import { gql } from "apollo-server-express";

export const userTypeDefs = gql`
  type User {
    id: ID!
    username: String!
    fullname: String!
    avatar: String
    isOnline: Boolean
    lastLogined: String
    userType: String

    createdAt: String
    updatedAt: String
    deleted: Boolean
    deletedAt: String
  }

  type UserEdge {
    node: User
    cursor: ID!
  }

  type UserConnection {
    edges: [UserEdge]!
    pageInfo: PageInfo!
  }

  extend type Query {
    users(userId: ID): [User!]!
    connectableUsers(
      userId: ID!
      first: Int
      after: ID
      search: String
    ): UserConnection!
    chatAddableUsers(
      userId: ID!
      chatId: ID!
      first: Int
      after: ID
    ): UserConnection!
    receivedConnectRequests(after: ID, first: Int = 10): UserConnection!
    sentConnectRequests(after: ID, first: Int = 10): UserConnection!
  }

  extend type Mutation {
    postUser(userId: ID): User
    uploadUserAvatar(file: Upload!): String
  }
`;
