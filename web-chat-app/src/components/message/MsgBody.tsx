import MessageType from "@/enums/MessageType.enum";
import { IMessage } from "@/interfaces/messages/message.interface";
import { MyTooltip } from "../ui/my-tooltip";
import {
  getDisplaySendMsgTime,
  getTimeDiff,
  getUnroundTimeDiff,
  TimeTypeOption,
} from "@/utils/messageTime.helper";
import { FileText, Mic, Video } from "lucide-react";
import ReactPlayer from "react-player";
import MarkdownMessage from "./MarkdownMessage";

const MsgBody = ({
  msg,
  isSentMsg,
  setMediaId,
}: {
  msg: IMessage;
  isSentMsg: boolean;
  setMediaId: (msgId: string) => void;
}) => {
  switch (msg.type) {
    case MessageType.AUDIO:
      return MyTooltip({
        hover: (
          <audio
            src={msg.file?.url}
            className={`rounded-3xl object-contain`}
            controls
          ></audio>
        ),
        content: getDisplaySendMsgTime(msg.createdAt!),
        className: "max-w-[70%]",
        id: msg.id,
      });
    case MessageType.FILE:
      return MyTooltip({
        hover: (
          <a
            href={msg.file!.url}
            download
            className="py-2 px-3 flex gap-4 items-center bg-gray-400 rounded-3xl"
            target="_blank"
          >
            <FileText />
            <div>{msg.file?.filename}</div>
          </a>
        ),
        content: getDisplaySendMsgTime(msg.createdAt!),
        className: "max-w-[100%]",
        id: msg.id,
      });
    case MessageType.IMAGE:
      return MyTooltip({
        hover: (
          <div
            className="rounded-3xl bg-contain bg-no-repeat bg-center w-48 h-48 cursor-pointer"
            style={{ backgroundImage: `url(${msg.file?.url})` }}
            onClick={() => setMediaId(msg.id)}
          ></div>
        ),
        content: getDisplaySendMsgTime(msg.createdAt!),
        className: "max-w-[30%]",
        id: msg.id,
      });
    case MessageType.VIDEO:
      return MyTooltip({
        hover: (
          <ReactPlayer
            src={msg.file?.url}
            className={`rounded-3xl cursor-pointer`}
            controls
            onClick={() => setMediaId(msg.id)}
          ></ReactPlayer>
        ),
        content: getDisplaySendMsgTime(msg.createdAt!),
        className: "max-w-[100%]",
        id: msg.id,
      });
    case MessageType.VIDEO_CALL:
      return MyTooltip({
        hover: (
          <div className="py-2 px-3 flex gap-4 items-center bg-gray-400 rounded-3xl">
            <Video />
            <div>
              <div className="font-bold">Video call</div>
              <div className="text-[0.7rem] text-left">
                {msg.endedCallAt
                  ? getUnroundTimeDiff({
                      firstTime: msg.endedCallAt!,
                      secondTime: msg.createdAt!,
                    })
                  : "Canceled"}
              </div>
            </div>
          </div>
        ),
        content: getDisplaySendMsgTime(msg.createdAt!),
        className: "max-w-[100%]",
        id: msg.id,
      });
    case MessageType.AUDIO_CALL:
      return MyTooltip({
        hover: (
          <div className="py-2 px-3 flex gap-4 items-center bg-gray-400 rounded-3xl">
            <Mic />
            <div>
              <div className="font-bold">Audio call</div>
              <div className="text-[0.7rem] text-left">
                {msg.endedCallAt
                  ? getUnroundTimeDiff({
                      firstTime: msg.endedCallAt!,
                      secondTime: msg.createdAt!,
                    })
                  : "Canceled"}
              </div>
            </div>
          </div>
        ),
        content: getDisplaySendMsgTime(msg.createdAt!),
        className: "max-w-[100%]",
        id: msg.id,
      });
    default:
      return MyTooltip({
        hover: (
          <div
            className={`py-2 px-3 text-xl text-[1rem] rounded-2xl text-justify ${
              isSentMsg ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            <MarkdownMessage text={msg.msgBody!}></MarkdownMessage>
          </div>
        ),
        content: getDisplaySendMsgTime(msg.createdAt!),
        className: "text-center",
        id: msg.id,
      });
  }
};

export default MsgBody;
