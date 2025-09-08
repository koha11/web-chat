import MessageType from "@/enums/MessageType.enum";
import { IMessage } from "@/interfaces/messages/message.interface";
import { Collapsible, CollapsibleContent } from "../ui/collapsible";
import { watch } from "fs";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { useChatDetailContext } from "@/hooks/useChatDetailContext";

const ReplyMsgDisplay = ({
  msg,
  setReplyMsg,
  isReplyMsgOpen,
  setReplyMsgOpen,
}: {
  msg: IMessage;
  setReplyMsg: (field: string, value: any) => void;
  isReplyMsgOpen: boolean;
  setReplyMsgOpen: (open: boolean) => void;
}) => {
  const { userId, chat } = useChatDetailContext();

  if (chat == null) return <></>;

  let component;

  switch (msg.type) {
    case MessageType.IMAGE:
      component = (
        <div
          className="bg-contain bg-no-repeat bg-center h-8 w-8"
          style={{ backgroundImage: `url(${msg.file?.url})` }}
        ></div>
      );
      break;
    case MessageType.VIDEO:
      component = <video className="h-8 w-8" src={msg.file?.url}></video>;
      break;
    case MessageType.AUDIO:
      component = <div className="break-words text-[0.7rem]">Audio</div>;
      break;
    case MessageType.FILE:
      component = <div className="break-words text-[0.7rem]">Attachment</div>;
      break;
    default:
      component = (
        <div className="break-words text-[0.7rem]">{msg.msgBody}</div>
      );
      break;
  }

  return (
    <Collapsible
      open={isReplyMsgOpen}
      onOpenChange={setReplyMsgOpen}
      className="w-full"
    >
      <CollapsibleContent className="flex flex-auto items-center justify-between border-t-2 w-full">
        <div className="py-1 space-y-1 px-2">
          <div className="font-semibold">
            Replying to{" "}
            {userId == msg.user
              ? "yourself"
              : chat.usersInfo[msg.user].nickname}
          </div>

          {component}
        </div>

        <Button
          variant={"outline"}
          className="h-6 w-4 rounded-full cursor-pointer border-0"
          onClick={() => {
            setReplyMsg("msg.replyForMsg", undefined);
            setReplyMsgOpen(false);
          }}
        >
          <X></X>
        </Button>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ReplyMsgDisplay;
