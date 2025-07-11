import { Phone, Video, X } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { IUser } from "../../interfaces/user.interface";

const OngoingCallDialog = ({
  isOpen,
  setOpen,
  user,
  hasVideo,
  chatId,
}: {
  isOpen: boolean;
  setOpen: Function;
  user: IUser;
  hasVideo: boolean;
  chatId: string;
}) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="w-[240px] min-h-[240px]">
        <DialogHeader className="">
          <DialogTitle className="text-center text-sm">
            Ongoing call
          </DialogTitle>
        </DialogHeader>
        <div className="px-2 flex flex-col items-center gap-4">
          <div
            className={`w-16 h-16 rounded-full bg-contain bg-no-repeat bg-center`}
            style={{ backgroundImage: `url(${user.avatar})` }}
          ></div>
          <div className="font-bold text-xl text-center">
            {user.fullname} is calling you
          </div>
          <div className="flex justify-between items-center gap-6">
            <Button
              variant={"destructive"}
              className="rounded-full cursor-pointer"
              onClick={() => {
                setOpen(null);
              }}
            >
              <X></X>
            </Button>
            <Button
              className="rounded-full cursor-pointer bg-green-700"
              onClick={() => {
                setOpen(null);
                window.open(
                  `/call?has_video=${hasVideo}&initialize_video=${hasVideo}&room_id=${chatId}`,
                  "_blank",
                  "width=1300,height=600,location=no,toolbar=no"
                );
              }}
            >
              {hasVideo ? <Video></Video> : <Phone></Phone>}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OngoingCallDialog;
