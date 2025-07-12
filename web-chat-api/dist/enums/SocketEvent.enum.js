var SocketEvent;
(function (SocketEvent) {
    SocketEvent["chatChanged"] = "CHAT_CHANGED_SUB";
    SocketEvent["messageAdded"] = "MESSAGE_ADDED_SUB";
    SocketEvent["messageChanged"] = "MESSAGE_CHANGED_SUB";
    SocketEvent["messageTyping"] = "MESSAGE_TYPING_SUB";
})(SocketEvent || (SocketEvent = {}));
export default SocketEvent;
