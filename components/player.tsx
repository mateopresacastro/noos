"use client";

import Image from "next/image";
import { Volume2 } from "lucide-react";
import { usePlayerStore } from "@/lib/zustand/store";
import { AnimatePresence, motion } from "framer-motion";
import { FaPlay, FaPause } from "react-icons/fa";
import { BsFillSkipEndFill, BsFillSkipStartFill } from "react-icons/bs";

export default function Player() {
  const {
    samplePack,
    playNext,
    playPrevious,
    playingSampleUrl,
    stop,
    play,
    isPlaying,
  } = usePlayerStore((state) => state);

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
      ?.title ?? "Unknown";

  return (
    <AnimatePresence mode="popLayout">
      {!samplePack ? null : (
        <motion.div
          className="fixed bottom-0 left-0 right-0 h-14 bg-neutral-900 border-t border-neutral-800 z-10 sm:h-24"
          transition={{ type: "spring", duration: 0.6 }}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          key="player"
        >
          <div className="max-w-8xl mx-auto h-full px-4">
            <div className="flex items-center justify-between h-full">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="size-10 rounded-lg sm:size-14">
                  <Image
                    src={samplePack.imgUrl}
                    alt={samplePack.title}
                    height={56}
                    width={56}
                    className="size-10 rounded-lg sm:size-14"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="text-sm font-medium max-w-32 h-4 sm:text-base">
                    {sampleName}
                  </h4>
                  <p className="text-xs text-neutral-400 sm:text-sm">
                    @{samplePack.creator.userName}
                  </p>
                </div>
              </div>

              <button
                className="text-neutral-400 size-8 flex items-center justify-center rounded-full hover:scale-110 transition hover:text-neutral-50 sm:hidden"
                onClick={handleClick}
              >
                {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
              </button>
              <div className="items-center gap-5 hidden sm:flex">
                <button
                  className="text-neutral-400 hover:text-neutral-50 transition"
                  onClick={playPrevious}
                >
                  <BsFillSkipStartFill size={25} />
                </button>
                <button
                  className="text-neutral-900 size-9 flex items-center justify-center transition hover:bg-neutral-200 hover:scale-110 rounded-full bg-neutral-50 active:scale-100 active:bg-neutral-400"
                  onClick={handleClick}
                >
                  {isPlaying ? (
                    <FaPause size={15} />
                  ) : (
                    <FaPlay size={15} className="ml-0.5" />
                  )}
                </button>
                <button
                  className="text-neutral-400 hover:text-neutral-50 transition"
                  onClick={playNext}
                >
                  <BsFillSkipEndFill size={25} />
                </button>
              </div>
              <div className="items-center gap-2 hidden sm:flex">
                <Volume2 size={20} className="text-neutral-400" />
                <div className="w-24 h-1 bg-neutral-800 rounded-full">
                  <div className="w-1/2 h-full bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
