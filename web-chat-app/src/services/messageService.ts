import { Socket } from "socket.io-client";
import { IMessage } from "../interfaces/message.interface";
import MY_SOCKET_EVENTS from "../constants/MY_SOCKET_EVENTS";
import SocketEvent from "../enums/SocketEvent.enum";
import IMessageGroup from "../interfaces/messageGroup.interface";
import { getTimeDiff, TimeTypeOption } from "../utils/messageTime.helper";

export const listenReceiveMessage = (socket: Socket, setMessages: Function) => {
  socket.on(SocketEvent.rm, (msg: IMessage) => {
    setMessages((msgGroupList: IMessageGroup[]) => {
      const time = new Date(msg.createdAt ?? "");
      const firstMsgGroup = msgGroupList[0] ?? undefined;

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
        return [updatedFirstGroup, ...msgGroupList.slice(1)];
      } else {
        // Add a new group
        return [
          { timeString: time.toISOString(), messages: [msg] },
          ...msgGroupList,
        ];
      }
    });

    console.log("toi da nhan dc " + msg.msgBody);
  });
};

export const fetchLastMessageEvent = (
  socket: Socket,
  setMessages: Function
) => {
  socket.on(SocketEvent.flm, (messages: { [chatId: string]: [IMessage] }) => {
    let groupedMessages = {} as { [chatId: string]: IMessageGroup[] };

    Object.keys(messages).forEach((chatId) => {
      let message = messages[chatId][0];
      groupedMessages[chatId] = [
        {
          timeString: new Date(message.createdAt!).toISOString(),
          messages: [message],
        },
      ];
    });

    setMessages(groupedMessages);
  });
};

export const fetchMessagesEvent = (
  socket: Socket,
  setMessages: (chatId: string, messageGroup: IMessageGroup[]) => void
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
  });
};
