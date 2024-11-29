"use client";

import Controls from "@/components/player/controls";
import SampleMetaData from "@/components/player/sample-meta-data";
import MobileControls from "@/components/player/mobile-controls";
import Volume from "@/components/player/volume";
import { Drawer } from "vaul";
import { AnimatePresence, motion } from "framer-motion";
import { usePlayer } from "@/components/player/use-player";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Player() {
  const { handlePlayStop, showPlayer, samplePack } = usePlayer();
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

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
            <Drawer.Root open={open} onOpenChange={setOpen}>
              <Drawer.Trigger asChild>
                <div className="h-full w-full px-3 backdrop-blur-3xl bg-neutral-900/50 border border-neutral-800 rounded-full mx-auto max-w-[110rem]">
                  <div className="flex items-center justify-between h-full relative">
                    <SampleMetaData />
                    <MobileControls handlePlayStop={handlePlayStop} />
                    <Controls handlePlayStop={handlePlayStop} />
                    <Volume />
                  </div>
                </div>
              </Drawer.Trigger>
              <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                <Drawer.Content className="bg-neutral-950 flex flex-col rounded-t-[10px] h-screen fixed bottom-0 left-0 right-0 outline-none z-50">
                  <div className="p-4 bg-neutral-900 rounded-t-[10px] flex-1 w-full">
                    <div className="max-w-md mx-auto flex flex-col justify-between h-full py-4 w-full">
                      <div className="w-full relative">
                        <Drawer.Title className="font-medium mb-4 text-neutral-50 mx-auto w-fit text-lg">
                          {samplePack?.title}
                        </Drawer.Title>
                        <ChevronDown className="text-neutral-200 size-8 mr-2 absolute top-0" />
                      </div>
                      <div>
                        <SampleMetaData />
                        <MobileControls handlePlayStop={handlePlayStop} />
                        <Controls handlePlayStop={handlePlayStop} />
                        <Volume />
                      </div>
                    </div>
                  </div>
                </Drawer.Content>
              </Drawer.Portal>
            </Drawer.Root>
          ) : (
            <div className="h-full w-full px-3 backdrop-blur-3xl bg-neutral-900/50 border border-neutral-800 rounded-full mx-auto max-w-[110rem]">
              <div className="flex items-center justify-between h-full relative">
                <SampleMetaData />
                <MobileControls handlePlayStop={handlePlayStop} />
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
