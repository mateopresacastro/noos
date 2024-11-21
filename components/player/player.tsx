"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePlayer } from "@/components/player/use-player";
import Controls from "@/components/player/controls";
import SampleMetaData from "@/components/player/sample-meta-data";
import MobileControls from "@/components/player/mobile-controls";
import Volume from "@/components/player/volume";

export default function Player() {
  const { handlePlayStop, showPlayer } = usePlayer();

  return (
    <AnimatePresence mode="popLayout">
      {showPlayer ? (
        <motion.div
          className="fixed bottom-0 left-0 right-0 h-20 z-10 sm:h-28 mx-auto px-2 mb-2"
          transition={{ type: "spring", duration: 0.6 }}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          key="player"
        >
          <div className="h-full w-full px-6 backdrop-blur-lg bg-neutral-900/50 border border-neutral-800 rounded-lg mx-auto">
            <div className="flex items-center justify-between h-full relative max-w-7xl mx-auto">
              <SampleMetaData />
              <MobileControls handlePlayStop={handlePlayStop} />
              <Controls handlePlayStop={handlePlayStop} />
              <Volume />
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
