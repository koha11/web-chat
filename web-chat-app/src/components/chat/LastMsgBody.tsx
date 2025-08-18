import MessageStatus from "@/enums/MessageStatus.enum";
import MessageType from "@/enums/MessageType.enum";
import { IChat } from "@/interfaces/chat.interface";
import { IMessage } from "@/interfaces/messages/message.interface";
import { IUser } from "@/interfaces/user.interface";
import { getDisplayTimeDiff } from "@/utils/messageTime.helper";
import { strimText } from "@/utils/text.helper";
import { Dot } from "lucide-react";

const LastMsgBody = ({
  chat,
  lastMsg,
  userId,
}: {
  lastMsg: IMessage;
  userId: string;
  chat: IChat;
}) => {
  const name =
    lastMsg &&
    (lastMsg.user == userId
      ? "You"
      : (chat.users as IUser[])
          .find((user) => user.id == lastMsg.user)
          ?.fullname.split(" ")[0]);

  let content = "";

  if (lastMsg.status == MessageStatus.UNSEND)
    content = name + ": deleted a message";
  else
    switch (lastMsg.type) {
      case MessageType.AUDIO:
        content = name + ": sent a voice";
        break;

      case MessageType.VIDEO:
        content = name + ": sent a video";
        break;

      case MessageType.IMAGE:
        content = name + ": sent a image";
        break;

      case MessageType.TEXT:
        content = name + ": " + lastMsg.msgBody;
        break;

      case MessageType.FILE:
        content = name + ": sent a file";
        break;

      case MessageType.SYSTEM:
        const systemLog = lastMsg.systemLog!;
        const targetName = systemLog.targetUserId
          ? systemLog.targetUserId == userId
            ? "you"
            : chat.usersInfo[systemLog.targetUserId].fullname.split(" ")[0]
          : "";

        if (systemLog.type == "add") {
          content = name + " add " + targetName + " into the group";
          break;
        }

        if (systemLog.type == "chatname") {
          content = name + " change the chat name to " + systemLog.value;
          break;
        }

        if (systemLog.type == "leave") {
          content = name + " leave the chat";
          break;
        }

        if (systemLog.type == "create") {
          content = name + " create the chat";
          break;
        }

        if (systemLog.type == "avatar") {
          content = name + " change the chat avatar";
          break;
        }

        if (systemLog.type == "nickname") {
          content =
            name +
            " change nickname of " +
            targetName +
            " to " +
            systemLog.value;
          break;
        }

        if (systemLog.type == "remove") {
          content = name + " remove " + targetName + " from the group ";
          break;
        }
    }

  content = content.length > 25 ? strimText(content, 25) : content;

  return <div className="">{content}</div>;
};

export default LastMsgBody;
