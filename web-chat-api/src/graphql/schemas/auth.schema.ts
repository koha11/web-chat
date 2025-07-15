import { gql } from "apollo-server-express";

export const authTypeDefs = gql`
  type AuthResponse {
    accessToken: String!
    userId: String!
  }

  extend type Mutation {
    login(username: String!, password: String!): AuthResponse
    register(
      username: String!
      password: String!
      fullname: String!
      email: String!
    ): AuthResponse
  }
`;
