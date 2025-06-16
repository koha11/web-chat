import { IMessage } from "../../interfaces/message.interface";
import { IUser } from "../../interfaces/user.interface";
import {
  getDisplaySendMsgTime,
  getTimeDiff,
  TimeTypeOption,
} from "../../utils/messageTime.helper";
import SingleMsg from "./SingleMsg";

const GroupMsg = ({
  messages,
  timeString,
  receivers,
  sender,
}: {
  messages: IMessage[];
  timeString: string;
  sender: IUser;
  receivers: IUser[];
}) => {
  return (
    <div className="msg-group py-6">
      <div className="msg-time text-center text-gray-400 text-[0.75rem]">
        {getDisplaySendMsgTime(new Date(timeString))}
      </div>
      {messages.map((msg, index) => {
        const receiver = receivers.find((receiver) => receiver._id == msg.user);
        const isLongGap =
          index > 0 &&
          getTimeDiff(
            new Date(msg.createdAt!),
            new Date(messages[index - 1].createdAt!),
            TimeTypeOption.MINUTES
          ) > 4;

        let msgSenderAvatar;

        if (
          receiver &&
          ((index + 1 < messages.length &&
            messages[index + 1].user != receiver._id) ||
            index == messages.length - 1)
        )
          msgSenderAvatar = receiver.avatar ?? "";
        else msgSenderAvatar = "";

        return (
          <SingleMsg
            key={msg._id}
            isSentMsg={msg.user == sender._id}
            isLongGap={isLongGap}
            body={msg.msgBody}
            fullname={receivers[0].fullname}
            msgSenderAvatar={msgSenderAvatar}
            sendTime={getDisplaySendMsgTime(new Date(msg.createdAt ?? ""))}
          ></SingleMsg>
        );
      })}
    </div>
  );
};

export { GroupMsg };
