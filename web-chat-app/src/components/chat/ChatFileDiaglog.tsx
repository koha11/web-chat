import { File, PlayCircle, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useGetFileMessages } from "@/hooks/message.hook";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import Loading from "../ui/loading";
import MessageType from "@/enums/MessageType.enum";
import { strimText } from "@/utils/text.helper";
import { useEffect } from "react";
import { getDisplayFileSize } from "@/utils/file.helper";

const ChatFileDiaglog = ({
  isOpen,
  setOpen,
  value,
  setValue,
  setMediaId,
}: {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  value: "media-files" | "files";
  setValue: Function;
  setMediaId: (msgId: string) => void;
}) => {
  const { id } = useParams();

  const {
    data: fileMessageConnection,
    loading: isFilesLoading,
    refetch,
  } = useGetFileMessages({
    chatId: id!,
    isMediaFile: value == "media-files",
  });

  useEffect(() => {
    refetch();
  }, [value]);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader className="border-b-2">
          <DialogTitle className="text-center text-2xl mb-2">
            Media files and files
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue={value} onValueChange={(value) => setValue(value)}>
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
                  {isFilesLoading && <Loading></Loading>}
                  {fileMessageConnection &&
                    fileMessageConnection.edges.map((edge, index) => {
                      const msg = edge.node;
                      if (msg.type == MessageType.VIDEO)
                        return (
                          <div
                            className="relative cursor-pointer"
                            onClick={() => {
                              setOpen(false);
                              setMediaId(edge.cursor);
                            }}
                          >
                            <video
                              className="aspect-square object-cover object-center"
                              src={msg.file?.url}
                              disablePictureInPicture
                            ></video>
                            <PlayCircle
                              className="absolute top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] text-gray-400 opacity-50 hover:opacity-80"
                              size={50}
                            ></PlayCircle>
                            <span className="bg-[rgba(0,0,0,0.7)] absolute right-0 bottom-2 z-10 rounded-4xl px-2 text-[0.625rem] text-white">
                              00:24
                            </span>
                          </div>
                        );

                      return (
                        <div
                          onClick={() => {
                            setOpen(false);
                            setMediaId(edge.cursor);
                          }}
                          className="aspect-square cursor-pointer bg-cover bg-center"
                          style={{ backgroundImage: `url(${msg.file?.url})` }}
                        ></div>
                      );
                    })}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="files">
              <div className="space-y-2">
                {isFilesLoading && <Loading></Loading>}
                {fileMessageConnection &&
                  fileMessageConnection.edges.map((edge) => {
                    const msg = edge.node;
                    const file = msg.file!;

                    return (
                      <div
                        className="flex gap-2 items-center border-b-2 border-gray-200 py-2 cursor-pointer"
                        onClick={() => {
                          window.open(file.url, "_blank");
                        }}
                      >
                        <div className="flex justify-center items-center bg-gray-200 p-4 rounded-xl">
                          <File></File>
                        </div>
                        <div className="space-y-1">
                          <div>{strimText(file.filename, 30)}</div>
                          <div>{getDisplayFileSize(file.size)}</div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
export default ChatFileDiaglog;
