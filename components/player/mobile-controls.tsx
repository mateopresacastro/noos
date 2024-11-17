import { usePlayerStore } from "@/lib/zustand/store";
import { FaStop, FaPlay } from "react-icons/fa";

export default function MobileControls({
  handlePlayStop,
}: {
  handlePlayStop: () => void;
}) {
  const { isPlaying } = usePlayerStore((state) => state);
  return (
    <button
      className="text-neutral-50 size-8 flex items-center justify-center rounded-full hover:scale-110 transition hover:text-neutral-200 sm:hidden active:scale-90 active:text-neutral-400"
      onClick={handlePlayStop}
    >
      {isPlaying ? <FaStop size={20} /> : <FaPlay size={20} />}
    </button>
  );
}
