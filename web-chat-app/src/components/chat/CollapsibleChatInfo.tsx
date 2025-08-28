import { PinIcon } from "lucide-react";
import MyCollapsible from "../ui/my-collapsible";
import { useState } from "react";

const CollapsibleChatInfo = ({}: {}) => {
  const [isOpen, setOpen] = useState(false);
  return (
    <MyCollapsible
      data={[
        {
          content: (
            <>
              <PinIcon></PinIcon>
              <span>Pinned messages</span>
            </>
          ),
          onClick: () => {
            setOpen(true);
          },
          // dialog: (
          //   <PinnedMessagesDialog
          //     isOpen={isOpen}
          //     setOpen={setOpen}
          //   ></PinnedMessagesDialog>
          // ),
        },
      ]}
      title="Chat Information"
    ></MyCollapsible>
  );
};

export default CollapsibleChatInfo;
