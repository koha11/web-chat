import MessageType from "@/enums/MessageType.enum";
import { IMessage } from "@/interfaces/messages/message.interface";
import { Image, Link, Reply, Video } from "lucide-react";

const ReplyMsg = ({
  replyMsg,
  handleNavigateToReplyMsg,
  isSentMsg,
  name,
  targetName,
}: {
  replyMsg: IMessage;
  handleNavigateToReplyMsg: (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => Promise<void>;
  isSentMsg: boolean;
  name: string;
  targetName: string;
}) => {
  let component;

  switch (replyMsg.type) {
    case MessageType.IMAGE:
      component = (
        <>
          <span>Image</span>
          <Image size={16}></Image>
        </>
      );
      break;
    case MessageType.VIDEO:
      component = (
        <>
          <span>Video</span>
          <Video size={16}></Video>
        </>
      );
      break;
    case MessageType.AUDIO:
      component = (
        <>
          <span>Audio</span>
        </>
      );
      break;
    case MessageType.FILE:
      component = (
        <>
          <span>Attachment</span>
          <Link size={16}></Link>
        </>
      );
      break;
    default:
      component = <span>{replyMsg.msgBody}</span>;
  }

  return (
    <div
      className={`flex flex-col mt-2 text-[0.8rem] relative ${
        isSentMsg ? "items-end" : "items-baseline"
      }`}
    >
      <div className={`flex gap-2 mb-7 capitalize`}>
        <Reply size={"14"}></Reply> {name} replied to {targetName}
      </div>
      <a
        className={`bg-[rgba(0,0,0,0.1)] pt-1 pb-5 px-3 rounded-2xl absolute cursor-pointer flex items-center gap-2 ${
          isSentMsg ? "top-5 right-0" : "top-5 left-10"
        }`}
        href={`#${replyMsg.id}`}
        onClick={async (e) => await handleNavigateToReplyMsg(e, replyMsg.id)}
      >
        {component}
      </a>
    </div>
  );
};

export default ReplyMsg;
