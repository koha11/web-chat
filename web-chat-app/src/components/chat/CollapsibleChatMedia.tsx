import {
  File,
  Image,
  Link,
} from "lucide-react";
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
