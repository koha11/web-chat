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
  const [remoteStreams, setRemoteStreams] = useState<
    readonly MediaStream[] | null
  >(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    const signaling = new WebSocket("ws://localhost:3000/rtc-signal");

    // Setup peer connection
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    pcRef.current = pc;

    // Get media and add to connection
    navigator.mediaDevices
      .getUserMedia({ video: isCameraOpen, audio: isMicroOpen })
      .then((stream) => {
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        console.log(stream.getTracks());

        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      });

    // Remote track handler
    pc.ontrack = ({ streams }) => {
      console.log(streams);
      const myRemoteStream = streams[0];
      setRemoteStreams(streams);

      console.log(myRemoteStream.getTracks());

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = myRemoteStream;
      }
    };

    // ICE candidate handler
    pc.onicecandidate = ({ candidate }) => {
      if (candidate) {
        signaling.send(JSON.stringify({ type: "candidate", candidate }));
      }
    };

    // Fires when the browser thinks you need to renegotiate your session
    pc.onicegatheringstatechange = () => {
      console.log(pc.iceGatheringState);
    };

    //
    pc.onnegotiationneeded = async () => {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      signaling.send(
        JSON.stringify({ type: "offer", sdp: pc.localDescription })
      );
    };

    signaling.onopen = () => {
      console.log("connected to RTC WS");
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

    signaling.onerror = console.error;
    signaling.onclose = (e) => console.log("WS closed", e);

    return () => {
      // Close WebSocket
      signaling.close();
      // Close peer connection
      pcRef.current?.close();
      // Stop all local tracks
      localStream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // useEffect(() => {
  //   if (remoteStreams && remoteVideoRef.current) {
  //     console.log(remoteStreams[0].getVideoTracks());

  //     remoteVideoRef.current.srcObject = remoteStreams[0];
  //   }
  // }, [remoteStreams]);

  // hanlde toggle camera
  useEffect(() => {
    localStream?.getVideoTracks().forEach((t) => (t.enabled = isCameraOpen));

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [isCameraOpen]);

  // hanlde toggle micro
  useEffect(() => {
    localStream?.getAudioTracks().forEach((t) => (t.enabled = isMicroOpen));

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [isMicroOpen]);

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
        {/* {remoteStreams &&
          (remoteStreams[0].getVideoTracks()[0].enabled ? (
            <video
              className="scale-x-[-1] w-fit"
              autoPlay
              playsInline
              ref={remoteVideoRef}
            ></video>
          ) : (
            <div
              className={`w-12 h-12 rounded-full bg-contain bg-no-repeat bg-center`}
              style={{ backgroundImage: `url(/assets/images/google-logo.png)` }}
            ></div>
          ))} */}

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
        {isCameraOpen ? (
          <CollapsibleContent className="w-full h-full">
            <video
              className="absolute bottom-4 right-4 h-full w-full rounded-lg scale-x-[-1]"
              autoPlay
              playsInline
              muted
              ref={localVideoRef}
            ></video>
            <CollapsibleTrigger className="bg-gray-200 h-full w-4 absolute bottom-4 left-0 rounded-l-md flex items-center justify-center">
              <ArrowBigRightDashIcon></ArrowBigRightDashIcon>
            </CollapsibleTrigger>
          </CollapsibleContent>
        ) : (
          <CollapsibleContent
            className="absolute bottom-4 right-4 h-full w-full bg-contain bg-no-repeat bg-center rounded-md bg-red-200"
            style={{ backgroundImage: `url(/assets/images/google-logo.png)` }}
          >
            <CollapsibleTrigger className="bg-gray-200 h-full w-4 absolute left-0 rounded-l-md flex items-center justify-center">
              <ArrowBigRightDashIcon></ArrowBigRightDashIcon>
            </CollapsibleTrigger>
          </CollapsibleContent>
        )}
      </Collapsible>
    </div>
  );
};

export default Call;
