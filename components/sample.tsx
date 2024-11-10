"use client";

import { usePlayerStore } from "@/lib/store";
import { Play } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import MusicBars from "@/components/music-bars";
import { cn } from "@/lib/utils";

export default function Sample({ url }: { url: string }) {
  const { playingSampleUrl, isPlaying, play, stop } = usePlayerStore(
    (state) => state
  );

  const isThisSamplePlaying = playingSampleUrl === url && isPlaying;

  function handleClick() {
    if (isThisSamplePlaying) {
      stop();
      return;
    }
    play(url);
  }

  return (
    <div
      className={cn(
        "flex w-full cursor-pointer items-center justify-between rounded-xl transition-colors duration-150 ease-in-out hover:bg-neutral-900 h-14",
        isThisSamplePlaying && "bg-neutral-800 hover:bg-neutral-800"
      )}
      onClick={handleClick}
    >
      <div className="py-5 pl-4">
        <div className="flex items-baseline justify-start">
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
      </div>
    </div>
  );
}
