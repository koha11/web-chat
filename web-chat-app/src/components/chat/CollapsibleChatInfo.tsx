import { ChevronDown, ChevronUp, PinIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { useState } from "react";
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
