import Image from "next/image";
import Controls from "@/components/player/controls";
import MobileControls from "@/components/player/mobile-controls";
import SampleMetaData from "@/components/player/sample-meta-data";
import { Drawer } from "vaul";
import { usePlayer } from "@/components/player/use-player";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function MyDrawer() {
  const [open, setOpen] = useState(false);
  const { handlePlayStop, samplePack } = usePlayer();
  if (!samplePack) return null;

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <div className="h-full w-full px-3 backdrop-blur-3xl bg-neutral-900/50 border border-neutral-800 rounded-full mx-auto max-w-[110rem]">
          <div className="flex items-center justify-between h-full relative">
            <SampleMetaData />
            <MobileControls handlePlayStop={handlePlayStop} />
          </div>
        </div>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="backdrop-blur-3xl bg-neutral-900/60 flex flex-col rounded-t-[10px] h-screen fixed bottom-0 left-0 right-0 outline-none z-50">
          <div className="p-4 rounded-t-[10px] flex-1 w-full">
            <div className="max-w-2xl mx-auto flex flex-col justify-between h-full py-4 w-full">
              <div className="w-full relative">
                <Drawer.Title className="font-medium mb-4 text-neutral-50 mx-auto w-fit text-lg">
                  {samplePack?.title}
                </Drawer.Title>
                <ChevronDown
                  className="text-neutral-200 size-8 mr-2 absolute top-0"
                  onClick={() => setOpen(false)}
                />
              </div>
              <div className="w-full flex items-center justify-center self-center max-w-lg">
                <div className="w-full h-full aspect-square mb-4 object-cover relative">
                  <Image
                    src={samplePack.imgUrl}
                    alt={samplePack.title}
                    fill
                    sizes="20rem"
                    priority
                    quality={100}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="w-full flex flex-col gap-6">
                <SampleMetaData drawer={true} setDrawerOpen={setOpen} />
                <Controls handlePlayStop={handlePlayStop} drawer={true} />
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
