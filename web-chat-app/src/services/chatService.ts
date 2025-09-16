import { gql } from "@apollo/client";

export const GET_CHATS = gql`
  query GetChats($first: Int, $after: ID, $chatName: String) {
    chats(first: $first, after: $after, chatName: $chatName) {
      edges {
        node {
          id
          chatName
          chatAvatar
          usersInfo
          updatedAt
          lastMsgSeen
          chatType
          chatEmoji
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
  query GetChat($chatId: ID, $users: [ID]) {
    chat(chatId: $chatId, users: $users) {
      id
      chatName
      chatAvatar
      usersInfo
      updatedAt
      lastMsgSeen
      chatType
      chatEmoji
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

export const ADD_MEMBERS = gql`
  mutation AddMembers($chatId: ID!, $userIds: [ID!]!) {
    addMembers(chatId: $chatId, userIds: $userIds) {
      id
    }
  }
`;

export const LEAVE_CHAT = gql`
  mutation LeaveChat($chatId: ID!) {
    leaveChat(chatId: $chatId) {
      id
    }
  }
`;

export const REMOVE_FROM_CHAT = gql`
  mutation RemoveFromChat($chatId: ID!, $removedUserId: ID!) {
    removeFromChat(chatId: $chatId, removedUserId: $removedUserId) {
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
      usersInfo
      updatedAt
      lastMsgSeen
      chatEmoji
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
      usersInfo
      updatedAt
      lastMsgSeen
      chatType
      chatEmoji
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
      usersInfo
      updatedAt
      lastMsgSeen
      chatType
      chatEmoji
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

export const CHANGE_CHAT_EMOJI = gql`
  mutation ChangeChatEmoji($chatId: ID!, $emoji: String!) {
    changeChatEmoji(chatId: $chatId, emoji: $emoji) {
      id
      chatName
      chatAvatar
      usersInfo
      updatedAt
      lastMsgSeen
      chatType
      chatEmoji
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

export const HANDLE_CALL = gql`
  mutation HandleCall($chatId: ID!, $isAccepted: Boolean!, $msgId: ID!) {
    handleCall(chatId: $chatId, isAccepted: $isAccepted, msgId: $msgId)
  }
`;

export const HANGUP_CALL = gql`
  mutation HangupCall($chatId: ID!, $msgId: ID!) {
    hangupCall(chatId: $chatId, msgId: $msgId)
  }
`;

export const CHAT_CHANGED_SUB = gql`
  subscription ChatChanged($userId: ID!) {
    chatChanged(userId: $userId) {
      chat {
        id
        chatName
        chatAvatar
        usersInfo
        updatedAt
        lastMsgSeen
        chatType
        chatEmoji
        users {
          id
          fullname
          avatar
          isOnline
          lastLogined
          userType
        }
      }
      publisherId
      action
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
      msgId
    }
  }
`;

export const CHAT_RESPONSE_CALL_SUB = gql`
  subscription ResponseCall {
    responseCall
  }
`;
