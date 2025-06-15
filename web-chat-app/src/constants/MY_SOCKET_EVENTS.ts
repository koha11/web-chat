import SocketEvent from "../enums/SocketEvent.enum";

const MY_SOCKET_EVENTS = {
  [SocketEvent.rm]: "receive-message",
  [SocketEvent.sm]: "send-message",
  [SocketEvent.fcl]: "fetch-chat-list",
};

export default MY_SOCKET_EVENTS;
