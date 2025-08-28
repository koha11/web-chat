import { Check, Edit, X } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";

import { useChangeChatEmoji, useChangeNickname } from "../../hooks/chat.hook";
import { useState } from "react";
import { IChat } from "../../interfaces/chat.interface";
import { IUser } from "../../interfaces/user.interface";
import MyEmojiPicker from "../ui/my-emoji-picker";

const ChangeChatEmojiDialog = ({
  isOpen,
  setOpen,
  chat,
}: {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  chat: IChat;
}) => {
  const [changeChatEmoji] = useChangeChatEmoji();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <DialogContent className="justify-center">
        <MyEmojiPicker
          onEmojiSelect={async ({ native: emoji, unified }: any) => {
            await changeChatEmoji({ variables: { chatId: chat.id, emoji } });
            setOpen(false);
          }}
        ></MyEmojiPicker>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeChatEmojiDialog;
