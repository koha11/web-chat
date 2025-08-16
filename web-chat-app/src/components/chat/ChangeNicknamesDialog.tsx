import { Check, Edit, X } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";

import { useChangeNickname } from "../../hooks/chat.hook";
import { useState } from "react";
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

  const handleChangedNickname = async ({
    e,
    isEdit,
    userId,
  }: {
    e: any;
    isEdit: boolean;
    userId: string;
  }) => {
    if (isEdit && changedNickname != "") {
      e.stopPropagation();
      await changeNickname({
        variables: {
          chatId: chat.id,
          changedUserId: userId,
          nickname: changedNickname,
        },
      });
      reset();
    }
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
          {Object.keys(chat.usersInfo).map((userId) => {
            const isEdit = isEditNickname == userId;

            const { avatar, fullname, nickname } = chat.usersInfo[userId];

            const hasNickname = nickname != fullname;

            return (
              <div
                key={userId}
                className="flex justify-between items-center cursor-pointer rounded-md"
                onClick={() => {
                  if (!isEdit) {
                    setEditNickname(userId);
                    setChangedNickname(nickname);
                  }
                }}
              >
                <div className="flex items-center gap-4 w-full">
                  <div
                    className={`w-12 h-12 rounded-full bg-contain bg-no-repeat bg-center`}
                    style={{ backgroundImage: `url(${avatar})` }}
                  ></div>

                  {isEdit ? (
                    <div className="text-sm w-[80%]">
                      <Input
                        className="w-full"
                        placeholder={!hasNickname ? fullname : ""}
                        value={changedNickname}
                        autoFocus={true}
                        onChange={(e) => setChangedNickname(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key == "Enter")
                            handleChangedNickname({ e, isEdit, userId });
                        }}
                      ></Input>
                    </div>
                  ) : (
                    <div className="text-sm">
                      <div className="font-bold">{nickname}</div>
                      <div>{hasNickname ? fullname : "Place nickname"}</div>
                    </div>
                  )}
                </div>

                {/* close btn */}
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

                {/* confirm btn  */}
                <Button
                  className="rounded-full bg-white text-black hover:bg-gray-300 cursor-pointer"
                  onClick={(e) => handleChangedNickname({ e, isEdit, userId })}
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
