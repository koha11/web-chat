import { User, LogOut, Contact } from "lucide-react";
import { Link } from "react-router-dom";
import { IChat } from "../../interfaces/chat.interface";
import Cookies from "js-cookie";
import { useState } from "react";
import Loading from "../../components/ui/loading";
import ChatRow from "../../components/chat/ChatRow";
import { Skeleton } from "../../components/ui/skeleton";
import IMessageGroup from "../../interfaces/messageGroup.interface";

const ChatList = ({
  chatList,
  userId,
  messages,
  currChatId,
}: {
  chatList: IChat[] | undefined;
  userId: string;
  messages: {
    [chatId: string]: IMessageGroup[];
  };
  currChatId: string;
}) => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <section
      className="w-[25%] h-full p-2 bg-white rounded-2xl"
      style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0 0 5px 2px" }}
    >
      <div className="flex justify-between items-center h-[10%] px-2">
        <h1 className="text-2xl font-bold">Đoạn chat</h1>
        <div className="text-xl flex items-center gap-2">
          <Link
            to="/me"
            className="p-2 rounded-full bg-gray-200 hover:opacity-50"
          >
            <User></User>
          </Link>
          <Link
            to={"/login"}
            onClick={() => {
              const token = Cookies.get("accessToken");

              if (token) {
                Cookies.remove("accessToken");
                Cookies.remove("userId");
              }
            }}
            className="p-2 rounded-full bg-gray-200 hover:opacity-50"
          >
            <LogOut></LogOut>
          </Link>
          <Link
            to="/contact"
            className="p-2 rounded-full bg-gray-200 hover:opacity-50"
          >
            <Contact></Contact>
          </Link>
        </div>
      </div>
      <div className="h-[10%] flex items-center py-4 px-2">
        <form action="" className="relative w-full">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="rounded-3xl bg-gray-200 px-8 py-2 w-full text-gray-500"
            placeholder="Tìm kiếm đoạn chat"
          ></input>
          <i className="bx bx-search absolute left-3 top-[50%] translate-y-[-50%] text-gray-500"></i>
        </form>
      </div>

      <nav
        id="chat-box-list"
        className="h-[75%] overflow-y-scroll flex flex-col gap-6"
      >
        {chatList == undefined
          ? [1, 2, 3, 4, 5, 6].map(() => (
              <div
                className={
                  "chat-box flex w-full items-center h-18 p-4 rounded-2xl"
                }
              >
                <Skeleton className="w-12 h-12 rounded-full bg-contain bg-no-repeat bg-center"></Skeleton>
                <div className="flex-auto px-4 flex flex-col items-baseline space-y-2">
                  <Skeleton className="h-4 w-[100px]"></Skeleton>
                  <Skeleton className="h-4 w-[160px]"></Skeleton>
                </div>
              </div>
            ))
          : chatList.map((chat: IChat) => (
              <ChatRow
                chat={chat}
                userId={userId}
                key={chat._id}
                lastMsg={
                  messages[chat._id] == undefined ||
                  messages[chat._id].length == 0
                    ? undefined
                    : messages[chat._id][0].messages[0]
                }
                isActive={currChatId == chat._id}
              ></ChatRow>
            ))}
      </nav>
    </section>
  );
};

export default ChatList;
