import MessageType from "@/enums/MessageType.enum";
import { IMessage } from "@/interfaces/messages/message.interface";
import { MyTooltip } from "../ui/my-tooltip";
import { getDisplaySendMsgTime } from "@/utils/messageTime.helper";
import { FileText } from "lucide-react";
import ReactPlayer from "react-player";
import MarkdownMessage from "./MarkdownMessage";

const MsgBody = ({ msg, isSentMsg }: { msg: IMessage; isSentMsg: boolean }) => {

  switch (msg.type) {
    case MessageType.AUDIO:
      return MyTooltip(
        <audio
          src={msg.file?.url}
          className={`rounded-3xl object-contain`}
          controls
        ></audio>,
        getDisplaySendMsgTime(new Date(msg.createdAt!)),
        "max-w-[70%]"
      );
    case MessageType.FILE:
      return MyTooltip(
        <a
          href={msg.file!.url}
          download
          className="py-2 px-3 flex gap-4 items-center bg-gray-400 rounded-3xl"
          target="_blank"
        >
          <FileText />
          <div>{msg.file?.filename}</div>
        </a>,
        getDisplaySendMsgTime(new Date(msg.createdAt!)),
        "order-2 max-w-[100%]"
      );
    case MessageType.IMAGE:
      return MyTooltip(
        <div
          className="rounded-3xl bg-contain bg-no-repeat bg-center w-48 h-48"
          style={{ backgroundImage: `url(${msg.file?.url})` }}
        ></div>,
        getDisplaySendMsgTime(new Date(msg.createdAt!)),
        "order-2 max-w-[30%]"
      );
    case MessageType.VIDEO:
      return MyTooltip(
        <ReactPlayer
          src={msg.file?.url}
          className={`rounded-3xl`}
          controls
        ></ReactPlayer>,
        getDisplaySendMsgTime(new Date(msg.createdAt!)),
        "order-2 max-w-[100%]"
      );
    default:
      return MyTooltip(
        <div
          className={`py-2 px-3 text-xl text-[1rem] rounded-2xl order-2 text-justify   ${
            isSentMsg ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          <MarkdownMessage text={msg.msgBody!}></MarkdownMessage>
        </div>,
        getDisplaySendMsgTime(new Date(msg.createdAt!)),
        "text-center"
      );
  }
};

export default MsgBody;
