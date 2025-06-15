import { MoreVertical, Reply, Share, Share2, SmileIcon } from "lucide-react";
import { Button } from "./ui/button";

const SingleMsg = ({
  body,
  isLongGap,
  isSentMsg,
  avatar,
}: {
  isSentMsg: boolean;
  body: string;
  avatar: string;
  isLongGap: boolean;
}) => {
  return (
    <div className={`flex flex-col gap-2 px-2 mt-4`}>
      <div
        className={`flex items-center gap-2 ${
          isSentMsg ? "justify-end" : "justify-baseline"
        }`}
      >
        {isSentMsg && (
          <div className="">
            <Button variant="link" className="hover:opacity-80 cursor-pointer">
              <MoreVertical></MoreVertical>
            </Button>
          </div>
        )}

        {!isSentMsg && (
          <div
            className="w-8 h-8 rounded-full bg-contain bg-no-repeat bg-center"
            style={{ backgroundImage: `url(${avatar})` }}
          ></div>
        )}

        <span className="py-1 px-3 text-xl text-[1rem] bg-gray-200 rounded-2xl">
          {body}
        </span>

        {!isSentMsg && (
          <div className="">
            <Button variant="link" className="hover:opacity-80 cursor-pointer">
              <SmileIcon></SmileIcon>
            </Button>
            <Button variant="link" className="hover:opacity-80 cursor-pointer">
              <Reply></Reply>
            </Button>
            <Button variant="link" className="hover:opacity-80 cursor-pointer">
              <MoreVertical></MoreVertical>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleMsg;
