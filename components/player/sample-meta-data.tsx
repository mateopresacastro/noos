import Image from "next/image";
import Link from "next/link";
import { usePlayerStore } from "@/lib/zustand/store";

export default function SampleMetaData() {
  const { samplePack, playingSampleUrl } = usePlayerStore((state) => state);
  if (!samplePack) return null;
  const sampleName =
    samplePack?.samples.find((sample) => sample.url === playingSampleUrl)
      ?.title ?? "-";

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Link
        href={`/${samplePack.creator.userName}/${samplePack.name}`}
        prefetch={true}
      >
        <div className="size-10 rounded-lg sm:size-14 hover:opacity-80 transition-opacity duration-150 active:opacity-60">
          <Image
            src={samplePack.imgUrl}
            alt={samplePack.title}
            height={56}
            width={56}
            className="size-10 rounded-full sm:size-14"
          />
        </div>
      </Link>
      <div className="flex flex-col gap-1">
        <span className="font-bold h-4 text-sm block">{sampleName}</span>
        <Link
          href={`/${samplePack.creator.userName}`}
          className="w-fit"
          prefetch={true}
        >
          <span className="text-xs text-neutral-400 block hover:text-neutral-300 transition-all duration-150 active:text-neutral-400 w-fit">
            @{samplePack.creator.userName}
          </span>
        </Link>
      </div>
    </div>
  );
}
