var MessageStatus;
(function (MessageStatus) {
    MessageStatus["SENT"] = "SENT";
    MessageStatus["SEEN"] = "SEEN";
    MessageStatus["EDITED"] = "EDITED";
    MessageStatus["UNSEND"] = "UNSEND";
    MessageStatus["REMOVED_ONLY_YOU"] = "REMOVED_ONLY_YOU";
})(MessageStatus || (MessageStatus = {}));
export default MessageStatus;
