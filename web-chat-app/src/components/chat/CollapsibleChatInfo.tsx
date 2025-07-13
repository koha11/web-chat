import { PinIcon } from "lucide-react";
import MyCollapsible from "../ui/my-collapsible";

const CollapsibleChatInfo = ({}: {}) => {
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
          onClick: () => {},
        },
      ]}
      title="Chat Information"
    ></MyCollapsible>
  );
};

export default CollapsibleChatInfo;
