import { SmileIcon, Reply, MoreVertical } from "lucide-react";
import { Button } from "./ui/button";

const MessageActions = () => {
  return (
    <>
      <Button
        size={"sm"}
        variant="link"
        className="hover:opacity-80 hover:bg-gray-200 cursor-pointer rounded-full"
      >
        <SmileIcon></SmileIcon>
      </Button>
      <Button
        size={"sm"}
        variant="link"
        className="hover:opacity-80 hover:bg-gray-200 cursor-pointer rounded-full"
      >
        <Reply></Reply>
      </Button>
      <Button
        size={"sm"}
        variant="link"
        className="hover:opacity-80 hover:bg-gray-200 cursor-pointer rounded-full"
      >
        <MoreVertical></MoreVertical>
      </Button>
    </>
  );
};

export default MessageActions
