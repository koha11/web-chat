import { Check, Edit, X } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";

import { useChangeChatName, useChangeNickname } from "../../hooks/chat.hook";
import { useState } from "react";
import { IChat } from "../../interfaces/chat.interface";
import { IUser } from "../../interfaces/user.interface";
import { useForm } from "react-hook-form";

const ChangeChatNameDialog = ({
  isOpen,
  setOpen,
  chat,
}: {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  chat: IChat;
}) => {
  const [changeChatName] = useChangeChatName();

  const { register, watch, resetField, getValues } = useForm<{
    chatId: string;
    chatName: string;
  }>({
    defaultValues: {
      chatId: chat.id,
      chatName: chat.chatName,
    },
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setOpen(open);
        resetField("chatName");
      }}
    >
      <DialogContent>
        <DialogHeader className="border-b-2">
          <DialogTitle className="text-center text-2xl mb-2">
            Chat Name
          </DialogTitle>
        </DialogHeader>
        <div className="flex gap-6 flex-col py-2">
          <div className=" rounded-full flex items-center justify-center">
            <Input {...register("chatName")}></Input>
          </div>
          <div className="flex justify-end items-center gap-4">
            <Button
              variant={"outline"}
              className=" cursor-pointer"
              onClick={() => {
                resetField("chatName");
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-800 cursor-pointer"
              onClick={async () => {
                await changeChatName({ variables: { ...getValues() } });
                resetField("chatName");
                setOpen(false);
              }}
              disabled={watch("chatName") == chat.chatName}
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeChatNameDialog;
