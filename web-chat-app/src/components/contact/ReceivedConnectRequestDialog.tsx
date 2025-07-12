import { Check, Search, X } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import Cookies from "js-cookie";
import { useGetConnectableUsers } from "../../hooks/user.hook";
import Loading from "../ui/loading";

const ReceivedConnectRequestDialog = ({
  isOpen,
  setOpen,
}: {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const userId = Cookies.get("userId") ?? "";

  const { data: connectableUsers, loading: isConnectableUsers } =
    useGetConnectableUsers({
      userId,
    });

  if (isConnectableUsers) return <Loading></Loading>;

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader className="border-b-2">
          <DialogTitle className="text-center text-2xl mb-2">
            Received Connect Requests
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-scroll space-y-2 px-4 h-[400px] relative">
          <div className="py-2">
            {connectableUsers!.map((user) => {
              return (
                <div className="flex items-center justify-between px-3 py-2 rounded-2xl hover:bg-gray-300">
                  <div className="flex gap-4 items-center">
                    <div
                      className={`w-8 h-8 rounded-full bg-contain bg-no-repeat bg-center`}
                      style={{
                        backgroundImage: `url(${user.avatar})`,
                      }}
                    ></div>
                    <span className="font-bold">{user.fullname}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button
                      className="cursor-pointer bg-red-600 text-white rounded-2xl"
                      variant={"outline"}
                      onClick={() => {}}
                    >
                      <X></X>
                    </Button>
                    <Button
                      className="cursor-pointer bg-green-400 text-white rounded-2xl"
                      variant={"outline"}
                      onClick={() => {}}
                    >
                      <Check></Check>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReceivedConnectRequestDialog;
