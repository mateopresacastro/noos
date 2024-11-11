import * as Slider from "@radix-ui/react-slider";
import { usePlayerStore } from "@/lib/zustand/store";

export default function VolumeBar() {
  const { volume, setVolume } = usePlayerStore((state) => state);

  const handleValueChange = (value: number[]) => {
    setVolume(value[0]);
  };

  return (
    <Slider.Root
      className="relative flex h-5 w-32 items-center touch-none group cursor-pointer"
      defaultValue={[0]}
      value={[volume ?? 0]}
      max={1}
      onValueChange={handleValueChange}
      step={0.05}
      aria-label="Volume control"
    >
      <Slider.Track className="h-1 w-full rounded-full bg-neutral-700 relative">
        <Slider.Range className="h-full rounded-full bg-neutral-50 absolute" />
      </Slider.Track>
      <Slider.Thumb className="size-3 rounded-full bg-neutral-900 cursor-grab active:cursor-grabbing hidden group-hover:block group-active:block group-hover:scale-110 group-hover:bg-neutral-50" />
    </Slider.Root>
  );
}
