import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { Dot, MoreHorizontal } from "lucide-react";
import { IChat } from "../../interfaces/chat.interface";
import { IMessage } from "../../interfaces/message.interface";
import { IUser } from "../../interfaces/user.interface";
import { getDisplayTimeDiff } from "../../utils/messageTime.helper";
import { Skeleton } from "../ui/skeleton";
import { strimMessageBody } from "../../utils/messageText.helper";
import { Button } from "../ui/button";
import MessageStatus from "../../enums/MessageStatus.enum";

const ChatRow = ({
  userId,
  chat,
  lastMsg,
  isActive,
}: {
  userId: string;
  chat: IChat;
  lastMsg: IMessage | undefined;
  isActive: boolean;
}) => {
  const [lastUser, setLastUser] = useState<IUser>();
  const [isHover, setHover] = useState<boolean>(false);

  useEffect(() => {
    if (chat != undefined && lastMsg != undefined) {
      if (typeof chat.users == "object") {
        setLastUser(chat.users.find((user) => user._id == lastMsg?.user)!);
      }
    }
  }, [chat]); 

  return (
    <NavLink to={`/m/${chat._id}`} className={`chat-box w-full h-18 relative`}>
      <div
        className={`flex items-center px-2 py-4 rounded-2xl ${
          isActive ? "bg-gray-400 cursor-default" : "hover:bg-gray-200"
        }`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div
          className="w-12 h-12 rounded-full bg-contain bg-no-repeat bg-center"
          style={{ backgroundImage: `url(${chat.chatAvatar})` }}
        ></div>
        <div className="flex-auto px-2 flex flex-col items-baseline space-y-1">
          <div className="font-bold">{chat.chatName}</div>
          <div className="text-gray-500 text-[0.75rem] flex items-center w-full">
            {lastMsg == undefined && (
              <Skeleton className="w-[180px] h-4"></Skeleton>
            )}
            <div className="">
              {lastMsg && lastMsg.user == userId && "You:"}{" "}
              {lastMsg &&
                (lastMsg.msgBody.length > 15
                  ? strimMessageBody(lastMsg.msgBody, 15)
                  : lastMsg.msgBody)}
            </div>
            <div className="flex items-center">
              {lastMsg && <Dot size={12}></Dot>}
              {lastMsg &&
                getDisplayTimeDiff(new Date(lastMsg?.createdAt ?? ""))}
            </div>
          </div>
        </div>
        {/* Hien thi avatar nhung nguoi da seen tin nhan  */}
        {lastMsg &&
          lastMsg.user == userId &&
          lastMsg.status == MessageStatus.SEEN && (
            <div
              className="w-4 h-4 rounded-full bg-contain bg-no-repeat bg-center"
              style={{ backgroundImage: `url(${lastUser && lastUser.avatar})` }}
            ></div>
          )}

        {/* Hien thi thong bao chua doc tin nhan */}
        {lastMsg &&
          lastMsg.user != userId &&
          !lastMsg.seenList.includes(userId) && (
            <div className="w-4 h-4 rounded-full bg-contain bg-no-repeat bg-center bg-blue-600"></div>
          )}
      </div>
      {isHover && (
        <Button
          variant={"secondary"}
          className="absolute rounded-full h-8 w-8 right-7 top-[50%] translate-y-[-50%] bg-gray-300 hover:bg-gray-500 shadow-xl cursor-pointer"
          onMouseEnter={() => setHover(true)}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <MoreHorizontal></MoreHorizontal>
        </Button>
      )}
    </NavLink>
  );
};

export default ChatRow;
