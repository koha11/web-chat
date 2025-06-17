import { useEffect, useRef, useState } from "react";

import { useParams } from "react-router-dom";
import { IChat } from "../../interfaces/chat.interface";
import { fetchChatListEvent } from "../../services/chatService";
import {
  fetchLastMessageEvent,
  fetchMessagesEvent,
  listenReceiveMessage,
} from "../../services/messageService";
import WebSocketConnection from "../../services/WebSocketConnection";
import ChatDetails from "./ChatDetails";
import ChatList from "./ChatList";
import ChatIndex from "./ChatIndex";
import { IMessage } from "../../interfaces/message.interface";
import Loading from "../../components/ui/loading";
import MY_SOCKET_EVENTS from "../../constants/MY_SOCKET_EVENTS";
import SocketEvent from "../../enums/SocketEvent.enum";
import IMessageGroup from "../../interfaces/messageGroup.interface";
import { getTimeDiff, TimeTypeOption } from "../../utils/messageTime.helper";

const Chat = () => {
  const { id } = useParams();
  const [chatList, setChatList] = useState<IChat[] | undefined>();
  const [messages, setMessages] = useState<{
    [chatId: string]: IMessageGroup[];
  }>({});

  const [currChat, setCurrChat] = useState<IChat | undefined>();
  const [isScrollBottom, setScrollBottom] = useState(false);
  const [userId, setUserId] = useState("");

  const socket = WebSocketConnection.getConnection();

  // useRef
  const msgsContainerRef = useRef<HTMLDivElement>(null);
  const msgGroupListRef = useRef<IMessageGroup[]>(null);

  // HANLDERs
  const handleSendMessage = (msg: IMessage, chatId: string) => {
    socket.emit(SocketEvent.sm, msg, chatId);
  };

  const handleScrollToBot = () => {
    const msgListRef =
      msgsContainerRef.current?.querySelectorAll(".single-msg");

    msgListRef?.item(msgListRef.length - 1)?.scrollIntoView();
  };

  // useEffect

  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id + " is on connect ...");

      const userId = (socket.auth as { [key: string]: any })["userId"];
      setUserId(userId);

      fetchChatListEvent(socket, setChatList);
      fetchLastMessageEvent(socket, setMessages);

      fetchMessagesEvent(socket, setMessages);

      listenReceiveMessage(socket, setMessages);
    });

    return () => {
      Object.values(MY_SOCKET_EVENTS).forEach((event) => socket.off(event));
    };
  }, []);

  useEffect(() => {
    if (messages[id!] == undefined || messages[id!].length == 1)
      socket.emit(SocketEvent.fmr, id);
  }, [id]);

  useEffect(() => {
    if (chatList != null && id != undefined) {
      const myCurrChat = chatList!.find((chat) => chat._id == id);

      setCurrChat(myCurrChat);

      console.log(chatList);

      setScrollBottom(!isScrollBottom);
    }
  }, [id, chatList]);

  useEffect(() => {
    // handleScrollToBot();
  }, [isScrollBottom]);

  useEffect(() => {
    setScrollBottom(!isScrollBottom);
  }, [messages]);

  // Wait data

  // if (chatList == null) return <Loading></Loading>;

  if (id != null && currChat == null) return <Loading></Loading>;

  return (
    <div className="flex justify-center text-black h-[100vh]">
      <div className="container flex bg-white gap-4 py-4">
        <ChatList
          messages={messages}
          chatList={chatList}
          userId={userId}
        ></ChatList>
        {id == undefined ? (
          <ChatIndex></ChatIndex>
        ) : (
          <ChatDetails
            handleSendMessage={handleSendMessage}
            messages={messages[id]}
            userId={userId}
            chat={currChat!}
            setChat={setCurrChat}
            msgsContainerRef={msgsContainerRef}
            setScrollBottom={() => setScrollBottom(!isScrollBottom)}
          ></ChatDetails>
        )}
      </div>
    </div>
  );
};

export default Chat;
