import { useEffect } from "react";

import { useOutletContext, useParams } from "react-router-dom";
import ChatDetails from "./ChatDetails";
import ChatList from "./ChatList";
import ChatIndex from "./ChatIndex";
import { useGetChats } from "../../hooks/chat.hook";
import Cookies from "js-cookie";
import { useGetLastMessages } from "../../hooks/message.hook";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import { CHAT_CHANGED_SUB, GET_CHATS } from "../../services/chatService";
import { useApolloClient } from "@apollo/client";
import { Edge } from "../../interfaces/modelConnection.interface";
import { IChat } from "../../interfaces/chat.interface";
import { GET_MESSAGES } from "../../services/messageService";

const Chat = () => {
  const { id } = useParams();
  const userId = Cookies.get("userId") ?? "";

  const {
    chats,
    isChatsLoading,
    subscribeToMore,
    lastMessges,
    isLastMsgLoading,
    refetch,
    updatedChatMap,
    setUpdatedChatMap,
  } = useOutletContext<any>();

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
            chat={
              chats && chats.edges.find((edge: any) => edge.node.id == id)?.node
            }
            chatId={id}
            hasUpdated={updatedChatMap[id] ?? true}
            setUpdatedChatMap={setUpdatedChatMap}
          ></ChatDetails>
        )}
      </div>
    </div>
  );
};

export default Chat;
