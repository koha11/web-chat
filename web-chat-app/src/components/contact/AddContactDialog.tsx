import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import Cookies from "js-cookie";

import Loading from "../ui/loading";
import { useHandleRequest, useSendRequest } from "../../hooks/contact.hook";
import { useGetConnectableUsers } from "../../hooks/user.hook";
import { useEffect, useState } from "react";
import ConnectableUsersList from "./ConnectableUsersList";

const AddContactDialog = ({
  isOpen,
  setOpen,
}: {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}) => {
  const userId = Cookies.get("userId") ?? "";

  const [searchValue, setSearchValue] = useState("");
  const [draft, setDraft] = useState(searchValue);

  const { data: connectableUsersConnection, loading: isConnectableUsers } =
    useGetConnectableUsers({
      userId,
      search: searchValue,
    });

  // keep draft in sync if the external value changes
  useEffect(() => setDraft(searchValue), [searchValue]);

  // push to parent state after user pauses typing
  useEffect(() => {
    const t = setTimeout(() => setSearchValue(draft), 300);
    return () => clearTimeout(t);
  }, [draft, setSearchValue]);

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
            <Input
              placeholder="Search for people"
              className="px-6"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            ></Input>
            <Search
              className="absolute left-1.5 top-[50%] translate-y-[-50%]"
              size={14}
            ></Search>
          </div>
          <ConnectableUsersList
            connectableUsersConnection={connectableUsersConnection}
            userId={userId}
            searchValue={searchValue}
          ></ConnectableUsersList>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddContactDialog;
