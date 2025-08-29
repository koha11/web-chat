import React, { createContext, useContext, useMemo } from "react";
import type { IChatUsersInfo } from "@/interfaces/chat.interface";
import type { IMessage } from "@/interfaces/messages/message.interface";

type UploadProgressMap = Record<string, number>;
type UsersMap = Record<string, IChatUsersInfo>;

export type ChatCtx = {
  userId: string;
  usersMap: UsersMap;
  handleReplyMsg: (msg: IMessage) => void;
  setMediaId: (msgId: string) => void;
  handleNavigateToReplyMsg: (
    e: React.MouseEvent,
    msgId: string
  ) => Promise<void>;
  uploadProgress: UploadProgressMap;
};

const ChatContext = createContext<ChatCtx | undefined>(undefined);

type ChatProviderProps = React.PropsWithChildren<{
  userId: string;
  usersMap: UsersMap;
  handleReplyMsg: (msg: IMessage) => void;
  setMediaId: (msgId: string) => void;
  handleNavigateToReplyMsg: (
    e: React.MouseEvent,
    msgId: string
  ) => Promise<void>;
  uploadProgress?: UploadProgressMap;
}>;

export function ChatProvider({
  children,
  userId,
  usersMap,
  handleReplyMsg,
  setMediaId,
  handleNavigateToReplyMsg,
  uploadProgress = {},
}: ChatProviderProps) {
  const value = useMemo<ChatCtx>(
    () => ({
      userId,
      usersMap,
      handleReplyMsg,
      setMediaId,
      handleNavigateToReplyMsg,
      uploadProgress,
    }),
    [
      userId,
      usersMap,
      handleReplyMsg,
      setMediaId,
      handleNavigateToReplyMsg,
      uploadProgress,
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatContext(): ChatCtx {
  const ctx = useContext(ChatContext);
  if (!ctx)
    throw new Error("useChatContext must be used within <ChatProvider>");
  return ctx;
}
