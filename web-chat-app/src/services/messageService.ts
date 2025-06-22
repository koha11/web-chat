import { Socket } from "socket.io-client";
import { IMessage } from "../interfaces/message.interface";
import MY_SOCKET_EVENTS from "../constants/MY_SOCKET_EVENTS";
import SocketEvent from "../enums/SocketEvent.enum";
import IMessageGroup from "../interfaces/messageGroup.interface";
import { getTimeDiff, TimeTypeOption } from "../utils/messageTime.helper";
import { gql, TypedDocumentNode } from "@apollo/client";

export const listenReceiveMessage = (socket: Socket, setMessages: Function) => {
  socket.on(SocketEvent.rm, (msg: IMessage, chatId: string) => {
    setMessages((messages: { [chatId: string]: IMessageGroup[] }) => {
      const time = new Date(msg.createdAt ?? "");
      const firstMsgGroup = messages[chatId][0] ?? undefined;

      if (
        firstMsgGroup &&
        getTimeDiff(
          time,
          new Date(firstMsgGroup.timeString),
          TimeTypeOption.MINUTES
        ) < 20
      ) {
        // Clone the messages of the first group
        const updatedFirstGroup = {
          ...firstMsgGroup,
          messages: [msg, ...firstMsgGroup.messages],
        };

        // Clone the whole array, replacing the last item
        return {
          ...messages,
          [chatId]: [updatedFirstGroup, ...messages[chatId].slice(1)],
        };
      } else {
        // Add a new group
        return {
          ...messages,
          [chatId]: [
            { timeString: time.toISOString(), messages: [msg] },
            ...messages[chatId],
          ],
        };
      }
    });

    console.log("toi da nhan dc " + msg.msgBody);
  });
};

export const fetchLastMessageEvent = (
  socket: Socket,
  setLastMsgList: Function
) => {
  socket.on(SocketEvent.flm, (lastMsgList: { [chatId: string]: IMessage }) => {
    setLastMsgList(lastMsgList);
  });
};

export const fetchMessagesEvent = (
  socket: Socket,
  setMessages: (chatId: string, messageGroup: IMessageGroup[]) => void,
  setMsgLoading: (isLoading: boolean) => void
) => {
  socket.on(SocketEvent.fm, (messages: IMessage[], chatId: string) => {
    const grouped = messages.reduce<IMessageGroup[]>((acc, msg) => {
      const time = new Date(msg.createdAt!);
      const last = acc[acc.length - 1];

      if (
        last &&
        getTimeDiff(new Date(last.timeString), time, TimeTypeOption.MINUTES) <
          20
      ) {
        last.messages.push(msg);
      } else {
        acc.push({ timeString: time.toISOString(), messages: [msg] });
      }

      return acc;
    }, []);

    setMessages(chatId, grouped);
    setMsgLoading(false);
  });
};

export const RequestFetchMessages = (socket: Socket, chatId: string) => {
  socket.emit(SocketEvent.fmr, chatId);
};

export const RequestFetchLastMessages = (socket: Socket, chatId: string) => {
  socket.emit(SocketEvent.flm, chatId);
};

export const GET_MESSAGES = gql`
  query ($chatId: ID!, $first: Int, $after: ID) {
    messages(chatId: $chatId, first: $first, after: $after) {
      edges {
        node {
          id
          user
          msgBody
          status
          seenList
          createdAt
          replyForMsg {
            id
            user
            msgBody
            status
            seenList
            createdAt
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

export const GET_LAST_MESSAGES = gql`
  query GetLastMessages($userId: ID!) {
    lastMessages(userId: $userId) {
      edges {
        node {
          id
          user
          chat
          msgBody
          status
          seenList
          createdAt
          replyForMsg {
            id
            user
            msgBody
            status
            seenList
            createdAt
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

export const INIT_LAST_MESSAGE_SUB: TypedDocumentNode<any, any> = gql`
  subscription InitLastMessage {
    initLastMessage(userId: "684d9cf16cda6f875d523d81") {
      edges {
        cursor
        node {
          id
          user
          chat
          msgBody
          status
          seenList
          createdAt
          updatedAt
          deleted
          deletedAt
        }
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
      }
    }
  }
`;

export const RECEIVE_MESSAGE_SUB = gql`
  subscription ReceiveMessage($chatId: ID!) {
    receiveMessage(chatId: $chatId) {
      id
      user
      msgBody
      status
      seenList
      createdAt
      updatedAt
    }
  }
`;
