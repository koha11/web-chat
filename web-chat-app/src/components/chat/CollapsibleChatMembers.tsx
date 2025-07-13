import { PinIcon } from "lucide-react";
import MyCollapsible from "../ui/my-collapsible";

const CollapsibleChatMembers = ({}: {}) => {
  return (
    <MyCollapsible
      data={[
        {
          content: (
            <>
              <PinIcon></PinIcon>
              <span>Pin messages</span>
            </>
          ),
          onClick: () => {},
        },
      ]}
      title="Chat Members"
    ></MyCollapsible>
  );
};

export default CollapsibleChatMembers;
