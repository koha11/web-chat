import {
  ArrowBigLeftDashIcon,
  ArrowBigRightDashIcon,
  Mic,
  PhoneIcon,
  ScreenShare,
  UserPlus2Icon,
  Video,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../components/ui/collapsible";
import { useRef, useState } from "react";

const Call = () => {
  const [isVideoCollapsibleOpen, setVideoCollapsibleOpen] = useState(false);

  const openMediaDevices = async (constraints: MediaStreamConstraints) => {
    return await navigator.mediaDevices.getUserMedia(constraints);
  };

  const displayMedia = async (constraints: DisplayMediaStreamOptions) => {
    return await navigator.mediaDevices.getDisplayMedia(constraints);
  };

  const stream = openMediaDevices({ video: true, audio: true });
  const myRef = useRef

  stream.then((test) => {
    return (
      <div className="relative w-full h-screen flex justify-center items-center">
        <div className="flex items-center justify-center gap-4 absolute top-4">
          Top
        </div>
        <div className="flex flex-col justify-center items-center gap-2">
          <div
            className={`w-12 h-12 rounded-full bg-contain bg-no-repeat bg-center`}
            style={{ backgroundImage: `url(/assets/images/google-logo.png)` }}
          ></div>
          <div className="text-xl font-bold">Name</div>
          <div className="text-sm">Is calling...</div>
        </div>
        <div className="flex items-center justify-center gap-4 absolute bottom-4">
          <Button className="rounded-full cursor-pointer">
            <ScreenShare></ScreenShare>
          </Button>
          <Button className="rounded-full cursor-pointer">
            <UserPlus2Icon></UserPlus2Icon>
          </Button>
          <Button className="rounded-full cursor-pointer">
            <Video></Video>
          </Button>
          <Button className="rounded-full cursor-pointer">
            <Mic></Mic>
          </Button>
          <Button className="rounded-full cursor-pointer bg-red-600 hover:bg-red-500">
            <PhoneIcon></PhoneIcon>
          </Button>
        </div>
        <Collapsible
          className="absolute bottom-4 right-4 h-[25%] w-[20%]"
          open={isVideoCollapsibleOpen}
          onOpenChange={setVideoCollapsibleOpen}
        >
          <CollapsibleTrigger
            hidden={isVideoCollapsibleOpen}
            className="bg-gray-200 h-full w-4 absolute bottom-4 right-0 rounded-l-2xl flex items-center justify-center"
          >
            <ArrowBigLeftDashIcon></ArrowBigLeftDashIcon>
          </CollapsibleTrigger>
          {/* <CollapsibleContent
          className="absolute bottom-4 right-4 h-full w-full bg-contain bg-no-repeat bg-center rounded-md bg-red-200"
          style={{ backgroundImage: `url(/assets/images/google-logo.png)` }}
          
        >
          <CollapsibleTrigger className="bg-gray-200 h-full w-4 absolute left-0 rounded-l-md flex items-center justify-center">
            <ArrowBigRightDashIcon></ArrowBigRightDashIcon>
          </CollapsibleTrigger>
        </CollapsibleContent> */}
          <CollapsibleContent>
            <video
              className="absolute bottom-4 right-4 h-full w-full rounded-md200"
              autoPlay
              playsInline
              ref={t}
            ></video>
            <CollapsibleTrigger className="bg-gray-200 h-full w-4 absolute left-0 rounded-l-md flex items-center justify-center">
              <ArrowBigRightDashIcon></ArrowBigRightDashIcon>
            </CollapsibleTrigger>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  });

  return <></>;
};

export default Call;
