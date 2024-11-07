"use client";

import WaveSurfer from "wavesurfer.js";
import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function WaveForm({ url }: { url: string }) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const waveSurfer = useRef<WaveSurfer>();

  useEffect(() => {
    if (!waveformRef.current) return;

    const OPTIONS = {
      container: waveformRef.current,
      barHeight: 5,
      barWidth: 1,
      height: 30,
      normalize: true,
      waveColor: "#a1a1aa",
      progressColor: "#3f3f46",
      cursorColor: "#f4f4f5",
      hideScrollbar: true,
      url,
    };

    const wavesurfer = WaveSurfer.create(OPTIONS);
    waveSurfer.current = wavesurfer;

    return () => wavesurfer.destroy();
  }, [url]);

  return (
    <div
      className="flex h-20 w-full flex-col items-start justify-center"
      key={`waveform-${url}`}
    >
      <div ref={waveformRef} className="w-full" />
      <Button onClick={() => waveSurfer.current?.playPause()} variant="ghost">
        Play
      </Button>
    </div>
  );
}
