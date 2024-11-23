"use client";

import { usePlayerStore } from "@/lib/zustand/store";
import { FaPlay } from "react-icons/fa";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import MusicBars from "@/components/music-bars";
import Fade from "@/components/fade";
import type { SamplePack } from "@/lib/db/mod";

export default function Sample({
  url,
  title,
  userName,
  wholeSamplePack,
}: {
  url: string;
  title: string;
  userName: string;
  num?: number;
  wholeSamplePack: SamplePack;
}) {
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

  return (
    <div
      className={cn(
        "flex w-[100%+6rem] cursor-pointer items-center justify-between rounded-lg transition-colors duration-150 ease-in-out hover:bg-neutral-900 h-16 pl-3 -ml-3 sm:-ml-0",
        isThisSampleSelected &&
          "bg-neutral-800 hover:bg-neutral-800 active:text-neutral-400"
      )}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <div className="flex items-center justify-start">
        <div
          className="flex items-baseline justify-start w-5 sm:w-10 sm:pl-2 text-neutral-600 hover:scale-110 active:scale-90 active:text-neutral-300 hover:text-neutral-50 transition-all duration-150"
          onClick={handlePlay}
        >
          <AnimatePresence initial={false} mode="popLayout">
            {isThisSamplePlaying ? (
              <Fade id="music-bars">
                <MusicBars />
              </Fade>
            ) : (
              <Fade id="play">
                <FaPlay size={12} />
              </Fade>
            )}
          </AnimatePresence>
        </div>
        <div>
          <span
            className={cn(
              "block pl-1 text-neutral-200",
              isThisSamplePlaying && "font-bold"
            )}
          >
            {title}
          </span>
          <span
            className={cn(
              "block text-xs sm:text-sm pl-1 text-neutral-500 transition-colors",
              isThisSampleSelected && "text-neutral-300"
            )}
          >
            @{userName}
          </span>
        </div>
      </div>
    </div>
  );
}
