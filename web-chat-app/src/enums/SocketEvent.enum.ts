enum SocketEvent {
  rm = "receive-message",
  sm = "send-message",
  fcl = "fetch-chat-list",
  fmr = "fetch-messages-request",
  fm = "fetch-messages",
  flm = "fetch-last-message",
  um = "unsend-message"
}

export default SocketEvent;
