import { ChevronDown, ChevronUp, PinIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { useState } from "react";
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
