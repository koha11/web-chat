import { IMessage } from "@/interfaces/messages/message.interface";
import { IUser } from "@/interfaces/user.interface";

const SystemMsg = ({
  msg,
  userId,
  usersMap,
}: {
  usersMap: { [userId: string]: IUser };
  msg: IMessage;
  userId: string;
}) => {
  if (!msg.systemLog) throw new Error("msg nay ko co system log");

  const logType = msg.systemLog.type;
  const userName = usersMap[msg.user.toString()].fullname.split(" ")[0];
  const targetName = msg.systemLog.targetUserId
    ? usersMap[msg.systemLog.targetUserId].fullname.split(" ")[0]
    : "";
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
          {`${isCurrentUser ? "You" : userName} create chat`}
        </div>
      );
  }
};

export default SystemMsg;
