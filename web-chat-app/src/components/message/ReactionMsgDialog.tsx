import { IUser } from "@/interfaces/user.interface";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { IChatUsersInfo } from "@/interfaces/chat.interface";

const ReactionMsgDialog = ({
  isOpen,
  setOpen,
  reactions,
  usersMap,
}: {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  reactions: {
    [userId: string]: { unified: string; reactTime: Date; emoji: string };
  };
  usersMap: { [userId: string]: IChatUsersInfo };
}) => {
  const emojiMap = {} as any;
  const reactionListMap = {} as any;

  Object.keys(reactions).forEach((userId) => {
    const reaction = reactions[userId];

    if (!emojiMap[reaction.unified]) {
      reactionListMap[reaction.unified] = [userId];
      emojiMap[reaction.unified] = reaction.emoji;
    } else emojiMap[reaction.unified].push(userId);
  });

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="w-[30%]">
        <DialogHeader className="border-b-2">
          <DialogTitle className="text-center text-2xl mb-2">
            Reactions
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="all" className="min-h-[16rem]">
          <TabsList className="mb-4">
            <TabsTrigger value="all" className="font-bold">
              All
            </TabsTrigger>
            {Object.keys(emojiMap).map((unified) => {
              return (
                <TabsTrigger value={unified} className="font-bold">
                  {emojiMap[unified]}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {Object.keys(reactionListMap).map((unified: any) => {
              const userIds = reactionListMap[unified];

              return userIds.map((userId: any) => {
                const user = usersMap[userId];

                return (
                  <div className="flex gap-8 items-baseline justify-baseline">
                    <div>{emojiMap[unified]}</div>
                    <div>{user ? user.fullname : "undefined user"}</div>
                  </div>
                );
              });
            })}
          </TabsContent>

          {Object.keys(emojiMap).map((unified) => {
            return (
              <TabsContent value={unified} className="space-y-4">
                {Object.values(reactionListMap[unified]).map((userId: any) => {
                  const user = usersMap[userId];

                  return (
                    <div className="flex gap-8 items-baseline justify-baseline">
                      <div>{emojiMap[unified]}</div>
                      <div>{user ? user.fullname : "undefined user"}</div>
                    </div>
                  );
                })}
              </TabsContent>
            );
          })}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ReactionMsgDialog;
