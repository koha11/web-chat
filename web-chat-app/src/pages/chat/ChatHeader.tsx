import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import UserType from "@/enums/UserType.enum";
import { useMakeCall } from "@/hooks/chat.hook";
import { IChat } from "@/interfaces/chat.interface";
import { IUser } from "@/interfaces/user.interface";
import { getDisplayTimeDiff } from "@/utils/messageTime.helper";
import { Phone, Video, MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const ChatHeader = ({
  chat,
  isMsgLoading,
  setChatInfoOpen,
}: {
  chat: IChat | undefined;
  isMsgLoading: boolean;
  setChatInfoOpen: Function;
}) => {
  // params / states
  const userId = Cookies.get("userId");
  const [lastLogined, setLastLogined] = useState<string>("");

  // mutations
  const [makeCall] = useMakeCall();

  // useEffect
  useEffect(() => {
    if (chat && isMsgLoading) {
      const users = chat.users as IUser[];

      const usersSortAscByLastLogined = users
        .filter(
          (user) => user.id != userId && user.userType != UserType.CHATBOT
        )
        .sort(
          (a, b) =>
            new Date(b.lastLogined ?? "").getTime() -
            new Date(a.lastLogined ?? "").getTime()
        );

      const lastLoginedUser = usersSortAscByLastLogined[0];

      if (lastLoginedUser && !lastLoginedUser.isOnline)
        setLastLogined(
          getDisplayTimeDiff(new Date(lastLoginedUser.lastLogined ?? ""))
        );
    }
  }, [chat]);

  //handlers
  const handleMakeCall = (isVideoCall: boolean) => {
    makeCall({ variables: { chatId: chat?.id, hasVideo: isVideoCall } });
    window.open(
      `/call?has_video=${isVideoCall}&initialize_video=${isVideoCall}&room_id=${chat?.id}`,
      "_blank",
      "width=1300,height=600,location=no,toolbar=no"
    );
  };

  return (
    <div className="container flex items-center justify-between h-[10%]">
      <div className="flex items-center">
        {chat && !isMsgLoading ? (
          <div className="relative">
            <div
              className="w-12 h-12 rounded-full bg-contain bg-no-repeat bg-center"
              style={{ backgroundImage: `url(${chat.chatAvatar})` }}
            ></div>
            {lastLogined == "" && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            )}
          </div>
        ) : (
          <Skeleton className="w-12 h-12 rounded-full bg-contain bg-no-repeat bg-center"></Skeleton>
        )}

        {chat && !isMsgLoading ? (
          <div className="ml-4">
            <h1 className="font-bold">{chat.chatName}</h1>
            <div className="text-gray-500 text-[0.75rem]">
              {lastLogined == "" ? "Online" : `Online ${lastLogined} ago`}
            </div>
          </div>
        ) : (
          <div className="ml-4 space-y-2">
            <Skeleton className="h-4 w-[240px]"></Skeleton>
            <Skeleton className="h-4 w-[120px]"></Skeleton>
          </div>
        )}
      </div>
      <div className="text-2xl flex items-center gap-4 ">
        <Button
          className="p-2 rounded-full hover:bg-gray-200 bg-white text-black cursor-pointer"
          onClick={() => handleMakeCall(false)}
        >
          <Phone></Phone>
        </Button>
        <Button
          className="p-2 rounded-full hover:bg-gray-200 bg-white text-black cursor-pointer"
          onClick={() => handleMakeCall(true)}
        >
          <Video></Video>
        </Button>
        <Button
          className="p-2 rounded-full hover:bg-gray-200 bg-white text-black cursor-pointer"
          onClick={() => setChatInfoOpen()}
        >
          <MoreHorizontal></MoreHorizontal>
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
