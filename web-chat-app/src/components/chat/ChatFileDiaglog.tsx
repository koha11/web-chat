import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const ChatFileDiaglog = ({
  isOpen,
  setOpen,
  value,
}: {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  value: "media-files" | "files";
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader className="border-b-2">
          <DialogTitle className="text-center text-2xl mb-2">
            Media files and files
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue={value}>
          <TabsList>
            <TabsTrigger
              value="media-files"
              className="font-bold text-[1.125rem]"
            >
              Media Files
            </TabsTrigger>
            <TabsTrigger value="files" className="font-bold text-[1.125rem]">
              Files
            </TabsTrigger>
          </TabsList>
          <div className="overflow-y-scroll px-4 h-[400px] relative py-2">
            <TabsContent value="media-files" className="space-y-2">
              <div className="space-y-2">
                <div className="font-bold text-xl">July</div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-red-600 aspect-square cursor-pointer"></div>
                  <div className="bg-red-600 aspect-square"></div>
                  <div className="bg-red-600 aspect-square"></div>
                  <div className="bg-red-600 aspect-square"></div>
                  <div className="bg-red-600 aspect-square"></div>
                  <div className="bg-red-600 aspect-square"></div>
                  <div className="bg-red-600 aspect-square"></div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="files">Change your password here.</TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
export default ChatFileDiaglog;
