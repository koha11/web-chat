import { MoreVertical, Reply, Share, Share2, SmileIcon } from "lucide-react";
import { Button } from "../ui/button";
import { MyTooltip } from "../ui/my-tooltip";
import { useState } from "react";
import MessageActions from "./MessageActionBar";

const SingleMsg = ({
  body,
  isLongGap,
  isSentMsg,
  msgSenderAvatar,
  sendTime,
  fullname,
}: {
  isSentMsg: boolean;
  fullname: string;
  body: string;
  msgSenderAvatar: string;
  isLongGap: boolean;
  sendTime: string;
}) => {
  const [isHover, setHover] = useState<boolean>(false);
  const [isOpen, setOpen] = useState<boolean>(false);

  return (
    <div className={`flex flex-col gap-2 px-2 single-msg`}>
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

        {/* noi dung tin nhan  */}
        {MyTooltip(
          <span className="py-2 px-3 text-xl text-[1rem] bg-gray-200 rounded-2xl">
            {body}
          </span>,
          sendTime
        )}

        {/* Hien action cho nguoi nhan  */}
        {!isSentMsg && (isHover || isOpen) && (
          <MessageActions
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
