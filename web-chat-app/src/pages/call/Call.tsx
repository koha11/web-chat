import {
  ArrowBigLeftDashIcon,
  ArrowBigRightDashIcon,
  LucideGamepad,
  Mic,
  MicOff,
  MoreHorizontal,
  PhoneIcon,
  ScreenShare,
  UserPlus2Icon,
  Video,
  VideoOff,
  X,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../components/ui/collapsible";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useGetChat, useHangupCall } from "../../hooks/chat.hook";
import Cookies from "js-cookie";
import Loading from "../../components/ui/loading";
import { IUser } from "../../interfaces/user.interface";
import { CHAT_RESPONSE_CALL_SUB } from "../../services/chatService";
import { IS_DEV_ENV, SERVER_HOST, SERVER_PORT } from "@/apollo";

const Call = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  // const hasVideo = queryParams.get("has_video")?.toLowerCase() == "true";
  const initializeVideo =
    queryParams.get("initialize_video")?.toLowerCase() == "true";
  const roomId = queryParams.get("room_id")!;

  const userId = Cookies.get("userId")!;

  const {
    data: chat,
    loading: isChatLoading,
    subscribeToMore,
  } = useGetChat({
    chatId: roomId,
    userId,
  });

  const [hangupCall] = useHangupCall();

  const [isVideoCollapsibleOpen, setVideoCollapsibleOpen] = useState(true);
  const [isCameraOpen, setCameraOpen] = useState(initializeVideo);
  const [isMicroOpen, setMicroOpen] = useState(true);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoveStream] = useState<MediaStream | null>(null);
  const [isHover, setHover] = useState(false);
  const [isHangup, setHangup] = useState(false);

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
    ws.current = new WebSocket(
      IS_DEV_ENV
        ? `ws://${SERVER_HOST}:${SERVER_PORT}/rtc-signal`
        : `wss://${SERVER_HOST}/rtc-signal`
    );
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

  // hanlde toggle camera and micro
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

  useEffect(() => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteMediaState]);

  useEffect(() => {
    const unsubscribeResponseCall = subscribeToMore({
      document: CHAT_RESPONSE_CALL_SUB,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) return prev;

        setHangup(true);
      },
    });

    return () => {
      unsubscribeResponseCall();
    };
  }, [subscribeToMore]);

  if (isChatLoading) return <Loading></Loading>;

  return (
    <div
      className="relative w-screen h-screen flex justify-center items-center overflow-hidden"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* TOP SECTION  */}
      {!isHangup && (
        <div
          className="flex items-center justify-between w-full px-8 gap-4 absolute top-4 z-20"
          hidden={!isHover}
        >
          <div className="flex gap-4 items-center">
            <div
              className={`w-12 h-12 rounded-full bg-contain bg-no-repeat bg-center`}
              style={{ backgroundImage: `url(${chat?.chatAvatar})` }}
            ></div>
            <div className={`font-bold text-white`}>{chat?.chatName}</div>
          </div>
          <div className="flex gap-4">
            <Button variant={"outline"} className="rounded-full cursor-pointer">
              <LucideGamepad></LucideGamepad>
            </Button>
            <Button variant={"outline"} className="rounded-full cursor-pointer">
              <MoreHorizontal></MoreHorizontal>
            </Button>
          </div>
        </div>
      )}

      {/* MAIN DISPLAY  */}
      {isConnected ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-no-repeat bg-center scale-110 filter blur-md brightness-50"
            style={{ backgroundImage: `url(${chat?.chatAvatar})` }}
          ></div>

          {/* Overlay (optional) */}
          <div className="absolute inset-0 bg-black/40"></div>
        </>
      ) : (
        <>
          <div className="relative z-10 flex flex-col items-center justify-center h-full gap-4">
            {/* Centered Avatar */}
            <div className="w-32 h-32 rounded-full overflow-hidden shadow-xl">
              <img
                src={chat?.chatAvatar}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="font-bold">{chat?.chatName}</div>

            <div>{isHangup ? "the call end" : "is calling ..."}</div>
          </div>
        </>
      )}

      {remoteMediaState.length &&
        !isHangup &&
        (remoteMediaState[0].isCameraOpen ? (
          <div className="flex flex-col justify-center items-center gap-2 w-full h-full">
            <video
              className="scale-x-[-1] h-screen w-auto mx-auto object-contain"
              autoPlay
              playsInline
              ref={remoteVideoRef}
              hidden={!isConnected}
            ></video>
          </div>
        ) : (
          <>
            <div
              className="absolute inset-0 bg-cover bg-no-repeat bg-center scale-110 filter blur-md brightness-50"
              style={{ backgroundImage: `url(${chat?.chatAvatar})` }}
            ></div>

            {/* Overlay (optional) */}
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              {/* Centered Avatar */}
              <div className="w-32 h-32 rounded-full overflow-hidden shadow-xl">
                <img
                  src={chat?.chatAvatar}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </>
        ))}

      <div className="flex items-center justify-center gap-6 absolute bottom-4 z-20">
        {isHangup ? (
          <>
            <div className="space-y-2">
              <Button className="rounded-full cursor-pointer bg-green-700">
                <Video></Video>
              </Button>
              <div>Recall</div>
            </div>
            <div className="space-y-2">
              <Button
                className="rounded-full cursor-pointer bg-gray-300"
                onClick={() => {
                  window.close();
                }}
              >
                <X></X>
              </Button>
              <div>Close</div>
            </div>
          </>
        ) : (
          <>
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
            <Button
              className="rounded-full cursor-pointer bg-red-600 hover:bg-red-500"
              onClick={() => {
                hangupCall({ variables: { chatId: chat!.id } });
                setHangup(true);
              }}
            >
              <PhoneIcon></PhoneIcon>
            </Button>
          </>
        )}
      </div>

      {/* LOCAL CAMERA  */}
      {!isHangup && (
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
            <CollapsibleContent className="absolute bottom-4 right-4 h-full w-full rounded-md flex justify-center items-center">
              <div
                className="absolute inset-0 bg-cover bg-no-repeat bg-center scale-110 filter blur-md brightness-50 rounded-md"
                style={{ backgroundImage: `url(${chat?.chatAvatar})` }}
              ></div>

              {/* Overlay (optional) */}
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="relative z-10 flex flex-col items-center justify-center h-full">
                {/* Centered Avatar */}
                <div className="w-32 h-32 rounded-full overflow-hidden shadow-xl">
                  <img
                    src={
                      (chat?.users as IUser[]).find(
                        (user) => user.id == userId
                      )!.avatar
                    }
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <CollapsibleTrigger className="bg-gray-200 h-full w-4 absolute left-0 rounded-l-md flex items-center justify-center">
                <ArrowBigRightDashIcon></ArrowBigRightDashIcon>
              </CollapsibleTrigger>
            </CollapsibleContent>
          )}
        </Collapsible>
      )}
    </div>
  );
};

export default Call;
