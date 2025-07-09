import { Phone, X } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

const OngoingCallDialog = ({
  isOpen,
  setOpen,
}: {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="w-[240px] min-h-[240px]">
        <DialogHeader className="">
          <DialogTitle className="text-center text-sm">
            Ongoing call
          </DialogTitle>
        </DialogHeader>
        <div className="px-2 flex flex-col items-center gap-4">
          <div
            className={`w-8 h-8 rounded-full bg-contain bg-no-repeat bg-center`}
            style={{ backgroundImage: `url(/assets/images/google-logo.png)` }}
          ></div>
          <div className="font-bold text-xl text-center">
            Name is calling you
          </div>
          <div className="flex justify-between items-center gap-6">
            <Button
              variant={"destructive"}
              className="rounded-full cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <X></X>
            </Button>
            <Button className="rounded-full cursor-pointer bg-green-700">
              <Phone></Phone>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OngoingCallDialog;
