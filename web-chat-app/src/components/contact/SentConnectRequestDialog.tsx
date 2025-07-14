import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useGetSentConnectRequests } from "../../hooks/user.hook";
import Loading from "../ui/loading";
import { Button } from "../ui/button";
import { X } from "lucide-react";

const SentConnectRequestDialog = ({
  isOpen,
  setOpen,
}: {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { data: sentConnectRequest, loading: isSentConnectRequest } =
    useGetSentConnectRequests({});

  if (isSentConnectRequest) return <Loading></Loading>;

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader className="border-b-2">
          <DialogTitle className="text-center text-2xl mb-2">
            Sent Connect Requests
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-scroll space-y-2 px-4 h-[400px] relative">
          <div className="py-2">
            {sentConnectRequest?.edges.map((edge) => {
              const user = edge.node;
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
                      className="cursor-pointer bg-gray-400 text-white rounded-2xl"
                      variant={"outline"}
                      onClick={() => {}}
                    >
                      Cancel
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

export default SentConnectRequestDialog;
