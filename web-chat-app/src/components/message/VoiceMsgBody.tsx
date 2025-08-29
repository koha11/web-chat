import React, { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

/**
 * VoiceMessagePlayer — duration-driven waveform with seek/scrub and progress mask
 *
 * Changes in this version:
 *  - BAR COUNT depends ONLY on audio duration (no layout/width dependency)
 *    bars = clamp(round(duration * barsPerSecond), minBars, maxBars)
 *  - Progress overlay and click/drag seek retained
 */
export default function VoiceMsgBody({
  src,
  file,
  className = "",
  barsPerSecond = 8, // density: bars per second of audio
  minBars = 12,
  maxBars = 80,
}: {
  src?: string;
  file?: File;
  className?: string;
  barsPerSecond?: number;
  minBars?: number;
  maxBars?: number;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const waveRef = useRef<HTMLDivElement>(null);

  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const [peaks, setPeaks] = useState<number[] | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  // Visual constants
  const barW = 3; // px
  const gap = 3; // px

  // Resolve audio URL
  const audioUrl = useMemo(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setObjectUrl(url);
      return url;
    }
    return src || "";
  }, [file, src]);

  useEffect(
    () => () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    },
    [objectUrl]
  );

  // Compute dynamic bar count from DURATION ONLY
  const dynamicBars = useMemo(() => {
    if (!duration) return 0;
    const n = Math.round(duration * Math.max(1, barsPerSecond));
    return Math.max(minBars, Math.min(maxBars, n));
  }, [duration, barsPerSecond, minBars, maxBars]);

  // Decode & compute peaks after we know duration (so bar count is settled)
  useEffect(() => {
    let cancelled = false;
    async function extractPeaks(urlOrFile: string | File, barCount: number) {
      const AC =
        (window as any).AudioContext || (window as any).webkitAudioContext;
      const ctx = new AC();
      const arrayBuffer =
        typeof urlOrFile === "string"
          ? await fetch(urlOrFile, { mode: "cors" }).then((r) =>
              r.arrayBuffer()
            )
          : await (urlOrFile as File).arrayBuffer();
      const buffer = await ctx.decodeAudioData(arrayBuffer.slice(0));
      const ch0 = buffer.getChannelData(0);
      const ch1 = buffer.numberOfChannels > 1 ? buffer.getChannelData(1) : null;
      const samplesPerBar = Math.max(
        1,
        Math.floor(ch0.length / Math.max(1, barCount))
      );
      const out: number[] = [];
      for (let i = 0; i < barCount; i++) {
        const start = i * samplesPerBar;
        const end = i === barCount - 1 ? ch0.length : (i + 1) * samplesPerBar;
        let peak = 0;
        const step = Math.max(1, Math.floor((end - start) / 256));
        for (let s = start; s < end; s += step) {
          const a0 = Math.abs(ch0[s]);
          const a1 = ch1 ? Math.abs(ch1[s]) : 0;
          const a = Math.max(a0, a1);
          if (a > peak) peak = a;
        }
        out.push(peak);
      }
      const max = Math.max(...out, 0.001);
      const norm = out.map((v) => v / max);
      ctx.close();
      return norm;
    }
    (async () => {
      try {
        if (!audioUrl || !dynamicBars) return;
        const p = await extractPeaks(file || audioUrl, dynamicBars);
        if (!cancelled) setPeaks(p);
      } catch (e) {
        if (!cancelled)
          setPeaks(
            Array.from(
              { length: dynamicBars || 28 },
              (_, i) => 0.35 + 0.25 * Math.sin(i)
            )
          );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [audioUrl, file, dynamicBars]);

  // Audio wiring
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onLoaded = () => setDuration(el.duration || 0);
    const onTime = () => setCurrent(el.currentTime || 0);
    const onEnded = () => setPlaying(false);
    el.addEventListener("loadedmetadata", onLoaded);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("loadedmetadata", onLoaded);
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("ended", onEnded);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = rate;
  }, [rate]);

  const progress = duration ? Math.min(1, current / duration) : 0;
  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const ss = Math.floor(s % 60);
    return `${m}:${ss.toString().padStart(2, "0")}`;
  };

  function toggle() {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.play()
        .then(() => setPlaying(true))
        .catch(() => {});
    }
  }

  function cycleRate() {
    setRate((r) => (r === 0.5 ? 1 : r === 1 ? 1.5 : r === 1.5 ? 2 : 0.5));
  }

  // Seeking / scrubbing via pointer
  function seekFromClientX(clientX: number) {
    const el = audioRef.current;
    const wrap = waveRef.current;
    if (!el || !wrap || !duration) return;
    const rect = wrap.getBoundingClientRect();
    const frac = Math.min(
      1,
      Math.max(0, (clientX - rect.left) / Math.max(1, rect.width))
    );
    el.currentTime = frac * duration;
    setCurrent(el.currentTime);
  }
  function onPointerDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    seekFromClientX(e.clientX);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (e.buttons === 1) seekFromClientX(e.clientX);
  }

  const barsData =
    peaks ||
    (dynamicBars ? Array.from({ length: dynamicBars }, () => 0.5) : []);

  return (
    <div
      className={[
        "relative inline-flex items-center gap-3 rounded-2xl bg-blue-600 text-white px-3 py-2 shadow",
        className,
      ].join(" ")}
    >
      {/* Play/Pause */}
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause" : "Play"}
        className="grid place-items-center h-7 w-7 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
      >
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </button>

      {/* Waveform with progress mask and seek */}
      <div
        ref={waveRef}
        className="relative h-8 cursor-pointer select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        style={{ minWidth: 120 }}
      >
        {/* Base (upcoming): lighter */}
        <div className="flex items-end h-8" style={{ columnGap: `${gap}px` }}>
          {barsData.map((p, i) => (
            <span
              key={`base-${i}`}
              className="block rounded-full bg-white/40"
              style={{ width: barW, height: Math.max(4, Math.round(p * 24)) }}
            />
          ))}
        </div>
        {/* Played overlay (white) clipped by progress width */}
        <div
          className="absolute top-0 left-0 bottom-0 overflow-hidden pointer-events-none"
          style={{ width: `${progress * 100}%` }}
        >
          <div className="flex items-end h-8" style={{ columnGap: `${gap}px` }}>
            {barsData.map((p, i) => (
              <span
                key={`mask-${i}`}
                className="block rounded-full bg-white"
                style={{ width: barW, height: Math.max(4, Math.round(p * 24)) }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Time top-right */}
      <div className="absolute top-1 right-2 text-[12px] font-bold drop-shadow-sm">
        {duration ? fmt(Math.max(0, duration - current)) : "0:00"}
      </div>

      {/* Speed chip bottom-right */}
      <button
        type="button"
        onClick={cycleRate}
        className="absolute bottom-1 right-2 px-2 py-0.5 rounded-full bg.white/40 text-[11px] font-semibold"
        aria-label="Playback speed"
      >
        {rate}X
      </button>

      {/* Hidden audio */}
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        crossOrigin="anonymous"
        className="hidden"
      />
    </div>
  );
}
