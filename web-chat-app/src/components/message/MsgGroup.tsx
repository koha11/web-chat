import { IMessage } from "../../interfaces/messages/message.interface";
import { IUser } from "../../interfaces/user.interface";
import {
  getDisplaySendMsgTime,
  getTimeDiff,
  TimeTypeOption,
} from "../../utils/messageTime.helper";
import SingleMsg from "./SingleMsg";

const GroupMsg = ({
  userId,
  messages,
  timeString,
  usersMap,
  isFirstGroup,
  handleReplyMsg,
}: {
  userId: string;
  messages: IMessage[];
  timeString: string;
  usersMap: { [userId: string]: IUser };
  isFirstGroup: boolean;
  handleReplyMsg: (msg: IMessage) => void;
}) => {
  const isGroupMsgHidden =
    messages.filter((msg) => !msg.isHiddenFor?.includes(userId)).length == 0;

  if (isGroupMsgHidden) return;

  return (
    <div className="msg-group py-2" key={timeString}>
      <div className="msg-time text-center text-gray-400 text-[0.75rem]">
        {getDisplaySendMsgTime(new Date(timeString))}
      </div>
      <div className="flex flex-col-reverse gap-2">
        {messages.map((msg, index) => {
          const isRemovedMsg = msg.isHiddenFor?.includes(userId);

          if (isRemovedMsg) return <></>;

          const user = usersMap[msg.user.toString()];

          const seenList = Object.values(usersMap).filter((user) =>
            Object.keys(msg.seenList).includes(user.id)
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
            msg.user != userId &&
            user &&
            ((index > 0 && messages[index - 1].user != user.id) || index == 0)
          )
            msgSenderAvatar = user.avatar ?? "";
          else msgSenderAvatar = "";

          return (
            <SingleMsg
              key={msg.id}  
              msg={msg}
              isSentMsg={msg.user == userId}
              userId={userId}
              isLongGap={isLongGap}
              msgSenderAvatar={msgSenderAvatar}
              isFirstMsg={isFirstGroup && index == 0}
              seenList={seenList}
              usersMap={usersMap}
              handleReplyMsg={handleReplyMsg}
            ></SingleMsg>
          );
        })}
      </div>
    </div>
  );
};

export { GroupMsg };
