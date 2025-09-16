import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { useGetChats } from "../hooks/chat.hook";
import { useGetLastMessages } from "../hooks/message.hook";
import { IChat } from "../interfaces/chat.interface";
import IModelConnection, {
  Edge,
} from "../interfaces/modelConnection.interface";
import {
  CHAT_CHANGED_SUB,
  CHAT_ONGOING_CALL_SUB,
  CHAT_RESPONSE_CALL_SUB,
} from "../services/chatService";
import Cookies from "js-cookie";
import { IUser } from "../interfaces/user.interface";

const Mainlayout = () => {
  const userId = Cookies.get("userId") ?? "";

  const [ongoingCall, setOngoingCall] = useState<{
    user: IUser;
    hasVideo: boolean;
    chatId: string;
  } | null>(null);

  const [chatSearch, setChatSearch] = useState("");

  const {
    data: chats,
    loading: isChatsLoading,
    subscribeToMore,
    refetch: chatRefetch,
  } = useGetChats({ userId, chatName: chatSearch });

  const {
    data: lastMessges,
    loading: isLastMsgLoading,
    refetch,
  } = useGetLastMessages({ userId, isFetch: chats == undefined });

  const [updatedChatMap, setUpdatedChatMap] = useState<{
    [chatId: string]: boolean;
  }>({});

  const incomingMsgAudioRef = useRef<HTMLAudioElement>(null);

  loadErrorMessages();
  loadDevMessages();

  useEffect(() => {
    if (chats) {
      const unsubscribeChatChanged = subscribeToMore({
        document: CHAT_CHANGED_SUB,
        variables: { userId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData) return prev;

          const chatChanged = subscriptionData.data.chatChanged.chat as IChat;
          const publisherId = subscriptionData.data.chatChanged
            .publisherId as string;
          const action = subscriptionData.data.chatChanged.action as
            | string
            | undefined;

          if (publisherId !== userId && action == "messageAdded") {
            incomingMsgAudioRef.current?.play();
          }

          setUpdatedChatMap((old) => {
            return {
              ...old,
              [chatChanged.id]: true,
            };
          });

          const edges = prev.chats.edges.filter(
            (edge: Edge<IChat>) => edge.cursor != chatChanged.id
          ) as Edge<IChat>[];

          edges.push({ node: chatChanged, cursor: chatChanged.id });

          edges.sort(
            (a, b) =>
              new Date(b.node.updatedAt!).getTime() -
              new Date(a.node.updatedAt!).getTime()
          );

          return {
            ...prev,
            chats: {
              ...prev.chats,
              edges,
              pageInfo: {
                ...prev.chats.pageInfo,
                startCursor: chatChanged.id,
                endCursor: edges[edges.length - 1].cursor,
              },
            },
          } as { chats: IModelConnection<IChat> };
        },
      });

      const unsubscribeOngoingCall = subscribeToMore({
        document: CHAT_ONGOING_CALL_SUB,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData) return prev;
          setOngoingCall(subscriptionData.data.ongoingCall);
        },
      });

      const unsubscribeResponseCall = subscribeToMore({
        document: CHAT_RESPONSE_CALL_SUB,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData) return prev;

          const responseCall = subscriptionData.data.responseCall;

          if (!responseCall) setOngoingCall(null);
        },
      });

      refetch();

      return () => {
        unsubscribeChatChanged();
        unsubscribeOngoingCall();
        unsubscribeResponseCall();
      };
    }
  }, [chats, subscribeToMore]);

  return (
    <>
      <audio
        src="/assets/sounds/incoming-msg.wav"
        ref={incomingMsgAudioRef}
      ></audio>

      <Outlet
        context={{
          chats,
          isChatsLoading,
          lastMessges,
          isLastMsgLoading,
          updatedChatMap,
          setUpdatedChatMap,
          ongoingCall,
          setOngoingCall,
          chatSearch,
          setChatSearch,
        }}
      ></Outlet>
    </>
  );
};

export default Mainlayout;
