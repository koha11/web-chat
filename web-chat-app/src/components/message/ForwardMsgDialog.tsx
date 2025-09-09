import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import Cookies from "js-cookie";

import { useGetChats, usePostChat } from "../../hooks/chat.hook";
import Loading from "../ui/loading";
import { useGetContacts } from "../../hooks/contact.hook";
import { useEffect } from "react";
import { useChatDetailContext } from "@/hooks/useChatDetailContext";

const ForwardMsgDialog = ({
  isOpen,
  setOpen,
  handleSendMsg,
}: {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  handleSendMsg: (chatId: string) => void;
}) => {
  const {userId } = useChatDetailContext()

  const { data: chatConnection, loading: isChatLoading } = useGetChats({
    userId,
  });

  const { data: contactConnection, loading: isContactLoading } = useGetContacts(
    {}
  );

  const [postChat, { data: createdChat }] = usePostChat({ userId });

  useEffect(() => {
    if (createdChat) handleSendMsg(createdChat.postChat.id);
  }, [createdChat]);

  if (isChatLoading || isContactLoading) return <Loading></Loading>;

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader className="border-b-2">
          <DialogTitle className="text-center text-2xl mb-2">
            Forward
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
          <div>
            <span className="font-bold">Recent</span>
            <div className="py-2">
              {chatConnection?.edges.map((edge) => (
                <div className="flex items-center justify-between px-3 py-2 rounded-2xl hover:bg-gray-300">
                  <div className="flex gap-4 items-center">
                    <div
                      className={`w-8 h-8 rounded-full bg-contain bg-no-repeat bg-center`}
                      style={{
                        backgroundImage: `url(${edge.node.chatAvatar})`,
                      }}
                    ></div>
                    <span className="font-bold">{edge.node.chatName}</span>
                  </div>
                  <Button
                    className="cursor-pointer h-8 w-16 bg-blue-400 text-white"
                    variant={"outline"}
                    onClick={() => {
                      handleSendMsg(edge.node.id);
                    }}
                  >
                    Send
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <span className="font-bold">Groups</span>
            <div></div>
          </div>
          <div className="">
            <span className="font-bold">Contacts</span>
            <div className="py-2">
              {contactConnection?.edges.map((edge) => {
                const contact = edge.node.users.filter(
                  (user) => user.id != userId
                )[0];
                return (
                  <div className="flex items-center justify-between px-3 py-2 rounded-2xl hover:bg-gray-300">
                    <div className="flex gap-4 items-center">
                      <div
                        className={`w-8 h-8 rounded-full bg-contain bg-no-repeat bg-center`}
                        style={{
                          backgroundImage: `url(${contact.avatar})`,
                        }}
                      ></div>
                      <span className="font-bold">{contact.fullname}</span>
                    </div>
                    <Button
                      className="cursor-pointer h-8 w-16 bg-blue-400 text-white"
                      variant={"outline"}
                      onClick={() => {
                        const chatId = edge.node.chatId;
                        if (!chatId) {
                          postChat({
                            variables: {
                              users: edge.node.users.map((user) => user.id),
                            },
                          });
                        } else handleSendMsg(chatId);
                      }}
                    >
                      Send
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

export default ForwardMsgDialog;
