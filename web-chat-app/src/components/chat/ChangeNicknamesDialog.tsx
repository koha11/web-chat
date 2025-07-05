import { Check, Edit, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import Cookies from "js-cookie";

import { useGetChats, usePostChat } from "../../hooks/chat.hook";
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

  return (
    <Dialog open={true} onOpenChange={setOpen}>
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
                onClick={() => setEditNickname(user.id)}
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
                        value={hasNickname ? nickname : ""}
                        onBlur={() => setEditNickname("")}
                        autoFocus={true}
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
                <Button className="rounded-full bg-white text-black hover:bg-gray-300 cursor-pointer">
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
