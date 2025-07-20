import { gql } from "@apollo/client";

export const GET_CHATS = gql`
  query GetChats($userId: ID!) {
    chats(userId: $userId) {
      edges {
        node {
          id
          chatName
          chatAvatar
          nicknames
          updatedAt
          lastMsgSeen
          users {
            id
            fullname
            avatar
            isOnline
            lastLogined
            userType
          }
        }
        cursor
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
      }
    }
  }
`;

export const GET_CHAT = gql`
  query GetChat($chatId: ID!) {
    chat(chatId: $chatId) {
      id
      chatName
      chatAvatar
      nicknames
      updatedAt
      lastMsgSeen
      users {
        id
        fullname
        avatar
        isOnline
        lastLogined
        userType
      }
    }
  }
`;

export const POST_CHAT = gql`
  mutation PostChat($users: [ID!]!) {
    postChat(users: $users) {
      id
    }
  }
`;

export const CHANGE_NICKNAME = gql`
  mutation ChangeNickname(
    $chatId: ID!
    $changedUserId: ID!
    $nickname: String!
  ) {
    changeNickname(
      chatId: $chatId
      changedUserId: $changedUserId
      nickname: $nickname
    ) {
      id
      chatName
      chatAvatar
      nicknames
      updatedAt
      lastMsgSeen
      users {
        id
        fullname
        avatar
        isOnline
        lastLogined
        userType
      }
    }
  }
`;

export const CHANGE_CHAT_AVATAR = gql`
  mutation ChangeChatAvatar($chatId: ID!, $file: Upload!) {
    changeChatAvatar(chatId: $chatId, file: $file) {
      id
      chatName
      chatAvatar
      nicknames
      updatedAt
      lastMsgSeen
      users {
        id
        fullname
        avatar
        isOnline
        lastLogined
        userType
      }
    }
  }
`;

export const CHANGE_CHAT_NAME = gql`
  mutation ChangeChatName($chatId: ID!, $chatName: String!) {
    changeChatName(chatId: $chatId, chatName: $chatName) {
      id
      chatName
      chatAvatar
      nicknames
      updatedAt
      lastMsgSeen
      users {
        id
        fullname
        avatar
        isOnline
        lastLogined
        userType
      }
    }
  }
`;

export const MAKE_CALL = gql`
  mutation MakeCall($chatId: ID!, $hasVideo: Boolean!) {
    makeCall(chatId: $chatId, hasVideo: $hasVideo)
  }
`;

export const HANGUP_CALL = gql`
  mutation HangupCall($chatId: ID!) {
    hangupCall(chatId: $chatId)
  }
`;

export const CHAT_CHANGED_SUB = gql`
  subscription ChatChanged($userId: ID!) {
    chatChanged(userId: $userId) {
      id
      chatName
      chatAvatar
      nicknames
      updatedAt
      lastMsgSeen
      users {
        id
        fullname
        avatar
        isOnline
        lastLogined
        userType
      }
    }
  }
`;

export const CHAT_ONGOING_CALL_SUB = gql`
  subscription ongoingCall {
    ongoingCall {
      user {
        id
        avatar
        fullname
      }
      hasVideo
      chatId
    }
  }
`;

export const CHAT_RESPONSE_CALL_SUB = gql`
  subscription ResponseCall {
    responseCall
  }
`;
