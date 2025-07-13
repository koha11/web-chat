import {
  LogOut,
  MessageCircleWarning,
} from "lucide-react";
import MyCollapsible from "../ui/my-collapsible";

const CollapsibleChatPrivacy = ({}: {}) => {
  return (
    <MyCollapsible
      data={[
        {
          content: (
            <>
              <MessageCircleWarning></MessageCircleWarning>
              <span>Report chat</span>
            </>
          ),
          onClick: () => {},
        },
        {
          content: (
            <>
              <LogOut></LogOut>
              <span>Leave group</span>
            </>
          ),
          onClick: () => {},
        },
      ]}
      title="Chat Privacy"
    ></MyCollapsible>
  );
};

export default CollapsibleChatPrivacy;
