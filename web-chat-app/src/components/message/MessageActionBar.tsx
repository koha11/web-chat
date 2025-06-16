import { SmileIcon, Reply, MoreVertical } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useState } from "react";
import MyConfirmDialog from "../ui/my-confirm-dialog";

const MessageActions = ({
  isOpen,
  setOpen,
  isSentMsg,
}: {
  isOpen: boolean;
  setOpen: () => void;
  isSentMsg: boolean;
}) => {
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);

  return (
    <>
      <Button
        size={"sm"}
        variant="link"
        className="hover:opacity-80 hover:bg-gray-300 cursor-pointer rounded-full"
      >
        <SmileIcon></SmileIcon>
      </Button>
      <Button
        size={"sm"}
        variant="link"
        className="hover:opacity-80 hover:bg-gray-300 cursor-pointer rounded-full"
      >
        <Reply></Reply>
      </Button>
      <DropdownMenu open={isOpen} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild onClick={setOpen}>
          <Button
            size={"sm"}
            variant="link"
            className="hover:opacity-80 hover:bg-gray-300 cursor-pointer rounded-full"
          >
            <MoreVertical></MoreVertical>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" className="p-2">
          {isSentMsg ? (
            <DropdownMenuItem className="cursor-pointer font-bold">
              Restore
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              className="cursor-pointer font-bold"
              onClick={() => setConfirmDialogOpen(true)}
            >
              Delete
            </DropdownMenuItem>
          )}
          <DropdownMenuItem className="cursor-pointer font-bold">
            Forward
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer font-bold">
            Pin
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer font-bold">
            Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <MyConfirmDialog
        title="Delete only for you"
        content="This message will be removed from your device, but will still be visible to other members of the chat."
        isOpen={isConfirmDialogOpen}
        setOpen={() => setConfirmDialogOpen(!isConfirmDialogOpen)}
      ></MyConfirmDialog>
    </>
  );
};

export default MessageActions;
