import { Edit, Hand, Image } from "lucide-react";

import { useState } from "react";
import MyCollapsible from "../ui/my-collapsible";
import ChangeNicknamesDialog from "./ChangeNicknamesDialog";
import { IChat } from "../../interfaces/chat.interface";
import ChangeChatAvatarDialog from "./ChangeChatAvatarDialog";

const CollapsibleChatConfig = ({ chat }: { chat: IChat }) => {
  const [isChangeNicknamesOpen, setChangeNicknamesOpen] = useState(false);
  const [isChangeAvatarOpen, setChangeAvatarOpen] = useState(false);

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
          onClick: () => {},
        },
        {
          content: (
            <>
              <Image></Image>
              <span>Change chat avatar</span>
            </>
          ),
          onClick: () => {
            setChangeAvatarOpen(true);
          },
          dialog: (
            <ChangeChatAvatarDialog
              isOpen={isChangeAvatarOpen}
              setOpen={setChangeAvatarOpen}
              chat={chat}
            ></ChangeChatAvatarDialog>
          ),
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
