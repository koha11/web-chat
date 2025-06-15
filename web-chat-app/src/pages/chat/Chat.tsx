import { useEffect, useState } from "react";

import { Link, Outlet, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { Contact, LogOut, User } from "lucide-react";
import ChatRow from "../../components/ChatRow";
import { IChat } from "../../interfaces/chat.interface";
import { fetchChatListEvent } from "../../services/chatService";
import { listenReceiveMessage } from "../../services/messageService";
import WebSocketConnection from "../../services/WebSocketConnection";
import ChatDetails from "./ChatDetails";
import ChatList from "./ChatList";

const Chat = () => {
  const { chatId } = useParams();

  const [chatList, setChatList] = useState<IChat[]>([]);
  const [userId, setUserId] = useState("");

  const socket = WebSocketConnection.getConnection();

  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id + " is on connect ...");

      const userId = (socket.auth as { [key: string]: any })["userId"];
      setUserId(userId);

      fetchChatListEvent(socket, setChatList);

      listenReceiveMessage(socket);
    });

    // return () => {
    //   socket.off("receive_message");
    // };
  }, []);

  return (
    <div className="flex justify-center text-black h-[100vh]">
      <div className="container flex bg-white gap-4 py-4">
        <ChatList chatList={chatList} userId={userId}></ChatList>
        <ChatDetails chatId={chatId ?? ""}></ChatDetails>
      </div>
    </div>
  );
};

export default Chat;
