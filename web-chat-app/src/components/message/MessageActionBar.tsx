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
import MyRadioDialog from "../ui/my-radio-dialog";
import WebSocketConnection from "../../services/WebSocketConnection";
import { useParams } from "react-router-dom";
import SocketEvent from "../../enums/SocketEvent.enum";
import { toast } from "sonner";
import { IMessage } from "../../interfaces/message.interface";
import ForwardMsgDialog from "./ForwardMsgDialog";

const MessageActions = ({
  isOpen,
  setOpen,
  isSentMsg,
  msgId,
  isUnsendMsg,
  handleReplyMsg,
}: {
  isOpen: boolean;
  setOpen: () => void;
  isSentMsg: boolean;
  msgId: string;
  isUnsendMsg: boolean;
  handleReplyMsg: () => void;
}) => {
  const { id } = useParams();

  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [isRadioDialogOpen, setRadioDialogOpen] = useState<boolean>(false);
  const [isForwardDialogOpen, setForwardDialogOpen] = useState<boolean>(false);

  // Handlers
  const handleUnsentMsg = (isUnsendForEveryone: boolean) => {
    // socket.emit(SocketEvent.um, msgId, id, isUnsendForEveryone);
  };

  return (
    <div
      className={`flex ${isSentMsg ? "order-1 flex-row-reverse" : "order-3"}`}
    >
      <Button
        size={"sm"}
        variant="link"
        className={`hover:opacity-80 hover:bg-gray-300 cursor-pointer rounded-full ${
          isUnsendMsg && "hidden"
        }`}
      >
        <SmileIcon></SmileIcon>
      </Button>
      <Button
        size={"sm"}
        variant="link"
        className={`hover:opacity-80 hover:bg-gray-300 cursor-pointer rounded-full ${
          isUnsendMsg && "hidden"
        }`}
        onClick={handleReplyMsg}
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
          <DropdownMenuItem
            className={`cursor-pointer font-bold ${
              isSentMsg && !isUnsendMsg && "hidden"
            }`}
            onClick={() => setConfirmDialogOpen(true)}
          >
            Remove
          </DropdownMenuItem>

          <DropdownMenuItem
            className={`cursor-pointer font-bold ${
              (!isSentMsg || isUnsendMsg) && "hidden"
            }`}
            onClick={() => setRadioDialogOpen(true)}
          >
            Unsend
          </DropdownMenuItem>

          <DropdownMenuItem
            className={`cursor-pointer font-bold ${isUnsendMsg && "hidden"}`}
            onClick={() => setForwardDialogOpen(true)}
          >
            Forward
          </DropdownMenuItem>

          <DropdownMenuItem
            className={`cursor-pointer font-bold ${
              (!isSentMsg || isUnsendMsg) && "hidden"
            }`}
          >
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            className={`cursor-pointer font-bold ${isUnsendMsg && "hidden"}`}
          >
            Pin
          </DropdownMenuItem>

          <DropdownMenuItem
            className={`cursor-pointer font-bold ${isSentMsg && "hidden"}`}
          >
            Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <MyConfirmDialog
        title="Remove only for you"
        content="This message will be removed from your device, but will still be visible to other members of the chat."
        isOpen={isConfirmDialogOpen}
        setOpen={() => setConfirmDialogOpen(!isConfirmDialogOpen)}
        onSubmit={() => {
          handleUnsentMsg(false);
          toast.success("Unsend successful");
          setConfirmDialogOpen(false);
        }}
      ></MyConfirmDialog>

      <MyRadioDialog
        isOpen={isRadioDialogOpen}
        setOpen={() => setRadioDialogOpen(!isRadioDialogOpen)}
        title="Who do you want to unsend this message?"
        onSubmit={(isUnsendForEveryone: boolean) => {
          handleUnsentMsg(isUnsendForEveryone);
          toast.success("Unsend successful");
          setRadioDialogOpen(false);
        }}
        options={[
          {
            value: true,
            title: "Unsend for everyone",
            des: `This message will be unsent with everyone in the chat. 
          Others may have viewed or transferred that message. 
          Messages that have been unsent may still be reported.`,
          },
          {
            value: false,
            title: "Unsend for you",
            des: `This message will be removed from your device, but will still be visible to other members of the chat.`,
          },
        ]}
        name={"isUnsendForEveryone"}
        initValue={true}
      ></MyRadioDialog>

      <ForwardMsgDialog
        isOpen={isForwardDialogOpen}
        setOpen={setForwardDialogOpen}
      ></ForwardMsgDialog>
    </div>
  );
};

export default MessageActions;
