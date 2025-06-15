import { NavLink } from "react-router-dom";
import { IChat } from "../interfaces/chat.interface";
import { IUser } from "../interfaces/user.interface";

const ChatRow = ({ userId, chat }: { userId: string; chat: IChat }) => {
  const myUsers = chat.users as IUser[];

  chat.chatAvatar =
    chat.chatAvatar == ""
      ? myUsers.find((user) => user._id != userId)!.avatar!
      : chat.chatAvatar;

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
        <div className="text-gray-500 text-[0.75rem]">{""} ·2 giờ</div>{" "}
      </div>
      <div
        className="w-6 h-6 rounded-full bg-contain bg-no-repeat bg-center"
        style={{ backgroundImage: `url(${chat.chatAvatar})` }}
      ></div>
    </NavLink>
  );
};

export default ChatRow;
