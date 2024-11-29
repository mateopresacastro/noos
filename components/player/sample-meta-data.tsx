import Image from "next/image";
import Link from "next/link";
import { usePlayerStore } from "@/lib/zustand/store";
import { cn } from "@/lib/utils";
import type { Dispatch, SetStateAction } from "react";

export default function SampleMetaData({
  drawer,
  setDrawerOpen,
}: {
  drawer?: boolean;
  setDrawerOpen?: Dispatch<SetStateAction<boolean>>;
}) {
  const { samplePack, playingSampleUrl } = usePlayerStore((state) => state);
  if (!samplePack) return null;
  const sampleName =
    samplePack?.samples.find((sample) => sample.url === playingSampleUrl)
      ?.title ?? "";

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Link
        href={`/${samplePack.creator.userName}/${samplePack.name}`}
        prefetch={true}
        onClick={() => setDrawerOpen && setDrawerOpen(false)}
      >
        <div
          className={cn(
            "size-10 rounded-lg sm:size-14 hover:opacity-80 transition-opacity duration-150 active:opacity-60",
            drawer && "size-12"
          )}
        >
          <Image
            src={samplePack.imgUrl}
            alt={samplePack.title}
            height={56}
            width={56}
            className={cn(
              "size-10 rounded-full sm:size-14",
              drawer && "size-12"
            )}
          />
        </div>
      </Link>
      <div className={cn("flex flex-col gap-1", drawer && "gap-3")}>
        <span
          className={cn("font-bold h-4 text-sm block", drawer && "text-lg")}
        >
          {sampleName}
        </span>
        <Link
          href={`/${samplePack.creator.userName}`}
          className="w-fit"
          prefetch={true}
          onClick={() => setDrawerOpen && setDrawerOpen(false)}
        >
          <span
            className={cn(
              "text-xs text-neutral-400 block hover:text-neutral-300 transition-all duration-150 active:text-neutral-400 w-fit",
              drawer && "text-sm"
            )}
          >
            @{samplePack.creator.userName}
          </span>
        </Link>
      </div>
    </div>
  );
}
