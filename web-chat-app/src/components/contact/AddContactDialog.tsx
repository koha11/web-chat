import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import Cookies from "js-cookie";

import Loading from "../ui/loading";
import { useSendRequest } from "../../hooks/contact.hook";
import { useGetConnectableUsers } from "../../hooks/user.hook";

const AddContactDialog = ({
  isOpen,
  setOpen,
}: {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}) => {
  const userId = Cookies.get("userId") ?? "";

  const { data: connectableUsersConnection, loading: isConnectableUsers } =
    useGetConnectableUsers({
      userId,
    });

  const [sendRequest] = useSendRequest({});

  if (isConnectableUsers) return <Loading></Loading>;

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader className="border-b-2">
          <DialogTitle className="text-center text-2xl mb-2">
            Add Contact
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
          <div className="h-[1000px]">
            <span className="font-bold">Suggested People</span>

            <div className="py-2">
              {connectableUsersConnection?.edges.map((edge) => {
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
                    <Button
                      className="cursor-pointer h-8 w-16 bg-blue-400 text-white"
                      variant={"outline"}
                      onClick={() => {
                        sendRequest({ variables: { userId: user.id } });
                      }}
                    >
                      Connect
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddContactDialog;
