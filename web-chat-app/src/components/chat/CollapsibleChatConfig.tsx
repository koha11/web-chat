import {
  ChevronDown,
  ChevronUp,
  Edit,
  Hand,
  Image,
  PinIcon,
  TextQuote,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { useState } from "react";
import MyCollapsible from "../ui/my-collapsible";
import ChangeNicknamesDialog from "./ChangeNicknamesDialog";
import { IChat } from "../../interfaces/chat.interface";

const CollapsibleChatConfig = ({chat}: {chat: IChat}) => {
  const [isChangeNicknamesOpen, setChangeNicknamesOpen] = useState(false);

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
          onClick: () => {},
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
