import { use, useEffect, useState } from "react";

import { useLocation, useOutletContext, useParams } from "react-router-dom";
import ChatDetails from "./ChatDetails";
import ChatList from "./ChatList";
import ChatIndex from "./ChatIndex";
import Cookies from "js-cookie";
import ChatInfo from "./ChatInfo";
import OngoingCallDialog from "../../components/call/OngoingCallDialog";
import ChatMediaViewer from "@/components/chat/ChatMediaViewer";
import { IUser } from "@/interfaces/user.interface";
import { IChat } from "@/interfaces/chat.interface";
import { Edge } from "@/interfaces/modelConnection.interface";
import UserType from "@/enums/UserType.enum";

const Chat = () => {
  const { id } = useParams();
  const location = useLocation();
  const isNewChat = location.pathname.includes("new");
  const userId = Cookies.get("userId") ?? "";

  const {
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
  } = useOutletContext<any>();

  const [chatInfoOpen, setChatInfoOpen] = useState(false);
  const [mediaId, setMediaId] = useState("");
  const [choosenUsers, setChoosenUsers] = useState<IUser[]>([]);

  useEffect(() => {
    setChoosenUsers([]);
  }, [id]);

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
          isNewChat={isNewChat}
          choosenUsers={choosenUsers}
          chatSearch={chatSearch}
          setChatSearch={setChatSearch}
        ></ChatList>

        {id == undefined && !isNewChat ? (
          <ChatIndex></ChatIndex>
        ) : (
          <ChatDetails
            userId={userId!}
            chatId={id!}
            hasUpdated={false}
            setUpdatedChatMap={setUpdatedChatMap}
            setChatInfoOpen={() => setChatInfoOpen(!chatInfoOpen)}
            setMediaId={setMediaId}
            choosenUsers={choosenUsers}
            setChoosenUsers={setChoosenUsers}
            chatList={chats && chats.edges.map((edge: any) => edge.node)}
            isNewChat={isNewChat}
          ></ChatDetails>
        )}

        <ChatInfo
          chatId={id!}
          userId={userId}
          open={chatInfoOpen}
          setMediaId={setMediaId}
        ></ChatInfo>
      </div>

      {/* Ongoing call  */}
      {ongoingCall && (
        <OngoingCallDialog
          isOpen={true}
          setOpen={setOngoingCall}
          hasVideo={ongoingCall.hasVideo}
          user={ongoingCall.user}
          chatId={ongoingCall.chatId}
          msgId={ongoingCall.msgId}
        ></OngoingCallDialog>
      )}

      {/* Media Viewer  */}
      {mediaId != "" && (
        <ChatMediaViewer
          mediaId={mediaId}
          setMediaId={setMediaId}
        ></ChatMediaViewer>
      )}
    </div>
  );
};

export default Chat;
