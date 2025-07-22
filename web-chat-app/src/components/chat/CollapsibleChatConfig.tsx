import { Edit, Hand, Image } from "lucide-react";

import { useState } from "react";
import MyCollapsible from "../ui/my-collapsible";
import ChangeNicknamesDialog from "./ChangeNicknamesDialog";
import { IChat } from "../../interfaces/chat.interface";
import ChangeChatAvatarDialog from "./ChangeChatAvatarDialog";
import ChangeChatNameDialog from "./ChangeChatNameDialog";

const CollapsibleChatConfig = ({ chat }: { chat: IChat }) => {
  const isGroupChat = chat.users.length > 2;

  const [isChangeNicknamesOpen, setChangeNicknamesOpen] = useState(false);
  const [isChangeChatAvatarOpen, setChangeChatAvatarOpen] = useState(false);
  const [isChangeChatNameOpen, setChangeChatNameOpen] = useState(false);

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
              <Hand></Hand>
              <span>Change emote</span>
            </>
          ),
          onClick: () => {},
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
