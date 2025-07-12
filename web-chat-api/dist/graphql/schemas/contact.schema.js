import { gql } from "apollo-server-express";
export const contactTypeDefs = gql `
  type Contact {
    id: ID!
    users: [User!]!
    chatId: String
    relationship: String!

    createdAt: Date
    updatedAt: Date
    deleted: Boolean
    deletedAt: Date
  }

  type ContactEdge {
    node: Contact
    cursor: ID!
  }

  type ContactConnection {
    edges: [ContactEdge]!
    pageInfo: PageInfo!
  }

  extend type Query {
    contacts(userId: ID, after: ID, first: Int = 10): ContactConnection!
  }

  extend type Mutation {
    postContact(contactId: ID): Contact
  }
`;
