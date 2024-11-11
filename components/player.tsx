"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { Volume2 } from "lucide-react";
import { usePlayerStore } from "@/lib/zustand/store";
import { AnimatePresence, motion } from "framer-motion";
import { FaPlay, FaStop } from "react-icons/fa";
import { LuRepeat1 } from "react-icons/lu";
import { LuDot } from "react-icons/lu";
import { PiShuffleBold } from "react-icons/pi";
import { AiFillMuted } from "react-icons/ai";
import { BsFillSkipEndFill, BsFillSkipStartFill } from "react-icons/bs";
import ProgressBar from "@/components/progress-bar";
import Link from "next/link";
import VolumeBar from "@/components/volume-bar";

export default function Player() {
  const {
    samplePack,
    playNext,
    playPrevious,
    playingSampleUrl,
    stop,
    play,
    currentTime,
    isPlaying,
    duration,
    audioInstance,
    setCurrentTime,
    repeat,
    setRepeat,
    shuffle,
    setShuffle,
    muted,
    setMuted,
  } = usePlayerStore((state) => state);

  useEffect(() => {
    function onTimeUpdate() {
      setCurrentTime(audioInstance?.source?.currentTime ?? 0);
    }

    async function onEnded() {
      if (repeat && playingSampleUrl) {
        await play(playingSampleUrl);
      } else if (shuffle) {
        playNext();
      } else {
        await stop();
      }
    }

    if (!audioInstance?.source) return;
    audioInstance.source.addEventListener("ended", onEnded);
    audioInstance.source.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      audioInstance.source.removeEventListener("timeupdate", onTimeUpdate);
      audioInstance.source.removeEventListener("ended", onEnded);
    };
  }, [
    audioInstance?.source,
    repeat,
    playingSampleUrl,
    play,
    playNext,
    shuffle,
    stop,
    setCurrentTime,
  ]);

  async function handleClick() {
    if (isPlaying) {
      stop();
      return;
    }
    if (!playingSampleUrl) return;
    await play(playingSampleUrl);
  }

  const sampleName =
    samplePack?.samples.find((sample) => sample.url === playingSampleUrl)
      ?.title ?? "-";

  return (
    <AnimatePresence mode="popLayout">
      {!playingSampleUrl || !samplePack ? null : (
        <motion.div
          className="fixed bottom-0 left-0 right-0 h-14 bg-neutral-900 border-t border-neutral-800 z-10 sm:h-24"
          transition={{ type: "spring", duration: 0.6 }}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          key="player"
        >
          <div className="max-w-8xl mx-auto h-full px-4">
            <div className="flex items-center justify-between h-full relative">
              <div className="flex items-center gap-2 sm:gap-4">
                <Link
                  href={`/${samplePack.creator.userName}/${samplePack.name}`}
                >
                  <div className="size-10 rounded-lg sm:size-14">
                    <Image
                      src={samplePack.imgUrl}
                      alt={samplePack.title}
                      height={56}
                      width={56}
                      className="size-10 rounded-lg sm:size-14"
                    />
                  </div>
                </Link>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium max-w-32 h-4 sm:text-base block">
                    {sampleName}
                  </span>
                  <Link href={`/${samplePack.creator.userName}`}>
                    <span className="text-xs text-neutral-400 sm:text-sm block">
                      @{samplePack.creator.userName}
                    </span>
                  </Link>
                </div>
              </div>

              <button
                className="text-neutral-50 size-8 flex items-center justify-center rounded-full hover:scale-110 transition hover:text-neutral-200 sm:hidden active:scale-90 active:text-neutral-400"
                onClick={handleClick}
              >
                {isPlaying ? <FaStop size={20} /> : <FaPlay size={20} />}
              </button>
              <div className="items-center hidden sm:flex sm:absolute sm:right-auto sm:left-1/2 sm:-translate-x-1/2 sm:flex-col w-1/3 gap-2">
                <div className="w-50 flex sm:gap-4 md:gap-6">
                  <button
                    className={cn(
                      "text-neutral-400 hover:text-neutral-50 transition active:scale-90 active:text-neutral-400",
                      shuffle && "text-neutral-50 relative"
                    )}
                    onClick={() => setShuffle(!shuffle)}
                  >
                    <PiShuffleBold size={18} />
                    {shuffle ? (
                      <LuDot
                        size={25}
                        className="absolute -bottom-3 -left-[0.19rem]"
                      />
                    ) : null}
                  </button>
                  <button
                    className="text-neutral-400 hover:text-neutral-50 transition active:scale-90 active:text-neutral-400"
                    onClick={playPrevious}
                  >
                    <BsFillSkipStartFill size={25} />
                  </button>
                  <button
                    className="text-neutral-900 size-8 flex items-center justify-center transition hover:bg-neutral-200 hover:scale-110 rounded-full bg-neutral-50 active:scale-100 active:bg-neutral-400"
                    onClick={handleClick}
                  >
                    {isPlaying ? (
                      <FaStop size={15} />
                    ) : (
                      <FaPlay size={15} className="ml-0.5" />
                    )}
                  </button>
                  <button
                    className="text-neutral-400 hover:text-neutral-50 transition active:scale-90 active:text-neutral-400"
                    onClick={playNext}
                  >
                    <BsFillSkipEndFill size={25} />
                  </button>
                  <button
                    className={cn(
                      "text-neutral-400 hover:text-neutral-50 transition active:scale-90 active:text-neutral-400",
                      repeat && "text-neutral-50 relative"
                    )}
                    onClick={() => setRepeat(!repeat)}
                  >
                    <LuRepeat1 size={18} />
                    {repeat ? (
                      <LuDot
                        size={25}
                        className="absolute -bottom-3 -left-[0.19rem]"
                      />
                    ) : null}
                  </button>
                </div>
                <div className="w-full flex items-center justify-between">
                  <span className="text-xs text-neutral-400 mr-2">
                    {formatTime(currentTime ?? 0)}
                  </span>
                  <ProgressBar />
                  <span className="text-xs text-neutral-400 ml-2">
                    {formatTime(duration ?? 0)}
                  </span>
                </div>
              </div>
              <div className="items-center gap-2 hidden sm:flex">
                <button
                  className="text-neutral-400 hover:text-neutral-50 transition active:scale-90 active:text-neutral-400"
                  onClick={() => setMuted(!muted)}
                >
                  {muted ? (
                    <AiFillMuted size={20} className="text-neutral-400" />
                  ) : (
                    <Volume2 size={20} className="text-neutral-400" />
                  )}
                </button>
                <VolumeBar />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function formatTime(duration: number): string {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
