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
      <div className="flex flex-col-reverse">
        {messages.map((msg, index) => {
          const receiver = receivers.find(
            (receiver) => receiver._id == msg.user
          );
          const isLongGap =
            index < messages.length - 1 &&
            getTimeDiff(
              new Date(msg.createdAt!),
              new Date(messages[index + 1].createdAt!),
              TimeTypeOption.MINUTES
            ) > 4;

          let msgSenderAvatar;

          if (
            receiver &&
            ((index > 0 && messages[index - 1].user != receiver._id) ||
              index == 0)
          )
            msgSenderAvatar = receiver.avatar ?? "";
          else msgSenderAvatar = "";

          return (
            <SingleMsg
              key={msg._id}
              msg={msg}
              isSentMsg={msg.user == sender._id}
              isLongGap={isLongGap}
              fullname={receivers[0].fullname}
              msgSenderAvatar={msgSenderAvatar}
            ></SingleMsg>
          );
        })}
      </div>
    </div>
  );
};

export { GroupMsg };
