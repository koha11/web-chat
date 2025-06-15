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
import ChatIndex from "./ChatIndex";
import { IMessage } from "../../interfaces/message.interface";
import Loading from "../../components/ui/loading";

const Chat = () => {
  const { id } = useParams();
  const [chatList, setChatList] = useState<IChat[] | undefined>();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [currChat, setCurrChat] = useState<IChat | undefined>();

  const [userId, setUserId] = useState("");

  const socket = WebSocketConnection.getConnection();

  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id + " is on connect ...");

      const userId = (socket.auth as { [key: string]: any })["userId"];
      setUserId(userId);

      fetchChatListEvent(socket, setChatList);
      listenReceiveMessage(socket, (msg: IMessage) =>
        setMessages((messages) => [...messages, msg])
      );
    });

    // return () => {
    //   socket.off("receive_message");
    // };
  }, []);

  useEffect(() => {
    if (chatList != null && id != undefined) {
      const myCurrChat = chatList!.find((chat) => chat._id == id);

      setCurrChat(myCurrChat);

      console.log(chatList);

      if (typeof myCurrChat!.messages == "object")
        setMessages(myCurrChat!.messages);
    }
  }, [id, chatList]);

  if (chatList == null) return <Loading></Loading>;

  if (id != null && currChat == null) return <Loading></Loading>;

  // HANLDERs
  const handleSendMessage = (msg: IMessage) => {
    socket.emit("send-message", msg);
  };

  return (
    <div className="flex justify-center text-black h-[100vh]">
      <div className="container flex bg-white gap-4 py-4">
        <ChatList chatList={chatList} userId={userId}></ChatList>
        {id == undefined ? (
          <ChatIndex></ChatIndex>
        ) : (
          <ChatDetails
            handleSendMessage={handleSendMessage}
            messages={messages}
            userId={userId}
            chat={currChat!}
            setChat={setCurrChat}
          ></ChatDetails>
        )}
      </div>
    </div>
  );
};

export default Chat;
