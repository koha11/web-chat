import { Edit, Hand, Image, SmileIcon } from "lucide-react";

import { useState } from "react";
import MyCollapsible from "../ui/my-collapsible";
import ChangeNicknamesDialog from "./ChangeNicknamesDialog";
import { IChat } from "../../interfaces/chat.interface";
import ChangeChatAvatarDialog from "./ChangeChatAvatarDialog";
import ChangeChatNameDialog from "./ChangeChatNameDialog";
import MyEmojiPicker from "../ui/my-emoji-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import ChangeChatEmojiDialog from "./ChangeChatEmojiDialog";

const CollapsibleChatConfig = ({ chat }: { chat: IChat }) => {
  const isGroupChat = chat.users.length > 2;

  const [isChangeNicknamesOpen, setChangeNicknamesOpen] = useState(false);
  const [isChangeChatAvatarOpen, setChangeChatAvatarOpen] = useState(false);
  const [isChangeChatNameOpen, setChangeChatNameOpen] = useState(false);
  const [isChangeChatEmojiOpen, setChangeChatEmojiOpen] = useState(false);

  return (
    <MyCollapsible
      data={[
        {
          content: (
            <>
              <Edit></Edit>
              <span>Rename chat</span>
            </>
          ),
          onClick: () => {
            setChangeChatNameOpen(true);
          },
          dialog: (
            <ChangeChatNameDialog
              isOpen={isChangeChatNameOpen}
              setOpen={setChangeChatNameOpen}
              chat={chat}
            ></ChangeChatNameDialog>
          ),
          hidden: !isGroupChat,
        },
        {
          content: (
            <>
              <Image></Image>
              <span>Change chat avatar</span>
            </>
          ),
          onClick: () => {
            setChangeChatAvatarOpen(true);
          },
          dialog: (
            <ChangeChatAvatarDialog
              isOpen={isChangeChatAvatarOpen}
              setOpen={setChangeChatAvatarOpen}
              chat={chat}
            ></ChangeChatAvatarDialog>
          ),
          hidden: !isGroupChat,
        },
        {
          content: (
            <>
              <span>{chat.chatEmoji}</span>
              <span>Change emote</span>
            </>
          ),
          onClick: () => {
            setChangeChatEmojiOpen(true);
          },
          dialog: (
            <ChangeChatEmojiDialog
              isOpen={isChangeChatEmojiOpen}
              setOpen={setChangeChatEmojiOpen}
              chat={chat}
            ></ChangeChatEmojiDialog>
          ),
        },
        {
          content: (
            <>
              <span>Aa</span>
              <span>Change nicknames</span>
            </>
          ),
          onClick: () => {
            setChangeNicknamesOpen(true);
          },
          dialog: (
            <ChangeNicknamesDialog
              isOpen={isChangeNicknamesOpen}
              setOpen={setChangeNicknamesOpen}
              chat={chat}
            ></ChangeNicknamesDialog>
          ),
        },
      ]}
      title="Chat Configuration"
    ></MyCollapsible>
  );
};

export default CollapsibleChatConfig;
