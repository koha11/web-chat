import { Search, X } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import Cookies from "js-cookie";

import Loading from "../ui/loading";
import { useHandleRequest, useSendRequest } from "../../hooks/contact.hook";
import {
  useGetChatAddableUsers,
  useGetConnectableUsers,
} from "../../hooks/user.hook";
import { useEffect, useState } from "react";
import { Form } from "react-router-dom";
import { useForm } from "react-hook-form";
import { IUser } from "@/interfaces/user.interface";
import { useAddMembers } from "@/hooks/chat.hook";

const AddMembersDialog = ({
  isOpen,
  setOpen,
  chatId,
}: {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  chatId: string;
}) => {
  const userId = Cookies.get("userId") ?? "";

  const {
    data: chatAddableUsersConnection,
    loading: isChatAddableUsersLoading,
  } = useGetChatAddableUsers({
    userId,
    chatId,
  });

  const [choosenUsers, setChoosenUsers] = useState<IUser[]>();

  const [addMembers, { loading: isAddingMembers }] = useAddMembers({ userId });

  if (isChatAddableUsersLoading) return <Loading></Loading>;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) setChoosenUsers(undefined);
      }}
    >
      <DialogContent>
        <DialogHeader className="border-b-2">
          <DialogTitle className="text-center text-2xl mb-2">
            Add Members
          </DialogTitle>
        </DialogHeader>
        <Form>
          <div className="overflow-y-scroll space-y-2 px-4 h-[400px] relative">
            <div className="sticky top-0 z-10 bg-white shadow-2xs">
              <div className="relative">
                <Input placeholder="Search for people" className="px-6"></Input>
                <Search
                  className="absolute left-1.5 top-[50%] translate-y-[-50%]"
                  size={14}
                ></Search>
              </div>
              <div className="h-[5rem] flex items-center gap-2">
                {choosenUsers?.map((user) => {
                  return (
                    <div className="relative rounded-full">
                      <div
                        className={`w-12 h-12 rounded-full bg-contain bg-no-repeat bg-center`}
                        style={{
                          backgroundImage: `url(${user.avatar})`,
                        }}
                      ></div>
                      <Button
                        className="absolute right-0 top-0 bg-gray-300 opacity-80 cursor-pointer hover:opacity-60"
                        size={"no_style"}
                        variant={"no_style"}
                        onClick={() => {
                          setChoosenUsers((prev) =>
                            prev
                              ? prev.filter(
                                  (prevUser) => prevUser.id != user.id
                                )
                              : undefined
                          );
                        }}
                      >
                        <X></X>
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="py-2 min-h-[40rem]">
              <span className="font-bold">Suggested People</span>

              <div className="py-2">
                {chatAddableUsersConnection?.edges.map((edge) => {
                  const user = edge.node;
                  return (
                    <div
                      key={user.id}
                      className="flex items-center justify-between px-3 py-2 rounded-2xl hover:bg-gray-300"
                    >
                      <div className="flex gap-4 items-center">
                        <div
                          className={`w-8 h-8 rounded-full bg-contain bg-no-repeat bg-center`}
                          style={{
                            backgroundImage: `url(${user.avatar})`,
                          }}
                        ></div>
                        <span className="font-bold">{user.fullname}</span>
                      </div>
                      {choosenUsers?.includes(user) ? (
                        <Button
                          className="cursor-pointer h-8 w-16 bg-gray-400 text-white"
                          variant={"outline"}
                          onClick={() => {
                            setChoosenUsers((prev) =>
                              prev
                                ? prev.filter(
                                    (prevUser) => prevUser.id != user.id
                                  )
                                : undefined
                            );
                          }}
                        >
                          Cancel
                        </Button>
                      ) : (
                        <Button
                          className="cursor-pointer h-8 w-16 bg-blue-400 text-white"
                          variant={"outline"}
                          onClick={() => {
                            setChoosenUsers((prev) => [...(prev ?? []), user]);
                          }}
                        >
                          Add
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <DialogFooter className="flex gap-8 mt-4">
            <Button
              className="cursor-pointer bg-gray-400"
              onClick={() => {
                setChoosenUsers(undefined);
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              className="cursor-pointer bg-green-700"
              disabled={choosenUsers == undefined || choosenUsers.length == 0}
              onClick={async () => {
                if (!isAddingMembers) {
                  await addMembers({
                    variables: {
                      chatId,
                      userIds: choosenUsers!.map((user) => user.id),
                    },
                  });
                  setChoosenUsers(undefined);
                  setOpen(false);
                }
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMembersDialog;
