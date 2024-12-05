"use client";

import Fade from "@/components/fade";
import MusicBars from "@/components/music-bars";
import { cn, formatDuration } from "@/utils";
import { FaPlay } from "react-icons/fa";
import { usePlayerStore } from "@/zustand/store";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { SamplePack } from "@/db/mod";

export default function Sample({
  url,
  title,
  userName,
  wholeSamplePack,
  num,
  duration,
}: {
  url: string;
  title: string;
  userName: string;
  num?: number;
  wholeSamplePack: SamplePack;
  duration: number;
}) {
  const [hovering, setHovering] = useState(false);
  const {
    playingSampleUrl,
    isPlaying,
    play,
    stop,
    setSelectedSampleUrl,
    selectedSampleUrl,
    setSamplePack,
    samplePack,
  } = usePlayerStore((state) => state);

  const isThisSamplePlaying = playingSampleUrl === url && isPlaying;
  const isThisSampleSelected = selectedSampleUrl === url;

  function handleClick() {
    setSelectedSampleUrl(url);
  }

  async function handlePlay() {
    loadSamplePackToGlobalState();
    if (isThisSamplePlaying) {
      await stop();
      return;
    }
    await play(url);
  }

  async function handleDoubleClick() {
    loadSamplePackToGlobalState();
    await stop();
    await play(url);
  }

  function loadSamplePackToGlobalState() {
    if (!wholeSamplePack) return;
    if (wholeSamplePack.name === samplePack?.name) return;
    setSamplePack(wholeSamplePack);
  }
  const fmtDuration = formatDuration(duration);

  return (
    <div
      className={cn(
        "flex w-[100%+6rem] cursor-pointer items-center justify-between rounded-lg transition-colors duration-150 ease-in-out hover:bg-neutral-900 h-16 pl-3 -ml-3 sm:-ml-0",
        isThisSampleSelected &&
          "bg-neutral-800 hover:bg-neutral-800 active:text-neutral-400"
      )}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="flex items-center justify-start">
        <div
          className="flex items-baseline justify-start w-5 sm:w-10 sm:pl-2 text-neutral-500 hover:scale-110 active:scale-90 active:text-neutral-300 hover:text-neutral-50 transition-all duration-150"
          onClick={handlePlay}
        >
          <AnimatePresence initial={false} mode="popLayout">
            {isThisSamplePlaying ? (
              <Fade id="music-bars">
                <MusicBars />
              </Fade>
            ) : hovering ? (
              <Fade id="play">
                <FaPlay size={12} />
              </Fade>
            ) : (
              <Fade id="num">
                <span className="font-mono text-xs text-neutral-400">
                  {num}
                </span>{" "}
              </Fade>
            )}
          </AnimatePresence>
        </div>
        <div>
          <span
            className={cn(
              "block pl-1 text-neutral-50",
              isThisSamplePlaying && "font-bold"
            )}
          >
            {title}
          </span>
          <span
            className={cn(
              "block text-xs sm:text-sm pl-1 text-neutral-400 transition-colors",
              isThisSampleSelected && "text-neutral-300"
            )}
          >
            @{userName}
          </span>
        </div>
      </div>
      <div>
        <span
          className={cn(
            "text-xs text-neutral-400 font-mono mr-3 sm:mr-5 transition-colors",
            isThisSampleSelected && "text-neutral-300"
          )}
        >
          {fmtDuration}
        </span>
      </div>
    </div>
  );
}
