import AddContactDialog from "@/components/contact/AddContactDialog";
import ReceivedConnectRequestDialog from "@/components/contact/ReceivedConnectRequestDialog";
import SentConnectRequestDialog from "@/components/contact/SentConnectRequestDialog";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/loading";
import { useHandleRequest } from "@/hooks/contact.hook";
import {
  useGetReceivedConnectRequests,
  useGetSentConnectRequests,
} from "@/hooks/user.hook";
import { Plus } from "lucide-react";
import { useState } from "react";
import Cookies from "js-cookie";

const ContactActionBar = () => {
  const userId = Cookies.get("userId")!;

  const {
    data: receivedConnectRequests,
    loading: isReceivedConnectRequestsLoading,
  } = useGetReceivedConnectRequests({});

  const { data: sentConnectRequests, loading: isSentConnectRequests } =
    useGetSentConnectRequests({});

  const [handleRequest] = useHandleRequest({ userId });

  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [isReceivedRequestDialogOpen, setReceivedRequestDialogOpen] =
    useState(false);
  const [isSentRequestDialogOpen, setSentRequestDialogOpen] = useState(false);

  if (isReceivedConnectRequestsLoading || isSentConnectRequests)
    return <Loading></Loading>;

  return (
    <div className="h-[10%] flex items-center justify-between py-4 px-2">
      <div className="flex items-center justify-baseline gap-4">
        <Button
          variant={"outline"}
          className="cursor-pointer rounded-xl relative"
          onClick={() => setReceivedRequestDialogOpen(true)}
        >
          <span>Received Requests</span>
          {receivedConnectRequests?.edges.length != 0 && (
            <div className="absolute h-5 w-5 bg-red-700 rounded-full flex justify-center items-center font-bold text-[0.6rem] text-white -right-2 -top-2">
              {receivedConnectRequests?.edges.length}
            </div>
          )}
        </Button>
        <Button
          variant={"outline"}
          className="cursor-pointer rounded-xl relative"
          onClick={() => setSentRequestDialogOpen(true)}
        >
          <span>Sent Requests</span>
          {sentConnectRequests?.edges.length != 0 && (
            <div className="absolute h-5 w-5 bg-gray-700 rounded-full flex justify-center items-center font-bold text-[0.6rem] text-white -right-2 -top-2">
              {sentConnectRequests?.edges.length}
            </div>
          )}
        </Button>
      </div>
      <Button
        variant={"outline"}
        className="cursor-pointer"
        onClick={() => setAddDialogOpen(true)}
      >
        <Plus></Plus>
        <b>Add contact</b>
      </Button>
      <AddContactDialog
        isOpen={isAddDialogOpen}
        setOpen={setAddDialogOpen}
      ></AddContactDialog>

      <ReceivedConnectRequestDialog
        isOpen={isReceivedRequestDialogOpen}
        setOpen={setReceivedRequestDialogOpen}
        handleRequest={handleRequest}
        receivedConnectRequests={receivedConnectRequests!}
      ></ReceivedConnectRequestDialog>

      <SentConnectRequestDialog
        isOpen={isSentRequestDialogOpen}
        setOpen={setSentRequestDialogOpen}
        handleRequest={handleRequest}
        sentConnectRequests={sentConnectRequests!}
      ></SentConnectRequestDialog>
    </div>
  );
};

export default ContactActionBar;
