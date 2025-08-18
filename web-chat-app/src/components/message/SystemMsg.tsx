import { IChatUsersInfo } from "@/interfaces/chat.interface";
import { IMessage } from "@/interfaces/messages/message.interface";
import { IUser } from "@/interfaces/user.interface";

const SystemMsg = ({
  msg,
  userId,
  usersMap,
}: {
  usersMap: { [userId: string]: IChatUsersInfo };
  msg: IMessage;
  userId: string;
}) => {
  if (!msg.systemLog) throw new Error("msg nay ko co system log");

  const logType = msg.systemLog.type;
  const userName = usersMap[msg.user.toString()]
    ? usersMap[msg.user.toString()].fullname.split(" ")[0]
    : "undefined user";
  const myTargetName = msg.systemLog.targetUserId
    ? msg.systemLog.targetUserId
        .split(",")
        .map((id) =>
          usersMap[id] ? usersMap[id].fullname.split(" ")[0] : "undefined user"
        )
        .join(",")
    : ""; // targetUserId co the o dang id1,id2,id3,...

  const targetName = msg.systemLog.targetUserId ? myTargetName : "";
  const isCurrentUser = userId == msg.user.toString();
  const isCurrentTargetUser = msg.systemLog.targetUserId == msg.user.toString();

  switch (logType) {
    case "chatname":
      return (
        <div className={`text-center text-[0.75rem] text-gray-500`}>
          {`${isCurrentUser ? "You" : userName} change chat name to ${
            msg.systemLog.value
          }`}
        </div>
      );

    case "nickname":
      return (
        <div className={`text-center text-[0.75rem] text-gray-500`}>
          {`${isCurrentUser ? "You" : userName} change ${
            isCurrentTargetUser ? "your" : targetName
          } nickname to ${msg.systemLog.value}`}
        </div>
      );

    case "avatar":
      return (
        <div className={`text-center text-[0.75rem] text-gray-500`}>
          {`${isCurrentUser ? "You" : userName} change chat avatar`}
        </div>
      );

    case "create":
      return (
        <div className={`text-center text-[0.75rem] text-gray-500`}>
          {`${isCurrentUser ? "You" : userName} create chat`}
        </div>
      );

    case "add":
      return (
        <div className={`text-center text-[0.75rem] text-gray-500`}>
          {`${isCurrentUser ? "You" : userName} add ${targetName} into chat`}
        </div>
      );

    case "leave":
      return (
        <div className={`text-center text-[0.75rem] text-gray-500`}>
          {`${isCurrentUser ? "You" : userName} leave group`}
        </div>
      );

    case "remove":
      return (
        <div className={`text-center text-[0.75rem] text-gray-500`}>
          {`${isCurrentUser ? "You" : userName} remove ${
            isCurrentTargetUser ? "You" : targetName
          } from the group`}
        </div>
      );
  }
};

export default SystemMsg;
