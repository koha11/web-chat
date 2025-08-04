import { useGetFileMessages } from "@/hooks/message.hook";
import {
  ArrowLeft,
  ArrowLeftCircleIcon,
  ArrowRight,
  Download,
  Forward,
  PlayCircle,
  X,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { Button } from "../ui/button";
import Loading from "../ui/loading";
import { useEffect, useState } from "react";
import { IMessage } from "@/interfaces/messages/message.interface";
import MessageType from "@/enums/MessageType.enum";

const ChatMediaViewer = ({
  mediaId,
  setMediaId,
}: {
  mediaId: string;
  setMediaId: (msgId: string) => void;
}) => {
  const { id } = useParams();

  const { data: fileMessageConnection, loading: isFilesLoading } =
    useGetFileMessages({
      chatId: id!,
      isMediaFile: true,
    });

  const [choosenMedia, setChoosenMedia] = useState<IMessage | undefined>(
    undefined
  );

  const [mediaIndex, setMediaIndex] = useState(-1);

  useEffect(() => {
    if (fileMessageConnection && mediaIndex >= 0)
      setChoosenMedia(fileMessageConnection?.edges[mediaIndex].node);
  }, [mediaIndex]);

  useEffect(() => {
    if (fileMessageConnection)
      setMediaIndex(
        fileMessageConnection.edges.findIndex((edge) => edge.cursor == mediaId)
      );
  }, [fileMessageConnection]);

  if (isFilesLoading) return <Loading />;

  return (
    <div
      className="fixed h-screen w-screen bg-[rgba(0,0,0,0.8)] z-[9999999] flex justify-center"
      onClick={() => setMediaId("")}
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
            onClick={() => setMediaId("")}
          >
            <X></X>
          </Button>
        </div>

        <Button
          className={`rounded-full cursor-pointer p-4 ${
            mediaIndex == 0 && "cursor-not-allowed"
          }`}
          size={"no_style"}
          onClick={(e) => {
            e.stopPropagation();
            if (mediaIndex > 0) setMediaIndex(mediaIndex - 1);
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
            {choosenMedia?.type == MessageType.VIDEO ? (
              <video
                src={choosenMedia.file?.url}
                className="object-center object-contain w-full h-full"
                controls
                disablePictureInPicture
              ></video>
            ) : (
              <img
                src={choosenMedia?.file?.url}
                className="object-center object-contain w-full h-full"
              ></img>
            )}
          </div>

          {/* horizontal media list  */}
          <div className="h-[10%] flex justify-center items-center gap-4">
            {fileMessageConnection?.edges.map((edge, index) => {
              const file = edge.node.file!;

              const isChoosen = mediaIndex == index;

              if (file.type.startsWith("video"))
                return (
                  <div
                    className="relative cursor-pointer"
                    onClick={() => {
                      setMediaIndex(index);
                    }}
                  >
                    <video
                      src={file.url}
                      className={`object-center object-cover h-12 w-12  cursor-pointer rounded-md ${
                        isChoosen
                          ? "opacity-100"
                          : "hover:opacity-80 opacity-50"
                      }`}
                      disablePictureInPicture
                    ></video>
                    <PlayCircle
                      className="absolute top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] text-gray-400 opacity-50 hover:opacity-80"
                      size={30}
                    ></PlayCircle>
                  </div>
                );

              return (
                <img
                  src={file.url}
                  className={`object-center object-cover h-12 w-12  cursor-pointer rounded-md ${
                    isChoosen ? "opacity-100" : "hover:opacity-80 opacity-50"
                  }`}
                  onClick={() => {
                    setMediaIndex(index);
                  }}
                ></img>
              );
            })}
          </div>
        </div>

        <Button
          className={`rounded-full cursor-pointer p-4 ${
            mediaIndex == fileMessageConnection!.edges.length - 1 &&
            "cursor-not-allowed"
          }`}
          size={"no_style"}
          onClick={(e) => {
            e.stopPropagation();
            if (mediaIndex < fileMessageConnection!.edges.length - 1)
              setMediaIndex(mediaIndex + 1);
          }}
        >
          <ArrowRight></ArrowRight>
        </Button>
      </div>
    </div>
  );
};

export default ChatMediaViewer;
