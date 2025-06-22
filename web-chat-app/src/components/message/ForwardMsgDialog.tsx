import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";

const ForwardMsgDialog = ({
  isOpen,
  setOpen,
}: {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <DialogHeader className="border-b-2">
          <DialogTitle className="text-center text-2xl mb-2">
            Forward
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-scroll space-y-2 px-4 h-[400px] relative">
          <div className="sticky py-2 top-0 z-10 bg-white shadow-2xs">
            <Input placeholder="Search for people" className="px-6"></Input>
            <Search
              className="absolute left-1.5 top-[50%] translate-y-[-50%]"
              size={14}
            ></Search>
          </div>
          <div>
            <span className="font-bold">Recent</span>
            <div className="py-2">
              <div className="flex items-center justify-between px-3 py-2 rounded-2xl hover:bg-gray-300">
                <div className="flex gap-4 items-center">
                  <div
                    className={`w-8 h-8 rounded-full bg-contain bg-no-repeat bg-center`}
                    style={{
                      backgroundImage: `url(/assets/images/demo_user_avatar_1.JPG)`,
                    }}
                  ></div>
                  <span className="font-bold">Koha Tran</span>
                </div>
                <Button
                  className="cursor-pointer h-8 w-16 bg-blue-400 text-white"
                  variant={"outline"}
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
          <div>
            <span className="font-bold">Groups</span>
            <div></div>
          </div>
          <div className="h-[1000px]">
            <span className="font-bold">Contacts</span>
            <div></div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ForwardMsgDialog;
