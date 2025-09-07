import { createRoot } from "react-dom/client";
import WavesurferPlayer, { useWavesurfer } from "@wavesurfer/react";
import Timeline from "wavesurfer.js/dist/plugins/timeline.esm.js";
import { useRef, useState, useMemo, useCallback } from "react";
import { Pause, Play } from "lucide-react";
import { Button } from "../ui/button";

const VoiceMsgBody = ({
  audioUrl,
  isSentMsg,
}: {
  audioUrl: string;
  isSentMsg: boolean;
}) => {
  const formatTime = (seconds: number) =>
    [seconds / 60, seconds % 60]
      .map((v) => `0${Math.floor(v)}`.slice(-2))
      .join(":");

  const [wavesurfer, setWavesurfer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeline, setTimeline] = useState<string>("");
  const [audioSpeed, setAudioSpeed] = useState<number>(1);

  const onReady = (ws: any) => {
    setWavesurfer(ws);
    setIsPlaying(false);
    setTimeline(formatTime(ws.getDuration()));
  };

  const onPlayPause = () => {
    wavesurfer && wavesurfer.playPause();
  };

  return (
    <div
      className={`flex max-w-[100%] py-2 px-3 text-xl text-[1rem] rounded-2xl items-center gap-4 ${
        isSentMsg ? "bg-blue-500 text-white" : "bg-gray-200"
      }`}
    >
      <button onClick={onPlayPause}>
        {isPlaying ? <Pause></Pause> : <Play></Play>}
      </button>

      <WavesurferPlayer
        height={50}
        barHeight={5}
        audioRate={audioSpeed}
        width={100}
        waveColor="white"
        url={audioUrl}
        onReady={onReady}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeupdate={() => {
          const currentTime = wavesurfer.getCurrentTime();
          const duration = wavesurfer.getDuration();
          // You can use currentTime and duration as needed
          console.log({ currentTime, duration });
          setTimeline(`${formatTime(duration - currentTime)}`);
        }}
      />

      <div className="space-y-1">
        <div>{timeline}</div>
        <Button
          onClick={() => {
            if (audioSpeed === 1) setAudioSpeed(1.5);
            if (audioSpeed === 1.5) setAudioSpeed(2);
            if (audioSpeed === 2) setAudioSpeed(0.5);
            if (audioSpeed === 0.5) setAudioSpeed(1);
          }}
          className="cursor-pointer px-2 py-1 text-[0.75rem]"
          size={"no_style"}
        >
          {audioSpeed === 1 && "x1"}
          {audioSpeed === 1.5 && "x1.5"}
          {audioSpeed === 2 && "x2"}
          {audioSpeed === 0.5 && "x0.5"}
        </Button>
      </div>
    </div>
  );
};

export default VoiceMsgBody;
