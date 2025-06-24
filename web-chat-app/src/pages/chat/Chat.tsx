import { useEffect } from "react";

import { useParams } from "react-router-dom";
import ChatDetails from "./ChatDetails";
import ChatList from "./ChatList";
import ChatIndex from "./ChatIndex";
import { useGetChats } from "../../hooks/chat.hook";
import Cookies from "js-cookie";
import { useGetLastMessages } from "../../hooks/message.hook";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import { CHAT_CHANGED_SUB } from "../../services/chatService";

const Chat = () => {
  const { id } = useParams();
  const userId = Cookies.get("userId") ?? "";

  const {
    data: chats,
    loading: isChatsLoading,
    subscribeToMore,
  } = useGetChats(userId);

  const {
    data: lastMessges,
    loading: isLastMsgLoading,
    refetch,
  } = useGetLastMessages(userId, chats == undefined);

  loadErrorMessages();
  loadDevMessages();

  useEffect(() => {
    if (chats) {
      const unsubscribe = subscribeToMore({
        document: CHAT_CHANGED_SUB,
        variables: { userId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData) return prev;

          return subscriptionData.data;
        },
      });

      refetch();

      return () => {
        unsubscribe();
      };
    }
  }, [chats]);

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
