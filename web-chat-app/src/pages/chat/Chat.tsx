import { useEffect, useRef, useState } from "react";

import { useParams } from "react-router-dom";
import { IChat } from "../../interfaces/chat.interface";
import { fetchChatListEvent } from "../../services/chatService";
import { listenReceiveMessage } from "../../services/messageService";
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
  const [messages, setMessages] = useState<IMessageGroup[]>([]);
  const [currChat, setCurrChat] = useState<IChat | undefined>();
  const [isScrollBottom, setScrollBottom] = useState(false);
  const [userId, setUserId] = useState("");

  const socket = WebSocketConnection.getConnection();

  // useRef
  const msgsContainerRef = useRef<HTMLDivElement>(null);

  // HANLDERs
  const handleSendMessage = (msg: IMessage, chatId: string) => {
    socket.emit(MY_SOCKET_EVENTS[SocketEvent.sm], msg, chatId);
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

      listenReceiveMessage(
        socket,
        (msgGroup: IMessageGroup) => {
          setMessages((messages) => [...messages, msgGroup]);
        },
        messages[messages.length - 1] ?? undefined
      );
    });

    return () => {
      Object.values(MY_SOCKET_EVENTS).forEach((event) => socket.off(event));
    };
  }, []);

  useEffect(() => {
    if (chatList != null && id != undefined) {
      const myCurrChat = chatList!.find((chat) => chat._id == id);

      setCurrChat(myCurrChat);

      if (typeof myCurrChat!.messages == "object") {

        // Group cac tin nhan theo thoi gian gui
        const grouped = myCurrChat!.messages.reduce<IMessageGroup[]>(
          (acc, msg) => {
            const time = new Date(msg.createdAt!);
            const last = acc[acc.length - 1];

            if (
              last &&
              getTimeDiff(
                time,
                new Date(last.timeString),
                TimeTypeOption.MINUTES
              ) < 20
            ) {
              last.messages.push(msg);
            } else {
              acc.push({ timeString: time.toISOString(), messages: [msg] });
            }

            return acc;
          },
          []
        );

        setMessages(grouped);
      }

      console.log(chatList);

      setScrollBottom(!isScrollBottom);
    }
  }, [id, chatList]);

  useEffect(() => {
    handleScrollToBot();
  }, [isScrollBottom]);

  useEffect(() => {
    setScrollBottom(!isScrollBottom);
  }, [messages]);

  // Wait data

  if (chatList == null) return <Loading></Loading>;

  if (id != null && currChat == null) return <Loading></Loading>;

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
            msgsContainerRef={msgsContainerRef}
            setScrollBottom={() => setScrollBottom(!isScrollBottom)}
          ></ChatDetails>
        )}
      </div>
    </div>
  );
};

export default Chat;
