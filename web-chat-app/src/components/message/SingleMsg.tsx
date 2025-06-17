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
        {/* The gia de co dinh chieu cao  */}
        {isSentMsg && <div className="w-8 h-8"></div>}

        {/* Hien action cho nguoi gui  */}
        {isSentMsg && (isHover || isOpen) && (
          <MessageActions
            msgId={msg._id}
            isSentMsg={isSentMsg}
            isOpen={isOpen}
            setOpen={() => setOpen(!isOpen)}
          ></MessageActions>
        )}

        {/* Hien avatar cho nguoi nhan  */}
        {!isSentMsg &&
          msgSenderAvatar != "" &&
          MyTooltip(
            <div
              className="w-8 h-8 rounded-full bg-contain bg-no-repeat bg-center"
              style={{ backgroundImage: `url(${msgSenderAvatar})` }}
            ></div>,
            fullname
          )}

        {/* An avatar cho nguoi nhan  */}
        {!isSentMsg && msgSenderAvatar == "" && (
          <div
            className="w-8 h-8 rounded-full bg-contain bg-no-repeat bg-center"
            style={{ backgroundImage: `url(${msgSenderAvatar})` }}
          ></div>
        )}

        {/* Hien thi neu nguoi dung da thu hoi tin nhan  */}
        {msg.status == MessageStatus.UNSEND && (
          <p>
            <span className="py-2 px-3 text-xl text-[1rem] text-gray-700 rounded-2xl outline-1">
              {isSentMsg ? "You" : fullname.split(" ")[0]} unsend a message!
            </span>
          </p>
        )}

        {/* Noi dung tin nhan duoc hien thi  */}
        {msg.status != MessageStatus.UNSEND &&
          msg.status != MessageStatus.REMOVED_ONLY_YOU &&
          MyTooltip(
            <span className="py-2 px-3 text-xl text-[1rem] bg-gray-200 rounded-2xl">
              {msg.msgBody}
            </span>,
            getDisplaySendMsgTime(new Date(msg.createdAt!))
          )}

        {/* Hien action cho nguoi nhan  */}
        {!isSentMsg && (isHover || isOpen) && (
          <MessageActions
            msgId={msg._id}
            isOpen={isOpen}
            setOpen={() => setOpen(!isOpen)}
            isSentMsg={isSentMsg}
          ></MessageActions>
        )}
      </div>

      {/* seen avatar  */}
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
