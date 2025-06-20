import { gql } from 'apollo-server-express';

export const chatTypeDefs = gql`
  type Message {
    id: ID!
    roomId: ID!
    sender: String!
    text: String!
    createdAt: String!
  }

  extend type Query {
    messages(roomId: ID!): [Message!]!
  }

  extend type Mutation {
    postMessage(roomId: ID!, sender: String!, text: String!): Message!
  }
`;