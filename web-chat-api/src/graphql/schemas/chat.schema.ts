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

  type CallUser {
    user: User!
    hasVideo: Boolean!
    chatId: ID!
  }

  extend type Query {
    chats(userId: ID!, first: Int = 10, after: ID): ChatConnection!
    chat(chatId: ID!): Chat
  }

  extend type Mutation {
    postChat(users: [ID!]!): Chat!
    changeNickname(chatId: ID!, changedUserId: ID!, nickname: String!): Chat!
    changeChatAvatar(chatId: ID!, file: Upload!): Chat!
    changeChatName(chatId: ID!, chatName: String!): Chat!
    makeCall(chatId: ID!, hasVideo: Boolean!): Boolean
    handleCall(chatId: ID!, isAccepted: Boolean!): Boolean
    hangupCall(chatId: ID!): Boolean
  }

  extend type Subscription {
    chatChanged(userId: ID!): Chat!
    ongoingCall: CallUser!
    responseCall: Boolean
  }
`;
