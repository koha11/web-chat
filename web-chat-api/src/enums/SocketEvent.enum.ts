enum SocketEvent {
  chatChanged = "CHAT_CHANGED_SUB",
  messageAdded = "MESSAGE_ADDED_SUB",
  messageChanged = "MESSAGE_CHANGED_SUB",
  messageTyping = "MESSAGE_TYPING_SUB",
  ongoingCall = "ONGOING_CALL_SUB",
  responseCall = "RESPONSE_CALL_SUB",
  uploadProgress = "UPLOAD_PROCESS_SUB"
}

export default SocketEvent;
