import ProgressBar from "@/components/player/progress-bar";
import { cn } from "@/lib/utils";
import { usePlayerStore } from "@/lib/zustand/store";
import NumberFlow from "@number-flow/react";
import { BsFillSkipStartFill, BsFillSkipEndFill } from "react-icons/bs";
import { FaStop, FaPlay } from "react-icons/fa";
import { LuDot, LuRepeat1 } from "react-icons/lu";
import { PiShuffleBold } from "react-icons/pi";

export default function Controls({
  handlePlayStop,
}: {
  handlePlayStop: () => void;
}) {
  return (
    <div className="items-center hidden sm:flex sm:absolute sm:right-auto sm:left-1/2 sm:-translate-x-1/2 sm:flex-col w-1/3 md:w-1/2 gap-0.5">
      <Buttons handlePlayStop={handlePlayStop} />
      <Progress />
    </div>
  );
}
function TimeDisplay({ duration }: { duration: number }) {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  const animatedMinutes = (
    <NumberFlow
      willChange
      value={minutes}
      isolate
      continuous
      opacityTiming={{
        duration: 250,
        easing: "ease-out",
      }}
      transformTiming={{
        easing: `linear(0, 0.0033 0.8%, 0.0263 2.39%, 0.0896 4.77%, 0.4676 15.12%, 0.5688, 0.6553, 0.7274, 0.7862, 0.8336 31.04%, 0.8793, 0.9132 38.99%, 0.9421 43.77%, 0.9642 49.34%, 0.9796 55.71%, 0.9893 62.87%, 0.9952 71.62%, 0.9983 82.76%, 0.9996 99.47%)`,
        duration: 500,
      }}
    />
  );
  const animatedSeconds = (
    <NumberFlow
      willChange
      value={seconds}
      continuous
      format={{
        minimumIntegerDigits: 2,
      }}
      opacityTiming={{
        duration: 250,
        easing: "ease-out",
      }}
      transformTiming={{
        easing: `linear(0, 0.0033 0.8%, 0.0263 2.39%, 0.0896 4.77%, 0.4676 15.12%, 0.5688, 0.6553, 0.7274, 0.7862, 0.8336 31.04%, 0.8793, 0.9132 38.99%, 0.9421 43.77%, 0.9642 49.34%, 0.9796 55.71%, 0.9893 62.87%, 0.9952 71.62%, 0.9983 82.76%, 0.9996 99.47%)`,
        duration: 500,
      }}
    />
  );
  return (
    <span className="flex">
      {animatedMinutes}:{animatedSeconds}
    </span>
  );
}

function Progress() {
  const { currentTime, duration } = usePlayerStore((state) => state);
  return (
    <div className="w-full flex items-center justify-between">
      <span className="text-xs text-neutral-300 mr-2">
        <TimeDisplay duration={currentTime ?? 0} />
      </span>
      <ProgressBar />
      <span className="text-xs text-neutral-300 ml-2">
        <TimeDisplay duration={duration ?? 0} />
      </span>
    </div>
  );
}

function Buttons({ handlePlayStop }: { handlePlayStop: () => void }) {
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
        onClick={handlePlayStop}
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
