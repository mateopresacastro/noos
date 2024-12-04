import VolumeSlider from "@/components/player/volume-slider";
import { usePlayerStore } from "@/zustand/store";
import { Volume2 } from "lucide-react";
import { AiFillMuted } from "react-icons/ai";

export default function Volume() {
  const { muted, setMuted } = usePlayerStore((state) => state);

  return (
    <div className="items-center gap-2 hidden md:flex">
      <button
        className="text-neutral-400 hover:text-neutral-50 transition active:scale-90 active:text-neutral-400 mr-1"
        onClick={() => setMuted(!muted)}
      >
        {muted ? <AiFillMuted size={16} /> : <Volume2 size={18} />}
      </button>
      <VolumeSlider />
    </div>
  );
}
