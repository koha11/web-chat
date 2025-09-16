import { gql } from "apollo-server-express";

export const chatTypeDefs = gql`
  type Chat {
    id: ID!
    users: [User!]!
    chatName: String
    chatAvatar: String
    usersInfo: JSONObject
    lastMsgSeen: JSONObject
    chatType: String!
    chatEmoji: String!

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
    msgId: ID!
  }

  type ChatChanged {
    chat: Chat!
    publisherId: ID!
    action: String
  }

  extend type Query {
    chats(first: Int = 10, after: ID, chatName: String): ChatConnection!
    chat(chatId: ID, users: [ID]): Chat
  }

  extend type Mutation {
    postChat(users: [ID!]!): Chat!
    addMembers(chatId: ID!, userIds: [ID!]!): Chat!
    changeNickname(chatId: ID!, changedUserId: ID!, nickname: String!): Chat!
    changeChatAvatar(chatId: ID!, file: Upload!): Chat!
    changeChatName(chatId: ID!, chatName: String!): Chat!
    changeChatEmoji(chatId: ID!, emoji: String!): Chat!
    makeCall(chatId: ID!, hasVideo: Boolean!): String!
    handleCall(chatId: ID!, isAccepted: Boolean!, msgId: ID!): Boolean
    hangupCall(chatId: ID!, msgId: ID!): Boolean
    leaveChat(chatId: ID!): Chat!
    removeFromChat(chatId: ID!, removedUserId: ID!): Chat!
  }

  extend type Subscription {
    chatChanged(userId: ID!): ChatChanged!
    ongoingCall: CallUser!
    responseCall: Boolean
  }
`;
