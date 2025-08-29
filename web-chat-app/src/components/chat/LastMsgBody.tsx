import MessageStatus from "@/enums/MessageStatus.enum";
import MessageType from "@/enums/MessageType.enum";
import { IChat } from "@/interfaces/chat.interface";
import { IMessage } from "@/interfaces/messages/message.interface";
import { IUser } from "@/interfaces/user.interface";
import { strimText } from "@/utils/text.helper";

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
        content = `${
          chat.chatType == "GROUP" || name == "You" ? `${name}: ` : ""
        } ${lastMsg.msgBody}`;
        break;

      case MessageType.FILE:
        content = name + ": sent a file";
        break;

      case MessageType.AUDIO_CALL:
      case MessageType.VIDEO_CALL:
        if (lastMsg.endedCallAt) content = `You and your friends have a call`;
        else
          content = `${name == "You" ? "Your friend" : "You"} missed ${
            name == "You" ? "your" : name
          } call`;
        break;

      case MessageType.SYSTEM:
        const systemLog = lastMsg.systemLog!;
        const targetName = systemLog.targetUserId
          ? systemLog.targetUserId
              .split(",")
              .map((id) =>
                chat.usersInfo[id]
                  ? chat.usersInfo[id].fullname.split(" ")[0]
                  : "undefined user"
              )
              .join(",")
          : ""; // targetUserId co the o dang id1,id2,id3,...

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

        if (systemLog.type == "reaction") {
          content = name + " react " + "your message";
          break;
        }

        if (systemLog.type == "chatEmoji") {
          content = name + " change emote to " + systemLog.value;
          break;
        }
    }

  content = content.length > 25 ? strimText(content, 25) : content;

  return <div className="">{content}</div>;
};

export default LastMsgBody;
