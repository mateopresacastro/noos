"use client";

import Controls from "@/components/player/controls";
import SampleMetaData from "@/components/player/sample-meta-data";
import Volume from "@/components/player/volume";
import { AnimatePresence, motion } from "framer-motion";
import { usePlayer } from "@/components/player/use-player";
import { useIsMobile } from "@/hooks/use-mobile";
import MyDrawer from "@/components/player/drawer";

export default function Player() {
  const { handlePlayStop, showPlayer, samplePack } = usePlayer();
  const isMobile = useIsMobile();
  if (!samplePack) return null;

  return (
    <AnimatePresence mode="popLayout">
      {showPlayer ? (
        <motion.div
          className="fixed bottom-0 left-0 right-0 h-16 z-10 sm:h-20 px-2 mb-1"
          transition={{ type: "spring", duration: 0.6 }}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          key="player"
        >
          {isMobile ? (
            <MyDrawer />
          ) : (
            <div className="h-full w-full px-3 backdrop-blur-3xl bg-neutral-900/50 border border-neutral-800 rounded-full mx-auto max-w-[110rem]">
              <div className="flex items-center justify-between h-full relative">
                <SampleMetaData />
                <Controls handlePlayStop={handlePlayStop} />
                <Volume />
              </div>
            </div>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
