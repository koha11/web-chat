import { LogOut, MessageCircleWarning } from "lucide-react";
import MyCollapsible from "../ui/my-collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useState } from "react";

const CollapsibleChatPrivacy = ({}: {}) => {
  const [isLeaveGroupDialogOpen, setLeaveGroupDialogOpen] = useState(false);
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
          onClick: () => {
            setLeaveGroupDialogOpen(true);
          },
          dialog: (
            <AlertDialog
              open={isLeaveGroupDialogOpen}
              onOpenChange={setLeaveGroupDialogOpen}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="cursor-pointer">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 cursor-pointer"
                    onClick={() => {
                      console.log("leave group");
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ),
        },
      ]}
      title="Chat Privacy"
    ></MyCollapsible>
  );
};

export default CollapsibleChatPrivacy;
