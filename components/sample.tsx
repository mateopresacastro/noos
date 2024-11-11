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
  num?: number;
}) {
  const {
    playingSampleUrl,
    isPlaying,
    play,
    stop,
    setSelectedSampleUrl,
    selectedSampleUrl,
  } = usePlayerStore((state) => state);

  const isThisSamplePlaying = playingSampleUrl === url && isPlaying;
  const isThisSampleSelected = selectedSampleUrl === url;

  function handleClick() {
    setSelectedSampleUrl(url);
  }

  async function handlePlay() {
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

  async function handleDoubleClick() {
    await stop();
    await play(url);
  }

  return (
    <div
      className={cn(
        "flex w-[100%+3rem] cursor-pointer items-center justify-between rounded-xl transition-colors duration-150 ease-in-out hover:bg-neutral-800 h-16 pl-3 -ml-3 active:text-neutral-400",
        isThisSampleSelected && "bg-neutral-700 hover:bg-neutral-700"
      )}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <div className=" flex items-center justify-start">
        <div
          className="flex items-baseline justify-start w-5 text-neutral-400 hover:scale-110 active:scale-100 active:text-neutral-300 hover:text-neutral-50"
          onClick={handlePlay}
        >
          <AnimatePresence initial={false} mode="popLayout">
            {isThisSamplePlaying ? (
              <Fade id="music-bars">
                <MusicBars />
              </Fade>
            ) : (
              <Fade id="play">
                <Play size={17} />
              </Fade>
            )}
          </AnimatePresence>
        </div>
        <div>
          <span className="block pl-1">{title}</span>
          <span
            className={cn(
              "block text-xs pl-1 text-neutral-400 transition-colors",
              isThisSampleSelected && "text-neutral-50"
            )}
          >
            @{userName}
          </span>
        </div>
      </div>
    </div>
  );
}

function Fade({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(1px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(1px)" }}
      transition={{ duration: 0.2 }}
      key={id}
    >
      {children}
    </motion.div>
  );
}
