import { Socket } from "socket.io-client";
import { IMessage } from "../interfaces/message.interface";
import MY_SOCKET_EVENTS from "../constants/MY_SOCKET_EVENTS";
import SocketEvent from "../enums/SocketEvent.enum";
import IMessageGroup from "../interfaces/messageGroup.interface";
import { getTimeDiff, TimeTypeOption } from "../utils/messageTime.helper";

export const listenReceiveMessage = (socket: Socket, setMessages: Function) => {
  socket.on(MY_SOCKET_EVENTS[SocketEvent.rm], (msg: IMessage) => {
    setMessages((msgGroupList: IMessageGroup[]) => {
      const time = new Date(msg.createdAt ?? "");
      const lastMsgGroup = msgGroupList[msgGroupList.length - 1] ?? undefined;

      if (
        lastMsgGroup &&
        getTimeDiff(
          time,
          new Date(lastMsgGroup.timeString),
          TimeTypeOption.MINUTES
        ) < 20
      ) {
        // Clone the messages of the last group
        const updatedLastGroup = {
          ...lastMsgGroup,
          messages: [...lastMsgGroup.messages, msg],
        };

        // Clone the whole array, replacing the last item
        return [...msgGroupList.slice(0, -1), updatedLastGroup];
      } else {
        // Add a new group
        return [
          ...msgGroupList,
          { timeString: time.toISOString(), messages: [msg] },
        ];
      }
    });

    console.log("toi da nhan dc " + msg.msgBody);
  });
};
