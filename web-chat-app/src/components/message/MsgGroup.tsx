import { IMessage } from "../../interfaces/messages/message.interface";
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
  isFirstGroup,
  handleReplyMsg,
}: {
  messages: IMessage[];
  timeString: string;
  sender: IUser;
  receivers: { [userId: string]: IUser };
  isFirstGroup: boolean;
  handleReplyMsg: (msg: IMessage) => void;
}) => {
  const isGroupMsgHidden =
    messages.filter((msg) => !msg.isHiddenFor?.includes(sender.id)).length == 0;

  if (isGroupMsgHidden) return <></>;

  return (
    <div className="msg-group py-4">
      <div className="msg-time text-center text-gray-400 text-[0.75rem]">
        {getDisplaySendMsgTime(new Date(timeString))}
      </div>
      <div className="flex flex-col-reverse gap-4">
        {messages.map((msg, index) => {
          const receiver = receivers[msg.user.toString()];

          const seenList = Object.values(receivers).filter((receiver) =>
            Object.keys(msg.seenList).includes(receiver.id)
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
            ((index > 0 && messages[index - 1].user != receiver.id) ||
              index == 0)
          )
            msgSenderAvatar = receiver.avatar ?? "";
          else msgSenderAvatar = "";

          if (msg.isHiddenFor?.includes(sender.id)) return <></>;

          return (
            <SingleMsg
              key={msg.id}
              msg={msg}
              isSentMsg={msg.user == sender.id}
              senderId={sender.id}
              isLongGap={isLongGap}
              msgSenderAvatar={msgSenderAvatar}
              isFirstMsg={isFirstGroup && index == 0}
              seenList={seenList}
              receivers={receivers}
              handleReplyMsg={handleReplyMsg}
            ></SingleMsg>
          );
        })}
      </div>
    </div>
  );
};

export { GroupMsg };
