import { useEffect, useState } from "react";
import { getData } from "../services/api";
import { ChatRowProps, ChatRow } from "../components/ChatRow";
import { Link, Outlet } from "react-router-dom";
import WebSocketConnection from "./../services/WebSocketConnection";
import { Modal, Ripple, initTWE } from "tw-elements";
import { fetchChatListEvent } from "../services/chatService";
import Cookies from "js-cookie";
import { Socket } from "socket.io-client";
import { listenReceiveMessage } from "../services/messageService";

const ChatLayout = () => {
  const [chatList, setChatList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [message, setMessage] = useState("");

  const socket = WebSocketConnection.getConnection();

  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id + " is on connect ...");

      fetchChatListEvent(socket);

      listenReceiveMessage(socket);
    });

    // return () => {
    //   socket.off("receive_message");
    // };
  }, []);

  return (
    <div className="flex justify-center text-black h-[100vh]">
      <div className="container flex bg-white gap-4 py-4">
        <section
          className="w-[25%] h-full p-2 bg-white rounded-2xl"
          style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0 0 5px 2px" }}
        >
          <div className="flex justify-between items-center h-[10%] px-2">
            <h1 className="text-2xl font-bold">Đoạn chat</h1>
            <div className="text-xl">
              <Link to="/me" className="mr-2">
                <i className="bx bxs-contact p-2 rounded-full bg-gray-200 hover:opacity-50"></i>
              </Link>
              <button
                onClick={() => {
                  const myMsg = new Date().toString();
                  socket.emit("send-message", myMsg);
                  setMessage(myMsg);
                }}
              >
                test
              </button>
              <a
                href="/"
                className="mr-2"
                onClick={() => {
                  const token = Cookies.get("accessToken");

                  if (token) Cookies.remove("accessToken");
                }}
              >
                <i className="bx bxs-edit p-2 rounded-full bg-gray-200 ho ver:opacity-50"></i>
              </a>
              <Link to="/contact" className="mr-2">
                <i className="bx bxs-contact p-2 rounded-full bg-gray-200 hover:opacity-50"></i>
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

          <nav id="chat-box-list" className="h-[75%] overflow-y-scroll">
            {chatList.map((chat: ChatRowProps) => (
              <ChatRow
                chatName="test"
                key={chat.id}
                id={chat.id}
                user={chat.user}
                lastMessage={chat.lastMessage}
              ></ChatRow>
            ))}
            <div>{message}</div>
          </nav>
        </section>
        <Outlet />
      </div>
    </div>
  );
};

export default ChatLayout;
