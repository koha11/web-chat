import { File, Image, Link } from "lucide-react";
import MyCollapsible from "../ui/my-collapsible";
import ChatFileDiaglog from "./ChatFileDiaglog";
import { useState } from "react";

const CollapsibleChatMedia = ({}: {}) => {
  const [isOpen, setOpen] = useState(false);
  const [value, setValue] = useState<"media-files" | "files">("media-files");

  return (
    <>
      <MyCollapsible
        data={[
          {
            content: (
              <>
                <Image></Image>
                <span>Media Files</span>
              </>
            ),
            onClick: () => {
              setOpen(true);
              setValue("media-files");
            },
          },
          {
            content: (
              <>
                <File></File>
                <span>Files</span>
              </>
            ),
            onClick: () => {
              setOpen(true);
              setValue("files");
            },
          },
        ]}
        title="Media files and files"
      ></MyCollapsible>

      <ChatFileDiaglog
        isOpen={isOpen}
        setOpen={setOpen}
        value={value}
      ></ChatFileDiaglog>
    </>
  );
};

export default CollapsibleChatMedia;
