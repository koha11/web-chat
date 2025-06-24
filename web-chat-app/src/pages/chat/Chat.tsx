import { useEffect, useRef, useState } from "react";

import { useParams } from "react-router-dom";
import { IChat } from "../../interfaces/chat.interface";
import {
  fetchLastMessageEvent,
  fetchMessagesEvent,
  GET_MESSAGES,
  listenReceiveMessage,
  INIT_LAST_MESSAGE_SUB,
  RequestFetchMessages,
  RECEIVE_MESSAGE_SUB,
} from "../../services/messageService";
import ChatDetails from "./ChatDetails";
import ChatList from "./ChatList";
import ChatIndex from "./ChatIndex";
import { IMessage } from "../../interfaces/message.interface";
import Loading from "../../components/ui/loading";
import MY_SOCKET_EVENTS from "../../constants/MY_SOCKET_EVENTS";
import SocketEvent from "../../enums/SocketEvent.enum";
import IMessageGroup from "../../interfaces/messageGroup.interface";
import { useGetChats } from "../../hooks/chat.hook";
import Cookies from "js-cookie";
import { useGetLastMessages, useGetMessages } from "../../hooks/message.hook";
import { useSubscription } from "@apollo/client";
import { client } from "../../apollo";
import IModelConnection from "../../interfaces/modelConnection.interface";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import { ITokenPayload } from "../../interfaces/auth/tokenPayload.interface";

const Chat = () => {
  const { id } = useParams();
  const userId = Cookies.get("userId") ?? "";

  const { data: chats, loading: isChatsLoading } = useGetChats(userId);

  const { data: lastMessges, loading: isLastMsgLoading } =
    useGetLastMessages(userId);

  loadErrorMessages();
  loadDevMessages();
  console.log(chats);
  
  return (
    <div className="flex justify-center text-black h-[100vh]">
      <div className="container flex bg-white gap-4 py-4">
        <ChatList
          currChatId={id ?? ""}
          lastMsgMap={lastMessges ?? {}}
          chatList={chats && chats.edges.map((edge: any) => edge.node)}
          isChatsLoading={isChatsLoading}
          isLastMsgLoading={isLastMsgLoading}
          userId={userId!}
        ></ChatList>
        {id == undefined ? (
          <ChatIndex></ChatIndex>
        ) : (
          <ChatDetails
            userId={userId}
            chat={chats && chats.edges.find((edge) => edge.node.id == id)?.node}
            chatId={id}
          ></ChatDetails>
        )}
      </div>
    </div>
  );
};

export default Chat;
