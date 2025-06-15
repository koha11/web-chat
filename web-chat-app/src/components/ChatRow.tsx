import { NavLink } from "react-router-dom";
import { IChat } from "../interfaces/chat.interface";
import { IUser } from "../interfaces/user.interface";
import { IMessage } from "../interfaces/message.interface";
import { useEffect, useState } from "react";
import Loading from "./ui/loading";
import { getDisplayTimeDiff } from "../utils/messageTime.helper";
import { Dot } from "lucide-react";

const ChatRow = ({ userId, chat }: { userId: string; chat: IChat }) => {
  const [lastMsg, setLastMsg] = useState<IMessage>();
  const [lastUser, setLastUser] = useState<IUser>();

  useEffect(() => {
    if (chat != undefined) {
      const myLastMsg = chat.messages[chat.messages.length - 1] as IMessage;

      if (typeof chat.messages == "object" && myLastMsg != null) {
        setLastMsg(() => myLastMsg ?? undefined);
      }
      console.log(myLastMsg);

      // if (myLastMsg == undefined) {
      //   setLastUser({});
      // }

      if (typeof chat.users == "object") {
        setLastUser(chat.users.find((user) => user._id == myLastMsg?.user)!);
      }
    }
  }, [chat]);

  // if (lastMsg == undefined || lastUser == undefined) return <Loading></Loading>;

  return (
    <NavLink
      to={`/m/${chat._id}`}
      className={({ isActive }) =>
        isActive
          ? "chat-box flex w-full items-center h-18 p-4 rounded-2xl bg-gray-400 cursor-default"
          : "chat-box flex w-full items-center h-18 hover:bg-gray-200 p-4 rounded-2xl"
      }
    >
      <div
        className="w-12 h-12 rounded-full bg-contain bg-no-repeat bg-center"
        style={{ backgroundImage: `url(${chat.chatAvatar})` }}
      ></div>
      <div className="flex-auto px-4 flex flex-col items-baseline">
        <div className="font-bold">{chat.chatName}</div>
        <div className="text-gray-500 text-[0.75rem] flex items-center">
          {lastMsg && lastMsg.user == userId && "You:"}{" "}
          {lastMsg && lastMsg.msgBody} {lastMsg && <Dot size={12}></Dot>}
          {lastMsg && getDisplayTimeDiff(new Date(lastMsg?.createdAt ?? ""))}
        </div>{" "}
      </div>
      {lastMsg && lastMsg.user != userId && (
        <div
          className="w-6 h-6 rounded-full bg-contain bg-no-repeat bg-center"
          style={{ backgroundImage: `url(${lastUser && lastUser.avatar})` }}
        ></div>
      )}
    </NavLink>
  );
};

export default ChatRow;
