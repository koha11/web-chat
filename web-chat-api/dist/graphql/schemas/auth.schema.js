import { gql } from "apollo-server-express";
export const authTypeDefs = gql `
  type AuthResponse {
    data: JSONObject
    message: String!
    isValid: Boolean!
  }

  extend type Mutation {
    login(username: String!, password: String!): AuthResponse
    register(
      username: String!
      password: String!
      rePassword: String!
      fullname: String!
      email: String!
    ): AuthResponse
  }
`;
