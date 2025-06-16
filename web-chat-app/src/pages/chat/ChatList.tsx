import { User, LogOut, Contact } from "lucide-react";
import { Link } from "react-router-dom";
import { IChat } from "../../interfaces/chat.interface";
import Cookies from "js-cookie";
import { useState } from "react";
import Loading from "../../components/ui/loading";
import ChatRow from "../../components/chat/ChatRow";

const ChatList = ({
  chatList,
  userId,
}: {
  chatList: IChat[];
  userId: string;
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
        className="h-[75%] overflow-y-scroll flex flex-col gap-2"
      >
        {chatList.length == 0 ? (
          <div className="flex items-center justify-center">
            <Loading></Loading>
          </div>
        ) : (
          chatList.map((chat: IChat) => (
            <ChatRow chat={chat} userId={userId} key={chat._id}></ChatRow>
          ))
        )}
      </nav>
    </section>
  );
};

export default ChatList;
