import React, { createContext, useContext, useMemo } from "react";
import type { IChat, IChatUsersInfo } from "@/interfaces/chat.interface";
import type { IMessage } from "@/interfaces/messages/message.interface";

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
