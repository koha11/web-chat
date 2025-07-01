import {
  ChevronDown,
  ChevronUp,
  File,
  Image,
  Link,
  PinIcon,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { useState } from "react";
import MyCollapsible from "../ui/my-collapsible";

const CollapsibleChatMedia = ({}: {}) => {
  return (
    <MyCollapsible
      data={[
        {
          content: (
            <>
              <Image></Image>
              <span>Media File</span>
            </>
          ),
          onClick: () => {},
        },
        {
          content: (
            <>
              <File></File>
              <span>File</span>
            </>
          ),
          onClick: () => {},
        },
        {
          content: (
            <>
              <Link></Link>
              <span>Link</span>
            </>
          ),
          onClick: () => {},
        },
      ]}
      title="Media files, files and links"
    ></MyCollapsible>
  );
};

export default CollapsibleChatMedia;
