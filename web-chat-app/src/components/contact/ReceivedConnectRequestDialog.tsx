import { Check, X } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useGetReceivedConnectRequests } from "../../hooks/user.hook";
import Loading from "../ui/loading";
import { useHandleRequest } from "../../hooks/contact.hook";

const ReceivedConnectRequestDialog = ({
  isOpen,
  setOpen,
}: {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const {
    data: receivedConnectRequests,
    loading: isReceivedConnectRequestsLoading,
  } = useGetReceivedConnectRequests({});

  const [handleRequest] = useHandleRequest({});

  if (isReceivedConnectRequestsLoading) return <Loading></Loading>;

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
            {receivedConnectRequests?.edges.map((edge) => {
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
                      className="cursor-pointer bg-red-600 text-white rounded-2xl"
                      variant={"outline"}
                      onClick={() => {
                        handleRequest({
                          variables: {
                            contactId: edge.cursor,
                            isAccepted: false,
                          },
                        });
                      }}
                    >
                      <X></X>
                    </Button>
                    <Button
                      className="cursor-pointer bg-green-400 text-white rounded-2xl"
                      variant={"outline"}
                      onClick={() => {
                        handleRequest({
                          variables: {
                            contactId: edge.cursor,
                            isAccepted: true,
                          },
                        });
                      }}
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
