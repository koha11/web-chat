import { useGetFileMessages } from "@/hooks/message.hook";
import {
  ArrowLeft,
  ArrowLeftCircleIcon,
  ArrowRight,
  Download,
  Forward,
  X,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { Button } from "../ui/button";

const ChatMediaViewer = ({
  mediaViewer,
  setMediaViewer,
}: {
  mediaViewer: string;
  setMediaViewer: (msgId: string) => void;
}) => {
  const { id } = useParams();

  const {
    data: fileMessageConnection,
    loading: isFilesLoading,
    refetch,
  } = useGetFileMessages({
    chatId: id!,
    isMediaFile: true,
  });

  return (
    <div
      className="fixed h-screen w-screen bg-[rgba(0,0,0,0.8)] z-[9999999] flex justify-center"
      onClick={() => setMediaViewer("")}
    >
      <div className="relative w-full flex justify-between items-center px-2">
        {/* HEADER  */}
        <div
          className="absolute w-full p-2 flex justify-end gap-2 self-baseline"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            className="cursor-pointer text-white rounded-full p-2 bg-[rgba(0,0,0,0.2)] hover:opacity-80"
            variant={"no_style"}
            size={"no_style"}
          >
            <Download></Download>
          </Button>
          <Button
            className="cursor-pointer text-white rounded-full p-2 bg-[rgba(0,0,0,0.2)] hover:opacity-80"
            variant={"no_style"}
            size={"no_style"}
          >
            <Forward></Forward>
          </Button>
          <Button
            className="cursor-pointer text-white rounded-full p-2 bg-[rgba(0,0,0,0.2)] hover:opacity-80"
            variant={"no_style"}
            size={"no_style"}
            onClick={() => setMediaViewer("")}
          >
            <X></X>
          </Button>
        </div>

        <Button
          className="rounded-full cursor-pointer p-4"
          size={"no_style"}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <ArrowLeft></ArrowLeft>
        </Button>

        {/* MAIN CONTENT  */}
        <div
          className="h-full w-fit flex items-center flex-col justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-center h-[90%] py-4">
            <img
              src="/assets/images/google-logo.png"
              className="object-center object-contain w-full h-full"
            ></img>
          </div>

          {/* horizontal media list  */}
          <div className="h-[10%] flex justify-center items-center gap-4">
            <img
              src="/assets/images/google-logo.png"
              className="object-center object-cover h-12 w-12 hover:opacity-80 opacity-50 cursor-pointer rounded-xl"
            ></img>
            <img
              src="/assets/images/google-logo.png"
              className="object-center object-cover h-12 w-12 hover:opacity-80 opacity-50 cursor-pointer rounded-xl"
            ></img>
            <img
              src="/assets/images/google-logo.png"
              className="object-center object-cover h-12 w-12 hover:opacity-80 opacity-50 cursor-pointer rounded-xl"
            ></img>
          </div>
        </div>

        <Button
          className="rounded-full cursor-pointer p-4"
          size={"no_style"}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <ArrowRight></ArrowRight>
        </Button>
      </div>
    </div>
  );
};

export default ChatMediaViewer;
