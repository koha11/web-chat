import React, { createContext, useContext, useMemo } from "react";
import type { IChat, IChatUsersInfo } from "@/interfaces/chat.interface";
import type { IMessage } from "@/interfaces/messages/message.interface";
import { ApolloClient } from "@apollo/client";

type UploadProgressMap = Record<string, number>;
type UsersMap = Record<string, IChatUsersInfo>;

export type ChatDetailCtx = {
  userId: string;
  usersMap: UsersMap;
  handleReplyMsg: (msg: IMessage) => void;
  setMediaId: (msgId: string) => void;
  handleNavigateToReplyMsg: (
    e: React.MouseEvent,
    msgId: string
  ) => Promise<void>;
  uploadProgress: UploadProgressMap;
  setUploadProgress: Function;
  chat: IChat | undefined;
  chatId: string;
  client: ApolloClient<any>;
};

const ChatDetailContext = createContext<ChatDetailCtx | undefined>(undefined);

type ChatDetailProviderProps = React.PropsWithChildren<{
  userId: string;
  usersMap: UsersMap;
  handleReplyMsg: (msg: IMessage) => void;
  setMediaId: (msgId: string) => void;
  handleNavigateToReplyMsg: (
    e: React.MouseEvent,
    msgId: string
  ) => Promise<void>;
  uploadProgress?: UploadProgressMap;
  setUploadProgress: Function;
  chat: IChat | undefined;
  chatId: string;
  client: ApolloClient<any>;
}>;

export function ChatDetailProvider({
  children,
  userId,
  usersMap,
  handleReplyMsg,
  setMediaId,
  handleNavigateToReplyMsg,
  uploadProgress = {},
  setUploadProgress,
  chat,
  chatId,
  client,
}: ChatDetailProviderProps) {
  const value = useMemo<ChatDetailCtx>(
    () => ({
      userId,
      usersMap,
      handleReplyMsg,
      setMediaId,
      handleNavigateToReplyMsg,
      uploadProgress,
      setUploadProgress,
      chat,
      chatId,
      client,
    }),
    [
      userId,
      usersMap,
      handleReplyMsg,
      setMediaId,
      handleNavigateToReplyMsg,
      uploadProgress,
      setUploadProgress,
      chat,
      chatId,
      client,
    ]
  );

  return (
    <ChatDetailContext.Provider value={value}>
      {children}
    </ChatDetailContext.Provider>
  );
}

export function useChatDetailContext(): ChatDetailCtx {
  const ctx = useContext(ChatDetailContext);
  if (!ctx)
    throw new Error(
      "useChatDetailContext must be used within <ChatDetailProvider>"
    );
  return ctx;
}
