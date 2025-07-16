import { gql } from "apollo-server-express";

export const authTypeDefs = gql`
  type AuthResponse {
    accessToken: String!
    userId: String!
  }

  type Account {
    username: String!
    email: String
    isConfirmedEmail: Boolean!
  }

  extend type Query {
    account(userId: ID!): Account
  }

  extend type Mutation {
    login(username: String!, password: String!): AuthResponse
    register(
      username: String!
      password: String!
      fullname: String!
      email: String
    ): AuthResponse
    verifyEmail(email: String!): Boolean
    changeEmail(email: String!): Boolean
  }
`;
