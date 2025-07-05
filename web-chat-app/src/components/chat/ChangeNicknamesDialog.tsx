import { Check, Edit, Search, X } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import Cookies from "js-cookie";

import {
  useChangeNickname,
  useGetChats,
  usePostChat,
} from "../../hooks/chat.hook";
import Loading from "../ui/loading";
import { useGetContacts } from "../../hooks/contact.hook";
import { useEffect, useState } from "react";
import { IChat } from "../../interfaces/chat.interface";
import { IUser } from "../../interfaces/user.interface";

const ChangeNicknamesDialog = ({
  isOpen,
  setOpen,
  chat,
}: {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  chat: IChat;
}) => {
  const [isEditNickname, setEditNickname] = useState("");
  const [changedNickname, setChangedNickname] = useState("");

  const [changeNickname] = useChangeNickname();

  const reset = () => {
    setChangedNickname("");
    setEditNickname("");
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setOpen(open);
        reset();
      }}
    >
      <DialogContent>
        <DialogHeader className="border-b-2">
          <DialogTitle className="text-center text-2xl mb-2">
            Nicknames
          </DialogTitle>
        </DialogHeader>
        <div className="flex gap-6 flex-col py-2">
          {(chat.users as IUser[]).map((user) => {
            const isEdit = isEditNickname == user.id;
            const hasNickname = chat.nicknames[user.id] != user.fullname;
            const nickname = chat.nicknames[user.id];

            return (
              <div
                key={user.id}
                className="flex justify-between items-center cursor-pointer rounded-md"
                onClick={() => {
                  setEditNickname(user.id);
                  setChangedNickname(nickname);
                }}
              >
                <div className="flex items-center gap-4 w-full">
                  <div
                    className={`w-12 h-12 rounded-full bg-contain bg-no-repeat bg-center`}
                    style={{ backgroundImage: `url(${user.avatar})` }}
                  ></div>
                  {isEdit ? (
                    <div className="text-sm w-[80%]">
                      <Input
                        className="w-full"
                        placeholder={!hasNickname ? user.fullname : ""}
                        value={changedNickname}
                        autoFocus={true}
                        onChange={(e) => setChangedNickname(e.target.value)}
                      ></Input>
                    </div>
                  ) : (
                    <div className="text-sm">
                      <div className="font-bold">{nickname}</div>
                      <div>
                        {hasNickname ? user.fullname : "Place nickname"}
                      </div>
                    </div>
                  )}
                </div>
                {isEdit && (
                  <Button
                    className="rounded-full bg-white text-black hover:bg-gray-300 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      reset();
                    }}
                  >
                    <X></X>
                  </Button>
                )}
                <Button
                  className="rounded-full bg-white text-black hover:bg-gray-300 cursor-pointer"
                  onClick={(e) => {
                    if (isEdit && changedNickname != "") {
                      e.stopPropagation();
                      changeNickname({
                        variables: {
                          chatId: chat.id,
                          changedUserId: user.id,
                          nickname: changedNickname,
                        },
                      });
                      reset();
                    }
                  }}
                >
                  {isEdit ? <Check></Check> : <Edit></Edit>}
                </Button>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeNicknamesDialog;
