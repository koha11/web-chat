import { MoreVertical, Reply, Share, Share2, SmileIcon } from "lucide-react";
import { Button } from "../ui/button";
import { MyTooltip } from "../ui/my-tooltip";
import { useState } from "react";
import MessageActions from "./MessageActionBar";
import { IMessage } from "../../interfaces/message.interface";
import { getDisplaySendMsgTime } from "../../utils/messageTime.helper";
import MessageStatus from "../../enums/MessageStatus.enum";

const SingleMsg = ({
  isLongGap,
  isSentMsg,
  msgSenderAvatar,
  fullname,
  msg,
}: {
  isSentMsg: boolean;
  fullname: string;
  msgSenderAvatar: string;
  isLongGap: boolean;
  msg: IMessage;
}) => {
  const [isHover, setHover] = useState<boolean>(false);
  const [isOpen, setOpen] = useState<boolean>(false);

  if (msg.status == MessageStatus.REMOVED_ONLY_YOU) return <></>;

  return (
    <div
      className={`flex flex-col gap-1 px-2 single-msg ${isLongGap && "mt-4"}`}
    >
      <div
        className={`flex items-center gap-2 ${
          isSentMsg ? "justify-end" : "justify-baseline"
        }`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* Hien thi avatar neu co  */}
        {msgSenderAvatar == "" ? (
          <div
            className={`w-8 h-8 order-1`}
            style={{ backgroundImage: `url(${msgSenderAvatar})` }}
          ></div>
        ) : (
          MyTooltip(
            <div
              className={`w-8 h-8 rounded-full bg-contain bg-no-repeat bg-center order-1`}
              style={{ backgroundImage: `url(${msgSenderAvatar})` }}
            ></div>,
            fullname,
            "order-1"
          )
        )}

        {/* Hien action  */}
        {(isHover || isOpen) && (
          <MessageActions
            isUnsendMsg={msg.status == MessageStatus.UNSEND}
            msgId={msg._id}
            isSentMsg={isSentMsg}
            isOpen={isOpen}
            setOpen={() => setOpen(!isOpen)}
          ></MessageActions>
        )}

        {/* Hien thi noi dung tin nhan  */}
        {msg.status == MessageStatus.UNSEND
          ? MyTooltip(
              <span
                className={`py-2 px-3 text-xl text-[0.9rem] rounded-2xl text-gray-200 italic ${
                  isSentMsg ? "bg-blue-500" : "bg-gray-200 text-gray-500"
                }`}
              >
                {isSentMsg ? "You" : fullname.split(" ")[0]} unsend a message
              </span>,
              `Send at ${getDisplaySendMsgTime(new Date(msg.createdAt!))}
              Unsend at ${getDisplaySendMsgTime(new Date(msg.updatedAt!))}`,
              "order-2"
            )
          : MyTooltip(
              <span
                className={`py-2 px-3 text-xl text-[1rem] rounded-2xl order-2 ${
                  isSentMsg ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                {msg.msgBody}
              </span>,
              getDisplaySendMsgTime(new Date(msg.createdAt!)),
              "order-2"
            )}
      </div>

      <div className="flex items-center justify-end">
        {/* {isSentMsg &&
          MyTooltip(
            <div
              className="w-4 h-4 rounded-full bg-contain bg-no-repeat bg-center"
              style={{ backgroundImage: `url(${avatar})` }}
            ></div>,
            fullname
          )} */}
      </div>
    </div>
  );
};

export default SingleMsg;
