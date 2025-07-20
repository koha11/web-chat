import { Check, Edit, X } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";

import { useChangeChatAvatar, useChangeNickname } from "../../hooks/chat.hook";
import { useEffect, useRef, useState } from "react";
import { IChat } from "../../interfaces/chat.interface";
import { IUser } from "../../interfaces/user.interface";
import { Label } from "../ui/label";
import { useForm } from "react-hook-form";

const ChangeChatAvatarDialog = ({
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

  const avatarRef = useRef<HTMLImageElement>(null);

  const { register, watch } = useForm<{ fileList: FileList }>();

  const [changeChatAvatar] = useChangeChatAvatar();

  const reset = () => {
    setChangedNickname("");
    setEditNickname("");
  };

  useEffect(() => {
    const fileList = watch("fileList");

    if (fileList && fileList.length > 0) {
      const file = fileList.item(0)!;
      const url = URL.createObjectURL(file);

      avatarRef.current!.src = url;
    }
  }, [watch("fileList")]);

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
            Chat Avatar
          </DialogTitle>
        </DialogHeader>
        <div className="flex gap-6 flex-col py-2">
          <div className="relative rounded-full flex items-center justify-center">
            <img
              src={chat.chatAvatar}
              ref={avatarRef}
              className="object-contain rounded-full w-[80%]"
            ></img>
            <Input
              id="chat-avatar-input"
              type="file"
              accept="image/*"
              hidden
              {...register("fileList")}
            ></Input>
            <Button className="absolute top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%] cursor-pointer opacity-10 rounded-full w-[40%] hover:opacity-90">
              <Label
                htmlFor="chat-avatar-input"
                className="cursor-pointer w-full h-full justify-center"
              >
                Change Avatar
              </Label>
            </Button>
          </div>
          <div className="flex justify-end items-center gap-4">
            <Button
              variant={"outline"}
              className=" cursor-pointer"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-800 cursor-pointer"
              onClick={async () => {
                await changeChatAvatar({
                  variables: {
                    chatId: chat.id,
                    file: watch("fileList").item(0),
                  },
                });

                setOpen(false);
              }}
              disabled={!watch("fileList")}
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeChatAvatarDialog;
