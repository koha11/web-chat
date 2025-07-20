import { SmileIcon, Reply, MoreVertical } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useEffect, useState } from "react";
import MyConfirmDialog from "../ui/my-confirm-dialog";
import MyRadioDialog from "../ui/my-radio-dialog";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import ForwardMsgDialog from "./ForwardMsgDialog";
import { useRemoveMessage, useUnsendMessage } from "../../hooks/message.hook";
import EmojiPicker from "emoji-picker-react";

const MessageActions = ({
  isOpen,
  setOpen,
  isSentMsg,
  msgId,
  isUnsendMsg,
  handleReplyMsg,
  handleSendMsg,
}: {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  isSentMsg: boolean;
  msgId: string;
  isUnsendMsg: boolean;
  handleReplyMsg: () => void;
  handleSendMsg: (chatId: string) => void;
}) => {
  const { id } = useParams();

  const [unsendMessage] = useUnsendMessage();
  const [removeMessage] = useRemoveMessage();

  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [isRadioDialogOpen, setRadioDialogOpen] = useState<boolean>(false);
  const [isForwardDialogOpen, setForwardDialogOpen] = useState<boolean>(false);

  const [isMoreDropdownOpen, setMoreDropdownOpen] = useState<boolean>(false);
  const [isReactionOpen, setReactionOpen] = useState(false);

  // ngan ko cho message action bar bi unhover
  useEffect(() => {
    setOpen(isMoreDropdownOpen || isReactionOpen);
  }, [isMoreDropdownOpen, isReactionOpen]);

  // Handlers
  const handleUnsentOrRemoveMsg = ({ isUnsend }: { isUnsend: boolean }) => {
    if (isUnsend) {
      unsendMessage({ variables: { chatId: id, msgId } });
      toast.success("Unsend successful");
    } else {
      removeMessage({ variables: { chatId: id, msgId } });
      toast.success("Remove successful");
    }

    setRadioDialogOpen(false);
  };

  return (
    <div
      className={`relative flex ${
        isSentMsg ? "order-1 flex-row-reverse" : "order-3"
      }`}
    >
      {/* emoji btn  */}
      <Button
        size={"sm"}
        variant="link"
        className={`hover:opacity-80 hover:bg-gray-300 cursor-pointer rounded-full ${
          isUnsendMsg && "hidden"
        }`}
        onClick={(e) => {
          setReactionOpen(!isReactionOpen);
        }}
      >
        <SmileIcon></SmileIcon>
      </Button>

      <EmojiPicker
        open={isReactionOpen}
        reactionsDefaultOpen={true}
        onReactionClick={(emojiData) => {
          console.log(emojiData);
        }}
        lazyLoadEmojis={true}
        searchDisabled
        style={{ position: "absolute", top: -60, zIndex: 99999999, right: 40 }}
      />

      {/* reply BTN  */}
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

      <DropdownMenu
        open={isMoreDropdownOpen}
        onOpenChange={setMoreDropdownOpen}
      >
        <DropdownMenuTrigger asChild onClick={() => setOpen(true)}>
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
          removeMessage({ variables: { chatId: id, msgId } });
          toast.success("Remove successful");
          setConfirmDialogOpen(false);
        }}
      ></MyConfirmDialog>

      <MyRadioDialog
        isOpen={isRadioDialogOpen}
        setOpen={() => setRadioDialogOpen(!isRadioDialogOpen)}
        title="Who do you want to unsend this message?"
        onSubmit={handleUnsentOrRemoveMsg}
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
        name={"isUnsend"}
        initValue={true}
      ></MyRadioDialog>

      <ForwardMsgDialog
        isOpen={isForwardDialogOpen}
        setOpen={setForwardDialogOpen}
        handleSendMsg={(chatId: string) => {
          handleSendMsg(chatId);
          setForwardDialogOpen(false);
        }}
      ></ForwardMsgDialog>
    </div>
  );
};

export default MessageActions;
