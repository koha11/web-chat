import { IChatUsersInfo } from "@/interfaces/chat.interface";
import { IMessage } from "../../interfaces/messages/message.interface";
import { IUser } from "../../interfaces/user.interface";
import {
  getDisplaySendMsgTime,
  getTimeDiff,
  TimeTypeOption,
} from "../../utils/messageTime.helper";
import SingleMsg from "./SingleMsg";
import { useNavigate } from "react-router-dom";
import { useChatDetailContext } from "@/hooks/useChatDetailContext";

const GroupMsg = ({
  messages,
  timeString,
  isFirstGroup,
}: {
  messages: IMessage[];
  timeString: string;
  isFirstGroup: boolean;
}) => {
  const { userId, usersMap } = useChatDetailContext();

  const isGroupMsgHidden =
    messages.filter((msg) => !msg.isHiddenFor?.includes(userId)).length == 0 ||
    messages.filter(
      (msg) => !(msg.systemLog && msg.systemLog.type == "reaction")
    ).length == 0;

  if (isGroupMsgHidden) return;

  return (
    <div className="msg-group py-2" key={timeString}>
      <div className="msg-time text-center text-gray-400 text-[0.75rem] py-2">
        {getDisplaySendMsgTime(new Date(timeString))}
      </div>

      <div className="flex flex-col-reverse gap-2">
        {messages.map((msg, index) => {
          const isRemovedMsg = msg.isHiddenFor?.includes(userId);

          if (isRemovedMsg) return <></>;

          const user = usersMap[msg.user.toString()];

          const isLongGap =
            index < messages.length - 1 &&
            getTimeDiff({
              firstTime: msg.createdAt!,
              secondTime: messages[index + 1].createdAt!,
              option: TimeTypeOption.MINUTES,
            }) > 4;

          let msgSenderAvatar;

          if (
            msg.user != userId &&
            ((index > 0 && messages[index - 1].user != msg.user.toString()) ||
              index == 0 ||
              msg.isForwarded ||
              msg.replyForMsg)
          )
            msgSenderAvatar = user
              ? user.avatar
              : "/assets/images/default-user.png";
          else msgSenderAvatar = "";

          return (
            <SingleMsg
              key={msg.id}
              msg={msg}
              isLongGap={isLongGap}
              msgSenderAvatar={msgSenderAvatar}
              isFirstMsg={isFirstGroup && index == 0}
            ></SingleMsg>
          );
        })}
      </div>
    </div>
  );
};

export { GroupMsg };
