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
import { useGetChat } from "../../hooks/chat.hook";
import Cookies from "js-cookie";
import Loading from "../../components/ui/loading";
import { IUser } from "../../interfaces/user.interface";

const Call = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const hasVideo = queryParams.get("has_video")?.toLowerCase() == "true";
  const initializeVideo =
    queryParams.get("initialize_video")?.toLowerCase() == "true";
  const roomId = queryParams.get("room_id")!;

  const userId = Cookies.get("userId")!;

  const { data: chat, loading: isChatLoading } = useGetChat({
    chatId: roomId,
    userId,
  });

  const [isVideoCollapsibleOpen, setVideoCollapsibleOpen] = useState(true);
  const [isCameraOpen, setCameraOpen] = useState(initializeVideo);
  const [isMicroOpen, setMicroOpen] = useState(true);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoveStream] = useState<MediaStream | null>(null);
  const [otherUserId, setOtherUserId] = useState<string | null>(null);

  const [remoteMediaState, setRemoteMediaState] = useState<
    {
      isCameraOpen: boolean;
      isMicroOpen: boolean;
    }[]
  >([]);
  const [isConnected, setConnected] = useState(false);

  const ws = useRef<WebSocket>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:3000/rtc-signal");
    const signaling = ws.current;
    // Setup peer connection
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    pcRef.current = pc;

    // Remote track handler
    pc.ontrack = ({ streams }) => {
      const myRemoteStream = streams[0];
      setRemoveStream(myRemoteStream);
      setRemoteMediaState(() => [
        {
          isCameraOpen:
            myRemoteStream.getVideoTracks().length == 0
              ? false
              : myRemoteStream.getVideoTracks()[0].enabled,
          isMicroOpen:
            myRemoteStream.getAudioTracks().length == 0
              ? false
              : myRemoteStream.getAudioTracks()[0].enabled,
        },
      ]);

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

      if (pc.iceGatheringState == "complete") setConnected(true);
    };

    //
    pc.onnegotiationneeded = async () => {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      signaling.send(
        JSON.stringify({ type: "offer", sdp: pc.localDescription })
      );
    };

    // Get media and add to connection
    navigator.mediaDevices
      .getUserMedia({ video: isCameraOpen, audio: isMicroOpen })
      .then((stream) => {
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      });

    signaling.onopen = () => {
      console.log("connected to RTC WS");
    };

    // Incoming signaling messages
    signaling.onmessage = async (msg) => {
      const data = JSON.parse(msg.data);

      if (!pcRef.current) return;

      switch (data.type) {
        case "offer":
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
          break;
        case "answer":
          await pcRef.current.setRemoteDescription(
            new RTCSessionDescription(data.sdp)
          );
          break;
        case "candidate":
          await pcRef.current.addIceCandidate(
            new RTCIceCandidate(data.candidate)
          );
          break;
        case "media-status":
          setRemoteMediaState((olds) => {
            const old = olds[0];

            return [
              {
                isCameraOpen:
                  data.kind == "video" ? data.enabled : old.isCameraOpen,
                isMicroOpen:
                  data.kind == "audio" ? data.enabled : old.isMicroOpen,
              },
            ];
          });

          break;
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

  // hanlde toggle camera
  useEffect(() => {
    let hasChanged = false;
    let kind = "";

    localStream?.getTracks().forEach((t) => {
      if (t.kind == "video") {
        hasChanged = t.enabled != isCameraOpen;

        if (hasChanged) {
          t.enabled = isCameraOpen;
          kind = "video";
        }
      }
      if (t.kind == "audio") {
        hasChanged = t.enabled != isMicroOpen;

        if (hasChanged) {
          t.enabled = isMicroOpen;
          kind = "audio";
        }
      }
    });

    if (ws.current && isConnected && hasChanged)
      ws.current.send(
        JSON.stringify({
          type: "media-status",
          kind, // or "audio"
          enabled: kind == "video" ? isCameraOpen : isMicroOpen,
        })
      );

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [isCameraOpen, isMicroOpen, isVideoCollapsibleOpen]);

  // hanlde toggle micro
  useEffect(() => {
    localStream?.getAudioTracks().forEach((t) => (t.enabled = isMicroOpen));

    if (ws.current && isConnected)
      ws.current.send(
        JSON.stringify({
          type: "media-status",
          kind: "audio", // or "audio"
          enabled: isMicroOpen,
        })
      );

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [isMicroOpen]);

  useEffect(() => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteMediaState]);

  if (isChatLoading) return <Loading></Loading>;

  return (
    <div className="relative w-full h-screen flex justify-center items-center">
      <div className="flex items-center justify-center gap-4 absolute top-4">
        Top
      </div>
      <div className="flex flex-col justify-center items-center gap-2 w-full">
        {remoteMediaState.length &&
          (remoteMediaState[0].isCameraOpen ? (
            <video
              className="scale-x-[-1] w-fit"
              autoPlay
              playsInline
              ref={remoteVideoRef}
              hidden={!isConnected}
            ></video>
          ) : (
            <div
              className={`w-24 h-24 rounded-full bg-contain bg-no-repeat bg-center`}
              style={{ backgroundImage: `url(${chat?.chatAvatar})` }}
            ></div>
          ))}

        {!isConnected && (
          <>
            <div
              className={`w-12 h-12 rounded-full bg-contain bg-no-repeat bg-center`}
              style={{ backgroundImage: `url(${chat?.chatAvatar})` }}
            ></div>
            <div className="text-xl font-bold">{chat?.chatName}</div>
            <div className="text-sm">Is calling...</div>
          </>
        )}
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
          <CollapsibleContent className="absolute bottom-4 right-4 h-full w-full rounded-md bg-gray-100 flex justify-center items-center">
            <div
              className="h-32 w-32 bg-contain bg-no-repeat bg-center rounded-full bg-gray-200"
              style={{
                backgroundImage: `url(${
                  (chat?.users as IUser[]).find((user) => user.id == userId)!
                    .avatar
                })`,
              }}
            ></div>
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
