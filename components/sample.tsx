"use client";

import { usePlayerStore } from "@/lib/zustand/store";
import { Play } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import MusicBars from "@/components/music-bars";
import { cn } from "@/lib/utils";

export default function Sample({
  url,
  title,
  userName,
}: {
  url: string;
  title: string;
  userName: string;
}) {
  const { playingSampleUrl, isPlaying, play, stop } = usePlayerStore(
    (state) => state
  );

  const isThisSamplePlaying = playingSampleUrl === url && isPlaying;

  async function handleClick() {
    try {
      if (isThisSamplePlaying) {
        await stop();
        return;
      }
      await play(url);
    } catch (error) {
      console.error("Failed to handle audio playback:", error);
    }
  }

  return (
    <div
      className={cn(
        "flex w-[100%+3rem] cursor-pointer items-center justify-between rounded-xl transition-colors duration-150 ease-in-out hover:bg-neutral-900 h-16 pl-3 -ml-3",
        isThisSamplePlaying && "bg-neutral-800 hover:bg-neutral-800"
      )}
      onClick={handleClick}
    >
      <div className=" flex items-center justify-start">
        <div className="flex items-baseline justify-start w-5">
          <AnimatePresence initial={false} mode="popLayout">
            {isThisSamplePlaying ? (
              <motion.div
                key={url.concat("pause")}
                initial={{ opacity: 0, type: "spring" }}
                animate={{
                  opacity: 1,
                  type: "spring",
                  transition: {
                    duration: 0.1,
                  },
                }}
                exit={{
                  opacity: 0,
                  type: "spring",
                  transition: {
                    duration: 0.15,
                  },
                }}
              >
                <MusicBars />
              </motion.div>
            ) : (
              <motion.div
                className="text-neutral-500"
                key={url.concat("play")}
                initial={{ opacity: 0, type: "spring" }}
                animate={{
                  opacity: 1,
                  type: "spring",
                  transition: {
                    duration: 0.1,
                  },
                }}
                exit={{
                  opacity: 0,
                  type: "spring",
                  transition: {
                    duration: 0.15,
                  },
                }}
              >
                <Play size={17} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div>
          <span className="block pl-1">{title}</span>
          <span className="block text-xs pl-1 text-neutral-400">
            @{userName}
          </span>
        </div>
      </div>
    </div>
  );
}
