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

const Chat = () => {
  const { id } = useParams();

  const [chatList, setChatList] = useState<IChat[] | undefined>();
  const [currentChat, setCurrentChat] = useState<IChat | undefined>();
  const [messages, setMessages] = useState<{
    [chatId: string]: IMessageGroup[];
  }>({});
  const [userId, setUserId] = useState("");
  const [isMsgLoading, setMsgLoading] = useState<boolean>(true);

  const socket = WebSocketConnection.getConnection();

  // useRef
  const msgsContainerRef = useRef<HTMLDivElement>(null);
  const msgGroupListRef = useRef<IMessageGroup[]>(null);

  // HANLDERs
  const handleSendMessage = (msg: IMessage, chatId: string) => {
    socket.emit(SocketEvent.sm, msg, chatId);
  };

  // useEffect

  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id + " is on connect ...");

      const userId = (socket.auth as { [key: string]: any })["userId"];
      setUserId(userId);

      fetchChatListEvent(socket, setChatList);

      fetchLastMessageEvent(socket, setMessages);

      fetchMessagesEvent(
        socket,
        (chatId: string, messageGroup: IMessageGroup[]) =>
          setMessages((messages: { [chatId: string]: IMessageGroup[] }) => {
            return { ...messages, [chatId]: messageGroup };
          }),
        setMsgLoading
      );

      listenReceiveMessage(socket, setMessages);
    });

    return () => {
      Object.values(MY_SOCKET_EVENTS).forEach((event) => socket.off(event));
    };
  }, []);

  useEffect(() => {
    if (messages[id!] == undefined) messages[id!] = [];

    if (messages[id!].length == 1 && isMsgLoading) {
      socket.emit(SocketEvent.fmr, id);
    }

    setCurrentChat(chatList?.find((chat) => chat._id == id));
  }, [id, messages]);

  if (userId == undefined || userId == "") return <Loading></Loading>;

  return (
    <div className="flex justify-center text-black h-[100vh]">
      <div className="container flex bg-white gap-4 py-4">
        <ChatList
          setMsgLoading={setMsgLoading}
          currChatId={id ?? ""}
          messages={messages}
          chatList={Object.values(chatList ?? {})}
          userId={userId}
        ></ChatList>
        {id == undefined ? (
          <ChatIndex></ChatIndex>
        ) : (
          <ChatDetails
            handleSendMessage={handleSendMessage}
            messages={messages[id]}
            userId={userId}
            chat={currentChat}
            msgsContainerRef={msgsContainerRef}
            isMsgLoading={isMsgLoading}
          ></ChatDetails>
        )}
      </div>
    </div>
  );
};

export default Chat;
