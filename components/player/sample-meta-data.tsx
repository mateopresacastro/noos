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
    <div className="flex items-center gap-2 sm:gap-4">
      <Link href={`/${samplePack.creator.userName}/${samplePack.name}`}>
        <div className="size-10 rounded-lg sm:size-14">
          <Image
            src={samplePack.imgUrl}
            alt={samplePack.title}
            height={56}
            width={56}
            className="size-10 rounded-lg sm:size-14"
          />
        </div>
      </Link>
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium h-4 sm:text-base block">
          {sampleName}
        </span>
        <Link href={`/${samplePack.creator.userName}`}>
          <span className="text-xs text-neutral-400 sm:text-sm block">
            @{samplePack.creator.userName}
          </span>
        </Link>
      </div>
    </div>
  );
}
