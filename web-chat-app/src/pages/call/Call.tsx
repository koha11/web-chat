import {
  ArrowBigLeftDashIcon,
  ArrowBigRightDashIcon,
  Mic,
  MicOff,
  PhoneIcon,
  ScreenShare,
  UserPlus2Icon,
  Video,
  VideoOff,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../components/ui/collapsible";
import {
  startTransition,
  useEffect,
  useRef,
  useState,
  VideoHTMLAttributes,
} from "react";
import { useLocation } from "react-router-dom";

const signaling = new WebSocket("ws://localhost:3000/rtc-signal");

const Call = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const hasVideo = queryParams.get("has_video")?.toLowerCase() == "true";
  const initializeVideo =
    queryParams.get("initialize_video")?.toLowerCase() == "true";

  const [isVideoCollapsibleOpen, setVideoCollapsibleOpen] = useState(true);
  const [isCameraOpen, setCameraOpen] = useState(initializeVideo);
  const [isMicroOpen, setMicroOpen] = useState(true);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    // Setup peer connection
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    pcRef.current = pc;

    // Get media and add to connection
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      });

    // Remote track handler
    pc.ontrack = ({ streams }) => {
      console.log(streams[0].getTracks());

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = streams[0];
      }
    };

    // ICE candidate handler
    pc.onicecandidate = ({ candidate }) => {
      if (candidate) {
        signaling.send(JSON.stringify({ type: "candidate", candidate }));
      }
    };

    signaling.onopen = () => {
      // safe to send now
      if (pcRef.current) {
        pcRef.current.createOffer().then(async (offer) => {
          await pcRef.current!.setLocalDescription(offer);
          signaling.send(
            JSON.stringify({
              type: "offer",
              sdp: pcRef.current!.localDescription,
            })
          );
          console.log("connected to RTC WS");
        });
      }
    };

    // Incoming signaling messages
    signaling.onmessage = async (msg) => {
      const data = JSON.parse(msg.data);

      if (!pcRef.current) return;

      if (data.type === "offer") {
        await pcRef.current.setRemoteDescription(
          new RTCSessionDescription(data.sdp)
        );
        const answer = await pcRef.current.createAnswer();
        await pcRef.current.setLocalDescription(answer);

        signaling.send(
          JSON.stringify({
            type: "answer",
            sdp: pcRef.current.localDescription,
          })
        );
      } else if (data.type === "answer") {
        await pcRef.current.setRemoteDescription(
          new RTCSessionDescription(data.sdp)
        );
      } else if (data.type === "candidate") {
        await pcRef.current.addIceCandidate(
          new RTCIceCandidate(data.candidate)
        );
      }
    };

    // return () => {
    //   signaling.close();
    // };
  }, []);

  useEffect(() => {
    if (pcRef.current) {
      // turn on/off for local
      navigator.mediaDevices
        .getUserMedia({ video: isCameraOpen, audio: isMicroOpen })
        .then((stream) => {
          setLocalStream(stream);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }

          console.log(pcRef.current);

          stream
            .getTracks()
            .forEach((track) => pcRef.current!.addTrack(track, stream));
        });
    }
  }, [isCameraOpen, isMicroOpen]);

  return (
    <div className="relative w-full h-screen flex justify-center items-center">
      <div className="flex items-center justify-center gap-4 absolute top-4">
        Top
      </div>
      <div className="flex flex-col justify-center items-center gap-2 w-full">
        <video
          className="scale-x-[-1] w-fit"
          autoPlay
          playsInline
          ref={remoteVideoRef}
        ></video>
        {/* {remoteVideoRef.current?.srcObject ? (
          <video
            className="scale-x-[-1]"
            autoPlay
            playsInline
            ref={remoteVideoRef}
          ></video>
        ) : (
          <div
            className={`w-12 h-12 rounded-full bg-contain bg-no-repeat bg-center`}
            style={{ backgroundImage: `url(/assets/images/google-logo.png)` }}
          ></div>        
          <div className="text-xl font-bold">Name</div>
        <div className="text-sm">Is calling...</div>
        )} */}
      </div>
      <div className="flex items-center justify-center gap-4 absolute bottom-4">
        <Button className="rounded-full cursor-pointer">
          <ScreenShare></ScreenShare>
        </Button>
        <Button className="rounded-full cursor-pointer">
          <UserPlus2Icon></UserPlus2Icon>
        </Button>
        <Button
          className="rounded-full cursor-pointer"
          onClick={() => setCameraOpen(!isCameraOpen)}
        >
          {isCameraOpen ? <Video></Video> : <VideoOff></VideoOff>}
        </Button>

        <Button
          className="rounded-full cursor-pointer"
          onClick={() => setMicroOpen(!isMicroOpen)}
        >
          {isMicroOpen ? <Mic></Mic> : <MicOff></MicOff>}
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
        {/* {isCameraOpen ? ( */}
        <CollapsibleContent className="w-full h-full">
          <video
            className="absolute bottom-4 right-4 h-full w-full rounded-lg scale-x-[-1]"
            autoPlay
            playsInline
            ref={localVideoRef}
          ></video>
          <CollapsibleTrigger className="bg-gray-200 h-full w-4 absolute bottom-4 left-0 rounded-l-md flex items-center justify-center">
            <ArrowBigRightDashIcon></ArrowBigRightDashIcon>
          </CollapsibleTrigger>
        </CollapsibleContent>
        {/* ) : (
          <CollapsibleContent
            className="absolute bottom-4 right-4 h-full w-full bg-contain bg-no-repeat bg-center rounded-md bg-red-200"
            style={{ backgroundImage: `url(/assets/images/google-logo.png)` }}
          >
            <CollapsibleTrigger className="bg-gray-200 h-full w-4 absolute left-0 rounded-l-md flex items-center justify-center">
              <ArrowBigRightDashIcon></ArrowBigRightDashIcon>
            </CollapsibleTrigger>
          </CollapsibleContent>
        )} */}
      </Collapsible>
    </div>
  );
};

export default Call;
