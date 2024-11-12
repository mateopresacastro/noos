import ProgressBar from "@/components/progress-bar";
import { formatTime, cn } from "@/lib/utils";
import { usePlayerStore } from "@/lib/zustand/store";
import { BsFillSkipStartFill, BsFillSkipEndFill } from "react-icons/bs";
import { FaStop, FaPlay } from "react-icons/fa";
import { LuDot, LuRepeat1 } from "react-icons/lu";
import { PiShuffleBold } from "react-icons/pi";

export default function Controls({ handleClick }: { handleClick: () => void }) {
  return (
    <div className="items-center hidden sm:flex sm:absolute sm:right-auto sm:left-1/2 sm:-translate-x-1/2 sm:flex-col w-1/3 gap-2">
      <Buttons handleClick={handleClick} />
      <Progress />
    </div>
  );
}

function Progress() {
  const { currentTime, duration } = usePlayerStore((state) => state);
  return (
    <div className="w-full flex items-center justify-between">
      <span className="text-xs text-neutral-400 mr-2">
        {formatTime(currentTime ?? 0)}
      </span>
      <ProgressBar />
      <span className="text-xs text-neutral-400 ml-2">
        {formatTime(duration ?? 0)}
      </span>
    </div>
  );
}

function Buttons({ handleClick }: { handleClick: () => void }) {
  const {
    playNext,
    playPrevious,
    setShuffle,
    setRepeat,
    shuffle,
    repeat,
    isPlaying,
  } = usePlayerStore((state) => state);

  return (
    <div className="w-50 flex sm:gap-4 md:gap-6">
      <button
        className={cn(
          "text-neutral-400 hover:text-neutral-50 transition active:scale-90 active:text-neutral-400",
          shuffle && "text-neutral-50 relative"
        )}
        onClick={() => setShuffle(!shuffle)}
      >
        <PiShuffleBold size={18} />
        {shuffle ? (
          <LuDot size={25} className="absolute -bottom-3 -left-[0.19rem]" />
        ) : null}
      </button>
      <button
        className="text-neutral-400 hover:text-neutral-50 transition active:scale-90 active:text-neutral-400"
        onClick={playPrevious}
      >
        <BsFillSkipStartFill size={25} />
      </button>
      <button
        className="text-neutral-900 size-8 flex items-center justify-center transition hover:bg-neutral-200 hover:scale-110 rounded-full bg-neutral-50 active:scale-100 active:bg-neutral-400"
        onClick={handleClick}
      >
        {isPlaying ? (
          <FaStop size={15} />
        ) : (
          <FaPlay size={15} className="ml-0.5" />
        )}
      </button>
      <button
        className="text-neutral-400 hover:text-neutral-50 transition active:scale-90 active:text-neutral-400"
        onClick={playNext}
      >
        <BsFillSkipEndFill size={25} />
      </button>
      <button
        className={cn(
          "text-neutral-400 hover:text-neutral-50 transition active:scale-90 active:text-neutral-400",
          repeat && "text-neutral-50 relative"
        )}
        onClick={() => setRepeat(!repeat)}
      >
        <LuRepeat1 size={18} />
        {repeat ? (
          <LuDot size={25} className="absolute -bottom-3 -left-[0.19rem]" />
        ) : null}
      </button>
    </div>
  );
}
