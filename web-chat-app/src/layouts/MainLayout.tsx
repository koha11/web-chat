import { useApolloClient } from "@apollo/client";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useGetChats } from "../hooks/chat.hook";
import { useGetLastMessages } from "../hooks/message.hook";
import { IChat } from "../interfaces/chat.interface";
import IModelConnection, {
  Edge,
} from "../interfaces/modelConnection.interface";
import { CHAT_CHANGED_SUB, GET_CHATS } from "../services/chatService";
import { GET_LAST_MESSAGES, GET_MESSAGES } from "../services/messageService";
import Cookies from "js-cookie";
import { set } from "mongoose";

const Mainlayout = () => {
  const userId = Cookies.get("userId") ?? "";

  const {
    data: chats,
    loading: isChatsLoading,
    subscribeToMore,
  } = useGetChats({ userId });

  const {
    data: lastMessges,
    loading: isLastMsgLoading,
    refetch,
  } = useGetLastMessages({ userId, isFetch: chats == undefined });

  const [updatedChatMap, setUpdatedChatMap] = useState<{
    [chatId: string]: boolean;
  }>({});

  loadErrorMessages();
  loadDevMessages();

  useEffect(() => {
    if (chats) {
      const unsubscribe = subscribeToMore({
        document: CHAT_CHANGED_SUB,
        variables: { userId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData) return prev;

          const chatChanged = subscriptionData.data.chatChanged as IChat;

          setUpdatedChatMap((old) => {
            return {
              ...old,
              [chatChanged.id]: true,
            };
          });

          const edges = prev.chats.edges.filter(
            (edge: Edge<IChat>) => edge.cursor != chatChanged.id
          );

          return {
            ...prev,
            chats: {
              ...prev.chats,
              edges: [{ node: chatChanged, cursor: chatChanged.id }, ...edges],
              pageInfo: {
                ...prev.chats.pageInfo,
                startCursor: chatChanged.id,
                endCursor: edges[edges.length - 1].cursor,
              },
            },
          } as { chats: IModelConnection<IChat> };
        },
      });

      refetch();

      return () => {
        unsubscribe();
      };
    }
  }, [chats, subscribeToMore]);

  return (
    <Outlet
      context={{
        chats,
        isChatsLoading,
        subscribeToMore,
        lastMessges,
        isLastMsgLoading,
        refetch,
        updatedChatMap,
        setUpdatedChatMap,
      }}
    ></Outlet>
  );
};

export default Mainlayout;
