"use client";

import colors from "tailwindcss/colors";
import WaveSurfer from "wavesurfer.js";
import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/lib/player-store";

export default function WaveForm({ url }: { url: string }) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const { play, stop, playingSampleUrl, playNext, waveSurferMap, isPlaying } =
    usePlayerStore((state) => state);

  useEffect(() => {
    if (!waveformRef.current) return;

    const options = {
      container: waveformRef.current,
      barHeight: 5,
      barWidth: 1,
      height: 30,
      normalize: true,
      waveColor: colors.neutral[700],
      progressColor: colors.neutral[600],
      cursorColor: colors.neutral[50],
      hideScrollbar: true,
      url,
    };

    const wavesurfer = WaveSurfer.create(options);
    waveSurferMap.set(url, wavesurfer);
    wavesurfer.on("finish", () => playNext());
    return () => wavesurfer.destroy();
  }, [url, waveSurferMap, playNext]);

  function handleClick() {
    if (playingSampleUrl === url && isPlaying) {
      stop();
      return;
    }
    const waveSurfer = waveSurferMap.get(url);
    if (!waveSurfer) return;
    play(url, waveSurfer);
  }

  return (
    <div
      className="flex h-20 w-full flex-col items-start justify-center"
      key={`waveform-${url}`}
    >
      <div ref={waveformRef} className="w-full" />
      <Button onClick={handleClick} variant="ghost">
        {playingSampleUrl === url && isPlaying ? "Stop" : "Play"}
      </Button>
    </div>
  );
}
