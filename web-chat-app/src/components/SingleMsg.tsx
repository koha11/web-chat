import { MoreVertical, Reply, Share, Share2, SmileIcon } from "lucide-react";
import { Button } from "./ui/button";
import { MyTooltip } from "./ui/myTooltip";
import { useState } from "react";
import MessageActions from "./MessageActionBar";

const SingleMsg = ({
  body,
  isLongGap,
  isSentMsg,
  avatar,
  sendTime,
  fullname,
}: {
  isSentMsg: boolean;
  fullname: string;
  body: string;
  avatar: string;
  isLongGap: boolean;
  sendTime: string;
}) => {
  const [isHover, setHover] = useState<boolean>(false);
  return (
    <div
      className={`flex flex-col gap-2 px-2 mt-4 single-msg`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        className={`flex items-center gap-2 ${
          isSentMsg ? "justify-end" : "justify-baseline"
        }`}
      >
        {/* Hien action cho nguoi gui  */}
        {isSentMsg && isHover && <MessageActions></MessageActions>}

        {/* Hien avatar cho nguoi nhan  */}
        {!isSentMsg &&
          MyTooltip(
            <div
              className="w-8 h-8 rounded-full bg-contain bg-no-repeat bg-center"
              style={{ backgroundImage: `url(${avatar})` }}
            ></div>,
            fullname
          )}

        {/* noi dung tin nhan  */}
        {MyTooltip(
          <span className="py-2 px-3 text-xl text-[1rem] bg-gray-200 rounded-2xl">
            {body}
          </span>,
          sendTime
        )}

        {/* Hien action cho nguoi nhan  */}
        {!isSentMsg && isHover && <MessageActions></MessageActions>}
      </div>

      {/* seen avatar  */}
      <div className="flex items-center justify-end">
        {isSentMsg &&
          MyTooltip(
            <div
              className="w-4 h-4 rounded-full bg-contain bg-no-repeat bg-center"
              style={{ backgroundImage: `url(${avatar})` }}
            ></div>,
            fullname
          )}
      </div>
    </div>
  );
};

export default SingleMsg;
