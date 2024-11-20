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
          className="fixed bottom-0 left-0 right-0 h-20 bg-neutral-900 border-t border-neutral-800 z-10 sm:h-28"
          transition={{ type: "spring", duration: 0.6 }}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          key="player"
        >
          <div className="max-w-7xl mx-auto h-full px-6">
            <div className="flex items-center justify-between h-full relative">
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
